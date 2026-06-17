---
name: norn
blurb: Your Markdown vault as a deterministic graph — query, validate, and repair from the shell.
description: A Rust CLI and MCP server that turns a Markdown vault into a deterministic graph you can query, validate, and repair — for shells, scripts, and coding agents.
short: vault tooling
lang: Rust
status: active
version: v0.38
license: MIT
order: 1
tagline: Obsidian gives you a GUI over your Markdown vault. norn gives you the same vault as a deterministic graph — one humans and agents can both query, validate, and repair from the command line.
links:
  github: https://github.com/dbtlr/norn
  changelog: https://github.com/dbtlr/norn/blob/main/CHANGELOG.md
facts:
  - label: Type
    value: CLI + MCP server
  - label: Runtime
    value: Native Rust binary
  - label: Vaults
    value: Any Markdown
demo: |
  cargo install --git https://github.com/dbtlr/norn norn-run
  norn -C ~/vault validate --summary
  norn -C ~/vault find --eq type:task --format records
  norn mcp --cwd ~/vault   # serve the vault to agents
---

## Why it exists

Having an agent maintain, migrate, and query a real Markdown vault took 20–30 minutes of tool calls per task — and something was always missed. Frontmatter querying, in particular, had no good tool. norn is the deterministic layer underneath: humans write freely, agents handle the maintenance, and the graph answers in one call instead of dozens.

The thesis is a chain — rules make the vault consistent, consistency makes queries accurate, accurate queries cut agent turns, and fewer turns mean less drift. Consistency is the end; agent-efficiency is the mechanism.

## What it does

- **Query like a database** — filter by frontmatter, trace backlinks, find unresolved links, search across documents.
- **Frontmatter as a contract** — declare required fields, allowed values, and shapes per note type; norn enforces them.
- **Validate in one pass** — every convention violation surfaced with stable, filterable codes.
- **Repair deterministically** — a reviewable plan, then an apply step. No model rewrites your notes.
- **One core, two surfaces** — the same primitives as a CLI and an MCP server, so agents inherit the dry-run, confirm, and audit for free.

## Plan, then apply

Mutation is never a black box. norn produces a schema-versioned, inspectable repair plan and only changes files when you apply it. The division of labor is deliberate: the agent decides, norn enumerates. No model sits in the loop rewriting prose — which is exactly what makes the result predictable enough to trust.
