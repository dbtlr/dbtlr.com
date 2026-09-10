---
name: Loom CLI
blurb: A TypeScript framework for command applications, with typed arguments, options, and schema validation.
description: A TypeScript framework for command applications with named commands, typed inputs, Standard Schema validation, and passthrough arguments.
short: command framework
lang: TypeScript
status: early
order: 3
tagline: Typed declarations for command applications.
links:
  github: https://github.com/dbtlr/loomcli
  docs: https://github.com/dbtlr/loomcli/blob/main/docs/core.md
  releases: https://github.com/dbtlr/loomcli/releases
facts:
  - label: Type
    value: Command framework
  - label: Validation
    value: Standard Schema
  - label: Maturity
    value: Early development
demo: |
  # From the Loom CLI repository
  pnpm install --frozen-lockfile
  pnpm build
  node examples/textstat/dist/src/main.js --metric words README.md
---

Loom CLI is a TypeScript framework for building command applications. It supports named commands, global and local options, required scalar and variadic arguments, Standard Schema validation, and passthrough arguments.

## Why it is useful

A command declaration describes the inputs an action receives. Loom CLI carries those types into the action, and schema validation checks and transforms values before the action runs.

## What it does

- Routes named commands under application-wide options.
- Derives argument and option types from declarations.
- Accepts Standard Schema validators without a dedicated adapter.
- Keeps passthrough arguments separate from parsed inputs.
- Provides shared output and failure behavior.

Loom CLI is in early development. The textstat and jsonkit examples demonstrate the current scope.
