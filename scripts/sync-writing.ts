import 'dotenv/config';
import { createHash } from 'node:crypto';
import { constants as fsConstants } from 'node:fs';
import { access, mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import matter from 'gray-matter';

type CliOptions = {
  dryRun: boolean;
  prune: boolean;
  renameSlugs: boolean;
  sourceDir: string;
  outputDir: string;
  manifestPath: string;
};

type ManifestArticle = {
  slug: string;
  outputPath: string;
  sourceHash: string;
  title: string;
  lastSyncedAt: string;
};

type Manifest = {
  version: 1;
  articles: Record<string, ManifestArticle>;
};

type SourceArticle = {
  sourcePath: string;
  sourceKey: string;
  slug: string;
  outputPath: string;
  sourceHash: string;
  title: string;
  body: string;
};

const defaultOutputDir = 'src/content/writing';
const manifestFileName = '.sync-manifest.json';
const sourceDirEnvVar = 'DBTLR_WRITING_SOURCE_DIR';

const options = parseArgs(process.argv.slice(2));
const result = await syncWriting(options);

for (const line of result) {
  console.log(line);
}

async function syncWriting(options: CliOptions): Promise<string[]> {
  const lines: string[] = [];
  const sourceDir = resolvePath(options.sourceDir);
  const outputDir = resolvePath(options.outputDir);
  const manifestPath = resolvePath(options.manifestPath);

  if (!(await exists(sourceDir))) {
    throw new Error(`source directory not found: ${sourceDir}`);
  }

  const manifest = await readManifest(manifestPath);
  const markdownFiles = await listMarkdownFiles(sourceDir);
  const articles: SourceArticle[] = [];
  const errors: string[] = [];

  for (const sourcePath of markdownFiles) {
    const parsed = await parseSourceArticle(sourcePath, sourceDir, outputDir, manifest, options.renameSlugs);
    if (parsed.status === 'skip') {
      lines.push(`skip ${path.relative(sourceDir, sourcePath)} (${parsed.reason})`);
      continue;
    }
    if (parsed.status === 'error') {
      errors.push(`${path.relative(sourceDir, sourcePath)}: ${parsed.reason}`);
      continue;
    }
    articles.push(parsed.article);
  }

  validateUniqueSlugs(articles, errors);

  if (errors.length > 0) {
    throw new Error(`writing sync failed:\n${errors.map((err) => `  - ${err}`).join('\n')}`);
  }

  const seenSources = new Set<string>();
  const nextManifest: Manifest = { version: 1, articles: { ...manifest.articles } };
  let changed = false;

  for (const article of articles) {
    seenSources.add(article.sourceKey);

    const previous = manifest.articles[article.sourceKey];
    const outputChanged =
      previous?.sourceHash !== article.sourceHash ||
      previous?.slug !== article.slug ||
      !(await exists(article.outputPath));

    if (!outputChanged) {
      lines.push(`unchanged ${article.slug}`);
      continue;
    }

    changed = true;
    lines.push(`${previous ? 'update' : 'create'} ${path.relative(process.cwd(), article.outputPath)}`);

    if (!options.dryRun) {
      await mkdir(path.dirname(article.outputPath), { recursive: true });
      await writeFile(article.outputPath, article.body, 'utf8');
    }

    if (previous && previous.outputPath !== path.relative(process.cwd(), article.outputPath)) {
      lines.push(`delete ${previous.outputPath}`);
      if (!options.dryRun) {
        const previousOutputPath = resolvePath(previous.outputPath);
        if (await exists(previousOutputPath)) {
          await unlink(previousOutputPath);
        }
      }
    }

    nextManifest.articles[article.sourceKey] = {
      slug: article.slug,
      outputPath: path.relative(process.cwd(), article.outputPath),
      sourceHash: article.sourceHash,
      title: article.title,
      lastSyncedAt: new Date().toISOString(),
    };
  }

  const staleEntries = Object.entries(manifest.articles).filter(([sourceKey]) => !seenSources.has(sourceKey));

  for (const [sourceKey, entry] of staleEntries) {
    const outputPath = resolvePath(entry.outputPath);

    if (!options.prune) {
      lines.push(`stale ${entry.outputPath} (run with --prune to remove)`);
      continue;
    }

    delete nextManifest.articles[sourceKey];
    changed = true;
    lines.push(`delete ${entry.outputPath}`);

    if (!options.dryRun && (await exists(outputPath))) {
      await unlink(outputPath);
    }
  }

  if (changed || staleEntries.length > 0) {
    if (options.dryRun) {
      lines.push('dry run: no files changed');
    } else {
      await mkdir(path.dirname(manifestPath), { recursive: true });
      await writeFile(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, 'utf8');
    }
  }

  if (articles.length === 0) {
    lines.push('no published articles found');
  }

  return lines;
}

async function parseSourceArticle(
  sourcePath: string,
  sourceDir: string,
  outputDir: string,
  manifest: Manifest,
  renameSlugs: boolean
): Promise<
  | { status: 'article'; article: SourceArticle }
  | { status: 'skip'; reason: string }
  | { status: 'error'; reason: string }
> {
  const raw = await readFile(sourcePath, 'utf8');
  const sourceKey = normalizePath(path.relative(sourceDir, sourcePath));
  const parsed = matter(raw);
  const data = parsed.data as Record<string, unknown>;
  const status = asOptionalString(data.status);

  if (status !== 'published') {
    return { status: 'skip', reason: status ? `status=${status}` : 'missing status=published' };
  }

  const title = asOptionalString(data.title);
  const blurb = asOptionalString(data.blurb);
  const lede = asOptionalString(data.lede);
  const tag = asOptionalString(data.tag);
  const date = formatDate(data.date);
  const explicitSlug = asOptionalString(data.slug);

  const missing = [
    ['title', title],
    ['blurb', blurb],
    ['date', date],
    ['tag', tag],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missing.length > 0) {
    return { status: 'error', reason: `missing required field(s): ${missing.join(', ')}` };
  }

  const previous = manifest.articles[sourceKey];
  const derivedSlug = slugify(explicitSlug ?? title!);

  if (!derivedSlug) {
    return { status: 'error', reason: 'title/slug does not produce a valid slug' };
  }

  if (previous && explicitSlug && previous.slug !== derivedSlug && !renameSlugs) {
    return {
      status: 'error',
      reason: `slug change from "${previous.slug}" to "${derivedSlug}" requires --rename-slugs`,
    };
  }

  const slug = previous && !renameSlugs ? previous.slug : derivedSlug;
  const publicData = { title: title!, blurb: blurb!, lede, date: date!, tag: tag! };
  const content = normalizeBody(parsed.content);
  const body = buildMarkdown(publicData, content);
  const sourceHash = sha256(JSON.stringify(publicData) + '\n' + content);

  return {
    status: 'article',
    article: {
      sourcePath,
      sourceKey,
      slug,
      outputPath: path.join(outputDir, `${slug}.md`),
      sourceHash,
      title: title!,
      body,
    },
  };
}

function validateUniqueSlugs(articles: SourceArticle[], errors: string[]): void {
  const bySlug = new Map<string, SourceArticle>();

  for (const article of articles) {
    const existing = bySlug.get(article.slug);
    if (existing) {
      errors.push(
        `slug collision "${article.slug}" between ${path.relative(process.cwd(), existing.sourcePath)} and ${path.relative(
          process.cwd(),
          article.sourcePath
        )}`
      );
    }
    bySlug.set(article.slug, article);
  }
}

function buildMarkdown(data: { title: string; blurb: string; lede?: string; date: string; tag: string }, content: string): string {
  const frontmatter = [
    '---',
    `title: ${yamlString(data.title)}`,
    `blurb: ${yamlString(data.blurb)}`,
    data.lede ? `lede: ${yamlString(data.lede)}` : undefined,
    `date: ${data.date}`,
    `tag: ${yamlString(data.tag)}`,
    '---',
  ].filter(Boolean);

  return `${frontmatter.join('\n')}\n\n${content}\n`;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: false,
    prune: false,
    renameSlugs: false,
    sourceDir: process.env[sourceDirEnvVar] ?? '',
    outputDir: defaultOutputDir,
    manifestPath: path.join(defaultOutputDir, manifestFileName),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--') {
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--prune') {
      options.prune = true;
      continue;
    }
    if (arg === '--rename-slugs') {
      options.renameSlugs = true;
      continue;
    }
    if (arg === '--source') {
      options.sourceDir = readValue(argv, ++i, arg);
      continue;
    }
    if (arg === '--output') {
      options.outputDir = readValue(argv, ++i, arg);
      options.manifestPath = path.join(options.outputDir, manifestFileName);
      continue;
    }
    if (arg === '--manifest') {
      options.manifestPath = readValue(argv, ++i, arg);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    throw new Error(`unknown option: ${arg}`);
  }

  if (!options.sourceDir) {
    throw new Error(`${sourceDirEnvVar} must be set in .env or passed with --source`);
  }

  return options;
}

