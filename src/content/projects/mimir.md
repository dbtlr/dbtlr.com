---
name: mimir
blurb: Local-first work-state tracker — one query layer, four surfaces, SQLite as the source of truth.
description: A local-first task and work-state tracker. SQLite is the source of truth; rollups and dependency predicates are derived live, never stored. One core, four surfaces.
short: work tracker
lang: TypeScript
status: active
version: v0.8
license: MIT
order: 2
tagline: One core query layer over four surfaces — a CLI for humans, an MCP server for agents, an HTTP API, and a web console — all speaking the same verbs over a single SQLite store. Work state stays the source of truth, without a sync problem.
links:
  github: https://github.com/dbtlr/mimir
  changelog: https://github.com/dbtlr/mimir/blob/main/CHANGELOG.md
facts:
  - label: Surfaces
    value: CLI · MCP · HTTP · console
  - label: Store
    value: SQLite, rollups derived
  - label: Scope
    value: Single operator
demo: |
  curl -fsSL https://raw.githubusercontent.com/dbtlr/mimir/main/install.sh | sh
  mimir next                       # ready tasks, in rank order
  mimir create task "wire the API" --parent MMR-2 --priority p1
  mimir start MMR-3 && mimir done MMR-3
---

## Why it exists

Task state is ephemeral and fast-changing, but a Markdown vault is optimized for durable, slow-changing knowledge. Storing work state as notes makes convention the only enforcement layer — and convention always decays: statuses drift, stale tasks pile up, rollups get hand-maintained. mimir moves work state into a structured SQLite store so the substrate fits the job. Markdown becomes a projection, not the source.

It's the *work* half of a split with [norn](/projects/norn/) (knowledge) and [saga](/projects/saga/) (orchestration).

## What it does

- **Models work as a tree** — project → initiative → phase → task — with two status axes per task: a lifecycle and a hold overlay.
- **Derives, never stores** — `ready`, `blocked`, `stale`, and every rollup are computed live, so there's no cache to fall out of sync.
- **One query surface, composable** — `next`, `list`, `get`, `status` with AND-composed filters and pipe-safe output formats.
- **Four transports, one core** — a CLI, an MCP server for agents, an HTTP API, and an installable web console.
- **Append-only history** — abandoned work stays abandoned; nothing is deleted.

## Derive, don't store

The spine running through every design decision: mimir stores work-state facts, never derived state or a consumer's semantics. Caching a rollup would reintroduce the very sync problem the tool exists to remove — so "what's next," "what's blocked," and "what's stale" are answered at read time. Rank, the one true ordering, beats every priority heuristic, because sometimes you place a P2 ahead of a P0 for a reason the system can't see.
