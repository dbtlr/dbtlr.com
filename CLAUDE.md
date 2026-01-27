# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

```bash
pnpm run dev          # Start Astro dev server
```

### Build & Deploy

```bash
pnpm run build        # Type check and build for production
pnpm run preview      # Preview production build locally
pnpm run deploy       # Deploy to Cloudflare Pages via Wrangler
```

### Code Quality

```bash
pnpm run check        # Run typecheck and lint
pnpm run typecheck    # Run Astro type checker
pnpm run lint         # Run ESLint (max-warnings=0)
```

### Cloudflare

```bash
pnpm run typegen      # Generate types for Cloudflare bindings (run after wrangler.toml changes)
pnpm run logs         # Tail Cloudflare Pages deployment logs
```

## Architecture

### Stack

- **Framework**: Astro (SSR mode, deployed to Cloudflare Pages)
- **Styling**: Tailwind CSS v4 with custom accent color (`--color-accent: #ec4899`)
- **Icons**: astro-icon (supports lucide icons via `name="lucide:icon-name"`)
- **Deployment**: Cloudflare Pages with Cloudflare adapter
- **Email**: MailerSend API for contact form

### Project Structure

```
src/
├── components/       # Reusable Astro components
│   ├── Form/        # Form field components (InputField, TextareaField)
│   ├── PageHeader.astro  # Navigation with mobile menu (uses Astro.url.pathname for active state)
│   └── PageFooter.astro
├── layouts/
│   └── BaseLayout.astro  # Base HTML layout with header/footer
├── pages/           # File-based routing (index.astro, contact.astro, 404.astro)
├── styles/
│   └── global.css   # Tailwind v4 CSS with @theme and @layer
├── utils/
│   └── sendMail.ts  # MailerSend API integration
├── icons/           # Custom SVG icons
└── images/          # Static images
```

### Key Patterns

**Active Navigation**: `PageHeader.astro` uses `Astro.url.pathname` to highlight current page (line 17).

**Contact Form**: `contact.astro` handles POST requests server-side, validates input, and calls `sendMail()` with Cloudflare env bindings accessed via `Astro.locals.runtime.env`.

**Tailwind v4**: Uses `@import 'tailwindcss'` and `@theme` directive in `global.css` (not `tailwind.config.js`).

**Icon Usage**: Use `<Icon name="lucide:icon-name" />` from astro-icon components.

**Path Aliases**: `~/*` maps to `./src/*` (configured in tsconfig.json).

### Environment Bindings

Cloudflare Pages bindings (for MailerSend) must be configured manually in the Cloudflare dashboard, NOT in `wrangler.toml`. Required env vars:

- `MAILERSEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_FROM_NAME`
- `EMAIL_TO`
- `EMAIL_TO_NAME`
- `EMAIL_SUBJECT`

Access these via `Astro.locals.runtime.env` in server contexts.

### TypeScript

Uses Astro's strict tsconfig. JSX config is set to React (`jsxImportSource: "react"`) but the project uses `.astro` files, not JSX.

### Linting & Formatting

- ESLint: `eslint.config.mjs` with eslint-plugin-astro
- Prettier: Single quotes, trailing commas, 2-space tabs, astro parser
- Pre-commit hooks: husky + lint-staged run eslint and prettier on staged files
- `pnpm run lint` enforces `max-warnings=0`
