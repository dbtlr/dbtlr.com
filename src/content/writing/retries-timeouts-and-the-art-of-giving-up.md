---
title: Retries, timeouts, and the art of giving up
blurb: Patterns for failing gracefully when the network won’t cooperate.
lede: Every distributed system is a negotiation with failure. The interesting question isn’t how to retry — it’s when to stop.
date: 2026-05-12
tag: systems
---

A retry is a bet. You’re wagering that the failure you just saw was **transient** — a dropped packet, a brief deploy, a database failing over — and that the same request, asked again politely, will succeed. Most of the time that bet pays off. The trouble starts when it doesn’t, and your retries become part of the problem.

The classic failure mode is the **retry storm**: a downstream service slows down, every caller retries, and the extra load makes the slowdown worse. The fix is boring and well-known — exponential backoff with jitter — but the details matter more than the idea.

## A budget, not a loop

I’ve started thinking about retries as a **budget** rather than a loop counter. Each attempt spends from a pool shared across the whole request, so a deep call stack can’t multiply retries at every layer. Here’s the shape of it:

```ts title="retry.ts"
// Exponential backoff with jitter
async function withRetry<T>(fn: () => Promise<T>, opts: RetryOpts = {}) {
  const { retries = 3, baseMs = 250 } = opts;
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries || !isTransient(err)) throw err;
      await sleep(baseMs * 2 ** attempt + jitter());
    }
  }
}
```

The guard clause is doing the real work: **knowing which errors are worth retrying**. A 503 with a Retry-After header is an invitation. A 400 is a verdict — asking again won’t change it.

<figure class="fig">
  <div class="ph" style="height: 280px;"><span>diagram — retry budget across call layers · drop image here</span></div>
  <figcaption>One budget shared across layers prevents multiplicative retry storms.</figcaption>
</figure>

## Knowing when to stop

Backoff caps the rate of retries; the budget caps the total. The last piece is a **deadline** — the point past which a slow success is indistinguishable from a failure, because the user already gave up. Everything downstream should inherit it:

- **Propagate deadlines**, don’t invent new timeouts at every hop.
- **Subtract elapsed time** before passing the deadline along.
- **Fail fast at zero** — a request with 10ms left shouldn’t open a connection.

In config form, the whole policy fits in a few lines — which is exactly how big a retry policy should be:

```yaml title="relaymesh.config.yaml"
delivery:
  deadline: 30s
  retry:
    budget: 4
    base: 250ms
    jitter: full
  dead_letter: on-budget-exhausted
```

Giving up isn’t failure — it’s the system telling the truth quickly. The dead-letter queue is where honesty goes to be retried later, on purpose, by a human or a cron job with more context than a hot loop ever has.
