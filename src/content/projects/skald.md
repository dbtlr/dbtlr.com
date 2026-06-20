---
name: skald
blurb: An AI git CLI that writes your commit messages and pull requests, so you stay in flow.
description: An AI-powered git workflow CLI (sk) that generates commit messages, PR titles, and descriptions from your diff and history. One Rust binary, multiple AI providers and platforms.
short: AI git CLI
lang: Rust
status: active
version: v0.5
license: MIT
order: 4
tagline: Stop writing commit messages by hand. skald reads your staged diff, offers a carousel of candidates, and drafts full PR titles and descriptions — so you stay in flow and let the tool handle the prose.
links:
  github: https://github.com/dbtlr/skald
  changelog: https://github.com/dbtlr/skald/blob/main/CHANGELOG.md
facts:
  - label: Type
    value: AI git CLI
  - label: Binary
    value: sk
    mono: true
  - label: Providers
    value: Claude · Codex · Gemini · +2
demo: |
  cargo install skald-cli
  sk commit          # carousel of AI commit messages
  sk pr -y           # open a PR, title + body written for you
  sk doctor          # check providers and config
---

## Why it exists

Writing good commit messages and pull-request descriptions is a repetitive context-switch that breaks flow. skald automates the prose: it reads your staged diff — and for PRs, your branch diff and commit history — and drafts the message, so you stay focused on the code. It is intentionally narrower than the rest: a tool for composition, which is what a skald, the Norse court poet, did.

## What it does

- **Commit messages from your diff** — an interactive carousel to cycle candidates before you commit, with optional multi-line bodies.
- **Pull requests, written for you** — titles and descriptions from your branch diff and history; create or update the PR directly.
- **Many providers** — Claude, Codex, Gemini, OpenCode, and Copilot; GitHub and GitLab.
- **Layered config** — global plus per-project YAML, flag aliases, and ejectable prompt templates.
- **`sk doctor`** — environment and provider checks, with `--fix`.

## Actually do things

The principle that sets the tone: actually do things. Unlike tools that only print a suggested message, `sk` commits, opens PRs, and talks to your git host. The rest follows from a few rules — beautiful by default, quiet when piped; fix it, don't complain, never a raw error without guidance; zero-friction day one, with a provider path that reuses an existing CLI login so there's no API key to set up.
