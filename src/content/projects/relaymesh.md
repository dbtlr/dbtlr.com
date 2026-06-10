---
name: relaymesh
blurb: Self-hosted webhook router with replay and dead-letter queues.
description: Self-hosted webhook router with replay, dead-letter queues, and a delivery dashboard. One binary, one config file.
short: webhook router
lang: TypeScript
status: active
version: v0.8
license: MIT
order: 1
tagline: A self-hosted webhook router. Receive once, deliver everywhere — with replay, dead-letter queues, and a dashboard that tells you what actually happened.
links:
  github: "#"
  docs: "#"
  changelog: "#"
facts:
  - label: Status
    value: Active development
  - label: Install
    value: npx relaymesh init
    mono: true
  - label: Runtime
    value: Node 20+ · single binary
thumbLabel: relaymesh — dashboard screenshot
shotLabel: relaymesh — delivery dashboard screenshot · drop image here
---

## Why it exists

Webhooks are the duct tape of the internet, and most of us handle them with a route handler and a prayer. relaymesh sits between your providers and your services: it **receives once**, verifies signatures, and **fans out** to any number of internal consumers — with every delivery logged, retryable, and replayable.

The design follows the retry philosophy I wrote about in [Retries, timeouts, and the art of giving up](/writing/retries-timeouts-and-the-art-of-giving-up/): budgets instead of loops, deadlines that propagate, and a dead-letter queue as a first-class destination rather than a shameful corner.

## What it does

- **Fan-out routing** — one inbound endpoint, many subscribers, filtered by event type.
- **Replay** — re-deliver any event to any subscriber, individually or in bulk.
- **Dead-letter queues** — exhausted deliveries park with full context for inspection.
- **Signature verification** — Stripe, GitHub, and generic HMAC out of the box.

## Getting started

```sh title="terminal"
# scaffold a config and start routing
npx relaymesh init
npx relaymesh up --config relaymesh.config.yaml
```

<figure class="fig">
  <div class="ph" style="height: 240px;"><span>diagram — provider → relaymesh → consumers · drop image here</span></div>
  <figcaption>One inbound endpoint; verified, logged, fanned out.</figcaption>
</figure>
