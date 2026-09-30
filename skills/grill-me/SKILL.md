---
name: grill-me
description: Interview the user about every aspect of their task until a shared understanding is reached. Use this skill when the user types /grill-me or says "grill me", "interview me", "ask me questions first", "walk me through the design", or any time the task is ambiguous and needs to be fully scoped before work begins. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one, providing a recommended answer for each question.
argument-hint: [topic]
allowed-tools: [Read, Glob, Grep, Bash]
---

# Grill Me

A structured interview skill that resolves every design decision in a task before any implementation begins. Claude asks one question at a time, provides a recommended answer, and either waits for the user's input or answers the question itself by exploring the codebase.

## On Start

1. **Greet briefly.** Tell the user you're going to interview them about their task (or the topic in `$ARGUMENTS` if provided).

2. **Offer a codebase scan:**
   > "Should I scan the codebase first so I can give context-aware recommendations? (yes / skip)"
   - If yes: run a targeted exploration (file tree, key config files, package.json / go.mod / pyproject.toml, README) before asking the first question. Summarize what you found in 2–3 sentences, then begin.
   - If skip: begin immediately.

3. **Announce the toggle commands** so the user knows they exist:
   > "During the interview you can say **'use codebase'** or **'skip codebase'** at any time to toggle whether I read files for context."

## Conducting the Interview

### One question at a time

Ask exactly one question per turn. Never batch multiple questions in one message.

### Question format

```
**Q{n}: {question}**

My recommendation: {your recommended answer, with brief reasoning}
```

Always provide a recommendation. If you have no strong opinion, say so and explain the tradeoff instead.

### Answering questions yourself

If a question can be definitively answered by reading the codebase (e.g. "what database does this project use?"), **do not ask the user** — read the relevant files, state what you found, and move on.

Only ask the user about decisions that require their intent, preference, or domain knowledge.

### Respecting the codebase toggle

- **'use codebase'**: re-enable file reads; use them to answer subsequent questions autonomously where possible.
- **'skip codebase'**: stop reading files; ask the user instead.

### Design tree traversal

Maintain a mental map of the decision tree for the task. Resolve blocking decisions before dependent ones. After each answer, identify the next unresolved branch and ask about it.

**Decision categories to cover (adapt to the task):**

- **Scope** — what is in / out of scope for this task?
- **Users / stakeholders** — who is this for? what do they need?
- **Data model** — what data is created, stored, read, mutated, deleted?
- **Interfaces** — API contracts, UI surfaces, CLI flags, events?
- **Dependencies** — external services, libraries, auth, infrastructure?
- **Error handling** — what can go wrong? how should failures be surfaced?
- **Testing** — what does "done and correct" look like? how will it be verified?
- **Constraints** — performance, security, compliance, backwards-compatibility?
- **Rollout** — how does this ship? feature flags, migrations, phased rollout?

Not every category applies to every task — skip irrelevant branches.

## Ending the Interview

When all unresolved branches in the design tree have been answered (either by the user or by codebase exploration), declare the interview complete:

> "I think we've covered all the decision branches. Here's what I'm going to write to DESIGN.md — let me know if anything needs changing before I save it."

Print a preview of the DESIGN.md content, then wait for confirmation or corrections. Once confirmed, write the file.

## Writing DESIGN.md

Write `DESIGN.md` to the **project root** (the directory where Claude Code is running). Overwrite if it already exists.

### DESIGN.md structure

```markdown
# Design: {task title}

## Summary
{2–3 sentence description of the task and its goal}

## Decisions

### {Decision Category}
- **{Decision}:** {Agreed answer}
  - *Reasoning:* {brief rationale}

...repeat for all decisions...

## Open Questions
{Any remaining unknowns the user explicitly deferred — if none, omit this section}

## Next Steps
1. {First concrete implementation step}
2. {Second step}
...
```

## After Writing DESIGN.md

After confirming the file was written, offer to begin implementation:

> "DESIGN.md is saved. Want me to start implementing based on this plan?"

If yes: proceed. If no: stop — the user will take it from here.
