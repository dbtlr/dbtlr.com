import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const current = ['norn', 'mimir', 'loomcli', 'artifacts', 'skald'];
const search = JSON.parse(await read('search.json'));
assert.deepEqual(search.filter((item) => item.type === 'project').map((item) => item.href),
  current.map((slug) => `/projects/${slug}/`), 'Search must list current projects in portfolio order');
for (const path of ['index.html', 'projects/index.html', 'about/index.html']) {
  const html = await read(path);
  assert.ok(!html.includes('/projects/saga/'), `${path} must not promote retired Saga`);
}
for (const [path, expected] of [
  ['index.html', ['norn', 'mimir', 'loomcli']],
  ['projects/index.html', current],
]) {
  const html = await read(path);
  const rows = [...html.matchAll(/<a\b[^>]*class="group [^"]*"[^>]*href="([^"]+)"/g)]
    .map((match) => match[1]);
  assert.deepEqual(rows, expected.map((slug) => `/projects/${slug}/`),
    `${path} must show exactly its intended project rows`);
}
const saga = await read('projects/saga/index.html');
assert.match(saga, /Retired/);
assert.match(saga, /no longer under development/);
assert.ok(!saga.includes('code-file'), 'The retirement page must not offer a terminal demo');
for (const slug of [...current, 'saga']) {
  const html = await read(`projects/${slug}/index.html`);
  assert.ok(!/\bv\d+\.\d+/.test(html), `${slug} must not publish a fixed version badge`);
}
const mimir = await read('projects/mimir/index.html');
assert.match(mimir, /Markdown is the system of record/);
assert.ok(!mimir.includes('SQLite'), 'Mimir must not describe the retired SQLite backend');
console.log('Built project pages and search satisfy the current/retired content contract.');
