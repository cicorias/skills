# Altitude — aim at the outcome, not the task

Altitude means letting the model work at a higher level of abstraction. The guiding
question is **"what do you want to happen next?"** — the thing the task is *for*.

## The ladder

Climb one rung at a time and stop at the highest rung the available access supports.

| Rung | Shape | Example: crashes | Example: quarterly business review |
|------|-------|------------------|-----------------------------------|
| 1. Task | Do the thing asked | Fix this crash | Fill in the QBR template |
| 2. Outcome | Serve the decision or result the task feeds | Explain what changed, why, and what to do | Find the three most urgent decisions and draft the case for and against each |
| 3. System | Make the task continuous or unnecessary | Keep the apps crash-free | Design a better early-warning mechanism than a quarterly deck, validate it against past quarters, and run it alongside the current process for one quarter |

Signals that a task should climb:

- It recurs (weekly, per release, per incident).
- It exists to feed a meeting or a decision. Meetings are a strong hint.
- The user would be happier if the problem stopped happening than if it were handled well.

Altitude fits outcome-driven work best. For creative work (a poem, a logo), the
"outcome" is usually the artifact itself; use Depth and Range instead.

## Taking the human out of the loop

A higher-altitude workflow only lasts if the model can run it without a person
ferrying information. List what that takes:

- **Fetchable inputs** — can the model pull the crash reports, metrics, tickets, or
  logs itself (API, MCP connector, CLI), instead of having them pasted in?
- **Joins and mappings** — e.g. app version → git commit, customer ID → account
  owner. Missing mappings are the most common blocker.
- **A place to act and verify** — machines or sandboxes for each target platform,
  test environments, staging data.
- **A trigger** — a schedule, webhook, or hook that starts the run without a human.

Put anything that does not exist yet under **Access needed** in the brief. Building
it is often the most valuable part of the work.

## Worked example

> Original ask: "Write up why signups dropped last week."

- Rung 2: "Find what caused the drop, quantify each cause, and recommend the two
  changes with the highest expected recovery, with the case against each."
- Rung 3: "Build a daily signup-anomaly check that attributes drops to their likely
  cause (deploys, campaigns, outages, seasonality), backtest it on the last 12
  months, and post to #growth when it fires."
- Access needed: read access to the analytics warehouse, the deploy log, and the
  marketing calendar; a channel webhook.
