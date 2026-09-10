---
name: Loom
icon: /projects/loomcli.ico
blurb: A batteries-included, strongly typed CLI framework. Beautiful for humans and agent-native by default.
description: A batteries-included, strongly typed framework for building CLI applications that are beautiful for humans and agent-native by default.
short: human and agent-native CLIs
lang: TypeScript
status: early
order: 3
tagline: A batteries-included, strongly typed framework for building CLI applications that are beautiful for humans and agent-native by default.
links:
  github: https://github.com/dbtlr/loomcli
  docs: https://github.com/dbtlr/loomcli/blob/main/docs/core.md
  releases: https://github.com/dbtlr/loomcli/releases
facts:
  - label: Type
    value: CLI application framework
  - label: Validation
    value: Standard Schema
  - label: Maturity
    value: Early development
demo: |
  # From the Loom repository
  pnpm install --frozen-lockfile
  pnpm build
  node examples/textstat/dist/src/main.js --metric words README.md
---

## Why it exists

A CLI is an interface for people and, increasingly, for agents. Both deserve a deliberate design: an application that feels good to use in a terminal and gives an agent a clear, dependable way to work.

Loom’s north star is to make that the default. A batteries-included framework should bring the pieces of a complete CLI application together, with strong types connecting its declarations, inputs, and actions. Human experience and agent interaction belong in the framework’s foundations, so application authors can focus on what their tools do.

## What it does today

Loom is in early development. Its TypeScript core establishes the typed command model that the broader vision builds on:


- Routes named commands under application-wide options.
- Derives argument and option types from declarations.
- Accepts Standard Schema validators without a dedicated adapter.
- Keeps passthrough arguments separate from parsed inputs.
- Provides shared output and failure behavior.

The textstat and jsonkit examples demonstrate the current scope.
