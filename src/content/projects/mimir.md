---
name: mimir
icon: /projects/mimir.svg
blurb: Local work state in a Norn-managed Markdown vault, with queues and status derived when queried.
description: A local-first work-state engine over a Norn-managed, git-backed Markdown vault. The CLI, MCP server, HTTP API, and operator console share one work model.
short: work state
lang: TypeScript
status: active
license: MIT
order: 2
tagline: Local work state, with the next action derived from the facts.
links:
  github: https://github.com/dbtlr/mimir
  changelog: https://github.com/dbtlr/mimir/blob/main/CHANGELOG.md
  releases: https://github.com/dbtlr/mimir/releases
facts:
  - label: Surfaces
    value: CLI · MCP · HTTP · console
  - label: Store
    value: Norn-managed Markdown
  - label: Scope
    value: Single operator
demo: |
  mimir overview     # current direction and active work
  mimir next         # ready tasks, in rank order
  mimir list         # the live work queue
---

Mimir keeps projects, tasks, dependencies, decisions, and work products in a Norn-managed, git-backed Markdown vault. The CLI, MCP server, HTTP API, and operator console share the same work model.

## Why it exists

Long-running work needs a reliable answer to what is active, what is blocked, and what comes next. Mimir gives those questions a structured model while keeping the underlying records inspectable as Markdown.

## What it does

- Organizes projects, initiatives, phases, and tasks.
- Derives queues, status rollups, and blockers when queried.
- Preserves work products as Artifacts and temporary context as Scratchpads.
- Tracks new ideas and cross-project requests as Seeds.
- Gives agents session context and operators a console across projects.

## Store facts, derive the view

Markdown is the system of record. Norn owns validated access to the vault. Mimir derives what is ready, awaiting, or stale from the stored facts, so there is no second project-status record to synchronize.
