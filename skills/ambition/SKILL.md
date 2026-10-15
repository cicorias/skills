---
name: ambition
description: >-
  Raise the ambition of a task before doing it, using three lenses — Altitude
  (aim at the outcome, not the task), Depth (work like a field-leading expert:
  raw data, professional tools, unreasonably hard targets, an outside judge), and
  Range (borrow methods from other fields through a crew of specialist passes).
  Use when the user types /ambition or says "be more ambitious", "think bigger",
  "go deeper", "aim higher", "level this up", "raise the bar", "10x this", "what
  would an expert do here", or asks to rewrite a prompt, plan, or brief so it
  achieves more. Also use when a request is a routine deliverable — a report,
  QBR, deck, analysis, bug fix, or performance task — and the user wants the
  best possible outcome rather than the minimum. Produces an upgraded brief
  (rewritten prompt, stretch target, verification method, what access is
  needed) and can then carry it out.
argument-hint: "[task, prompt, or plan] [altitude|depth|range]"
---

# Ambition

Models are now capable of far more than most requests ask of them. The bottleneck
is usually the ask, not the model: people request the task they already know how to
do, at the depth they already know, inside the one field they already know. This
skill rewrites the ask before doing the work.

It is based on Felix Rieseberg's essay
[*How to be more ambitious: a tutorial for humans with models*](https://felixrieseberg.com/how-to-be-more-ambitious-a-tutorial-for-humans-with-models/),
which names four kinds of ambition: **Speed** (same work, less time — already
well understood, so skipped here), **Altitude**, **Depth**, and **Range**.

## When to use

- The user explicitly asks to think bigger, go deeper, or level up a prompt or plan.
- The user hands over a routine deliverable and success clearly matters more than
  speed (a quarterly review, a churn analysis, a recurring bug class, a slow page).
- The user wants a prompt or brief rewritten for another agent or person.

Do not use it to pad simple, well-scoped requests ("rename this variable"). If the
narrow version is genuinely what they want, say so in one line and do that.

## Inputs

- The task, prompt, or plan — from the arguments, the conversation, or a file.
- Optional lens filter: `altitude`, `depth`, or `range`. With none, apply all three
  but keep only the moves that actually change the result.

## Instructions

1. **Restate the ask in one sentence**, exactly as given. This is the baseline the
   upgrade must beat.

2. **Altitude — what should happen next?** Ask what outcome the task serves, then
   build a three-rung ladder: *the task* → *the decision or outcome it feeds* →
   *the system that makes the task unnecessary or continuous*. Pick the highest rung
   that is still achievable with available access. Then list what would take the
   human out of the loop (data the model can fetch itself, mappings it needs, an
   environment where it can reproduce and verify). Read
   [`references/altitude.md`](references/altitude.md) for the ladder pattern and
   worked examples.

3. **Depth — a deeper version, not a bigger one.** Answer these four questions
   before rewriting anything:
   1. What would a top professional in this field do that the user did not ask for?
   2. What is the rawest material they would start from?
   3. Which specific methods and tools would they use?
   4. What — other than the user or the model — would verify the result?

   Then set a **stretch target**: a specific, measurable goal well beyond the
   obvious one (10× rather than 2×), stated as solvable. Specific hard goals beat
   "do your best" — a long-standing finding in goal-setting research.
   Read [`references/depth.md`](references/depth.md) for the expert-instrument
   checklist, the outside-judge rules, and examples.

4. **Range — rewrite nouns as verbs, then assemble a crew.** Describe the work as
   the actions it involves ("a QBR" → "convince busy people of a cause-and-effect
   story, then decide under uncertainty in 30 minutes"). Each verb points at fields
   that are good at it. Pick 2–5 of those fields and define each crew member by
   *what it does*, never by who it pretends to be — "find the weakest claim and the
   evidence against it", not "you are a short seller". Role play makes transcripts
   stranger without improving results. Read
   [`references/range.md`](references/range.md) for crew recipes.

5. **Write the upgraded brief** using the output format below. Every addition must
   earn its place: if a lens produced nothing that changes the result, drop it.

6. **Confirm, then execute.** Show the brief and ask whether to run it, adjust it,
   or fall back to the original ask. If the user already said to just do it, go
   straight to execution. When running a crew, give each member its own subagent
   (Agent tool) in parallel, then merge their findings and have the outside judge
   check the result before reporting.

## Output format

```markdown
## Original ask
<one sentence>

## Upgraded brief
<the rewritten prompt or plan, ready to hand to an agent or person>

## Why this is better
- Altitude: <the higher outcome and why it is reachable>
- Depth: <the expert move, raw material, methods>
- Range: <the fields borrowed from and what each contributes>

## Stretch target
<specific, measurable, framed as solvable>

## Outside judge
<the test, benchmark, held-out data, or tool that verifies the result — not self-grading>

## Access needed
<data, connectors, machines, or permissions the model needs to do this without a human in the loop>
```

## Guardrails

- **Ambitious is not the same as bigger.** Scope creep fails the user. Prefer the
  sharper question, the rawer data, or the harder metric over more deliverables.
- **Never grade your own work.** If no outside judge exists yet, building one is the
  first step of the plan.
- **Be honest about reach.** If a rung needs access the model does not have, say
  what is missing instead of pretending it will work.
- **Respect a "no".** If the user wants the original scope, do the original scope
  well and do not re-litigate.

## Agent compatibility

The rewrite (steps 1–5) works in any `skills`-compatible agent. Step 6's parallel
crew uses Claude Code subagents (the Agent tool). In agents without subagents
(for example GitHub Copilot CLI), run each crew member as a separate sequential
pass with its own heading, then merge.
