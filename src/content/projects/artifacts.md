---
name: Artifacts
blurb: Persistent links for agent-generated documents, images, and PDFs.
description: An MCP server and web interface that turn agent-generated documents, images, and PDFs into persistent links. Unversioned pre-alpha software for trusted networks.
short: share agent output
lang: TypeScript
status: pre-alpha
license: MIT
order: 4
tagline: Give agent output a link you can return to.
links:
  github: https://github.com/dbtlr/artifacts
facts:
  - label: Surfaces
    value: MCP · web
  - label: Content
    value: Documents · images · PDFs
  - label: Maturity
    value: Pre-alpha
demo: |
  # Connect to a local Artifacts server
  codex mcp add artifacts --url http://localhost:4242/mcp
---

Artifacts turns agent-generated Markdown, HTML, text, images, and PDFs into persistent links. An MCP server lets agents create and update content, and a small web interface makes that content readable and discoverable.

## Why it is useful

A report or mock is easier to review when it has a stable address. Artifacts gives the result its own page, and updates preserve the same URL.

## What it does

- Publishes documents, supported images, and PDFs through MCP.
- Preserves a link when its content changes.
- Groups related output in collections.
- Provides a web interface for reading and finding results.

Artifacts is unversioned pre-alpha software for trusted networks. It has no built-in authentication and is not a public hosting service.