function readValue(argv: string[], index: number, option: string): string {
  const value = argv[index];
  if (!value) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`Usage: pnpm sync:writing [options]

Sync published Markdown articles from a local source folder into Astro's writing collection.

Options:
  --dry-run          show planned changes without writing files
  --prune            delete generated posts whose source is gone or unpublished
  --rename-slugs     allow explicit slug changes to rename generated files
  --source <dir>     source folder (default: ${sourceDirEnvVar} from .env)
  --output <dir>     output folder (default: ${defaultOutputDir})
  --manifest <file>  manifest path (default: ${defaultOutputDir}/${manifestFileName})
`);
}

async function readManifest(manifestPath: string): Promise<Manifest> {
  if (!(await exists(manifestPath))) {
    return { version: 1, articles: {} };
  }

  const raw = await readFile(manifestPath, 'utf8');
  const parsed = JSON.parse(raw) as Manifest;

  if (parsed.version !== 1 || typeof parsed.articles !== 'object' || parsed.articles === null) {
    throw new Error(`unsupported writing sync manifest: ${manifestPath}`);
  }

  return parsed;
}

async function listMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listMarkdownFiles(fullPath);
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [fullPath];
      }
      return [];
    })
  );

  return files.flat().sort((a, b) => a.localeCompare(b));
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function resolvePath(filePath: string): string {
  const expanded = filePath.startsWith('~/') ? path.join(os.homedir(), filePath.slice(2)) : filePath;
  return path.resolve(expanded);
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function formatDate(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed.toISOString().slice(0, 10);
    }
  }
  return undefined;
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeBody(content: string): string {
  return content.replace(/\r\n/g, '\n').trim();
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
