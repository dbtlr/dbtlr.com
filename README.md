# dbtlr.com

Personal site for [dbtlr.com](https://dbtlr.com) — a calm, typography-led dark-mode
portfolio and blog. Built as a fully static site with **Astro 6** and **Tailwind 4**,
deployed to **Cloudflare Workers** static assets.

No client framework ships: the only browser JS is a ⌘K search palette and code-copy
buttons (`src/scripts/`). Code blocks are highlighted at build time with Shiki using a
custom theme mapped to the design tokens.

## Requirements

- **Node 24**
- **pnpm** (the package manager — never npm; pinned via `packageManager` in `package.json`)

## Development

```sh
pnpm install
pnpm dev        # local dev server with HMR
pnpm build      # static build to ./dist
pnpm preview    # serve the built ./dist locally
pnpm check      # astro check (type checking)
```

## Workflow

Work happens on feature branches and lands through pull requests:

```
feature branch  →  PR to main  →  preview deploy  →  merge to main  →  production
```

- **PR previews** (`.github/workflows/preview.yml`): every PR against `main` runs
  `pnpm check` + `pnpm build`, then `wrangler versions upload` publishes an ephemeral
  version of the `dbtlr-com` Worker **without** touching production. The preview URL is
  posted (and kept updated) as a comment on the PR.
- **Production** (`.github/workflows/deploy.yml`): pushing to `main` runs the same
  checks and `wrangler deploy`, publishing the `dbtlr-com` Worker that serves
  [dbtlr.com](https://dbtlr.com).

Both workflows use Node 24 + pnpm and require `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` repository secrets.

## Checks

Run before pushing — these are exactly what CI runs:

```sh
pnpm check && pnpm build
```

## Project structure

```
astro.config.mjs        Astro config — Shiki theme + code-block chrome transformer
wrangler.jsonc          Cloudflare Worker (static assets from ./dist)
src/
  pages/                routes — home, about, projects, writing, feed.xml, search.json, 404
  layouts/Base.astro    shared page shell
  components/           SectionHead, PostRow
  content/              Markdown content collections (projects/ populated; writing/ pending)
  content.config.ts     collection schemas (zod) — writing + projects
  scripts/              vanilla JS — search.js (⌘K palette), copy.js (code copy)
  styles/global.css     Tailwind 4 theme tokens + component CSS
.github/workflows/      deploy.yml (production), preview.yml (PR previews)
```
