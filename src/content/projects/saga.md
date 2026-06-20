---
name: saga
blurb: Agent memory for coding sessions — carries profile, shared memory, and workspace context across runs.
description: A memory provider for coding agents that assembles session context, preserves continuity across fresh runs, and turns finished work into durable workspace memory.
short: agent memory
lang: Agent memory
status: early
version: v0.1
license: MIT
order: 3
tagline: "Coding agents need more than a prompt. saga provides the memory layer: user profile, shared operating knowledge, workspace context, and session records that survive compactions, fresh windows, and long-running work."
links:
  github: https://github.com/dbtlr/saga
facts:
  - label: Type
    value: Memory provider
  - label: Harnesses
    value: Claude Code + Codex
  - label: Scope
    value: User · shared · workspace
demo: |
  Session start
  ├─ User Profile
  ├─ Shared Memory
  └─ Workspace Brief

  Work boundary
  └─ Session Log → durable memory
---

## Why it exists

Agentic coding sessions lose their through-line. Work spans more than one context window, and detail evaporates across compactions, restarts, and fresh runs. saga exists to make memory explicit: what the agent should know about the user, what it should carry across projects, what matters in this workspace, and what was learned from the work that just finished.

It came out of a restart. The first shape put too much of the story on commands and workflows. The durable need was simpler: a provider for the context a coding agent needs before it starts, and a path for completed work to become maintained memory instead of buried transcript.

## What it does

- **Assembles active context** — user profile, shared memory, and workspace brief arrive before the agent starts making choices.
- **Keeps workspace language live** — glossary and decisions stay available as constraints, not archive files the agent forgets to check.
- **Records work boundaries** — session logs capture decisions, deviations, and consolidation candidates when a body of work finishes.
- **Promotes durable lessons** — repeated or important lessons move out of logs and into maintained memory.
- **Separates memory from procedure** — durable facts live as memory; commands and workflows stay in the harness.

## The session log is the record

saga deletes a category. Specs and plans are transient review surfaces, discarded on merge; the durable retrospective is the session log — itself prunable once its lessons are lifted out. The test for keeping anything is blunt: would it matter if this were deleted? That is the memory-provider line: keep the facts that change future work, and let the rest disappear.
