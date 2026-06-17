---
name: saga
blurb: The orchestration layer for agentic coding — threads a body of work into one coherent session.
description: A Claude Code (and cross-harness) plugin of skills that runs a coherent working session — the narrative layer threading work into one through-line, from session start to session log.
short: session orchestration
lang: Claude Code plugin
status: early
version: v0.1
license: MIT
order: 3
tagline: The narrative layer for agentic coding. A saga is the story that sequences events; saga the tool does the same for work — weaving a knowledge tool and a work tool into one continuous session that survives compactions and fresh context windows.
links:
  github: https://github.com/dbtlr/saga
facts:
  - label: Type
    value: Claude Code plugin
  - label: Harnesses
    value: Claude Code + Codex
  - label: Skills
    value: "5"
demo: |
  # in Claude Code
  /plugin marketplace add dbtlr/saga
  /saga:start-session        # assemble the primer, route the work
  /saga:write-session-log    # memorialize decisions at a boundary
---

## Why it exists

Agentic coding sessions lose their through-line. Work spans more than one context window, and detail evaporates across compactions and fresh windows. saga is the orchestration layer that strings a body of work into one coherent session — owning neither knowledge nor work itself, but threading the two domain tools beneath it: [norn](/projects/norn/) for knowledge, [mimir](/projects/mimir/) for work.

It came out of a restart. An earlier single-tool design got bent when task-workflow concerns invaded the decision space — so orchestration was split out into its own layer.

## What it does

- **start-session** — assembles the session primer (user profile + shared memory + workspace brief) and routes the work; reloads on each resumption to hold the through-line.
- **grill-me** — Socratic interrogation that pressure-tests a plan against the workspace's glossary and recorded decisions.
- **write-session-log** — at a work boundary, writes the merged log of decisions, deviations, and consolidation candidates.
- **consolidate-sessions** — lifts durable lessons out of frozen logs into maintained context.
- **initialize-saga** — binds a project to a vault workspace and scaffolds or self-heals it.

## The session log is the record

saga deletes a category. Specs and plans are transient review surfaces, discarded on merge; the one durable retrospective is the session log — itself prunable once its lessons are lifted out. The test for keeping anything is blunt: would it matter if this were deleted? It's also the test the whole tool family passes — state your purpose without an "and." norn keeps knowledge. mimir holds work. saga weaves them into a session.
