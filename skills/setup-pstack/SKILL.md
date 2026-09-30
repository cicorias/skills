---
name: setup-pstack
description: Configure which Claude models pstack uses per role and at what budget. Detects the models your Agent tool accepts and writes an always-loaded rule file that overrides the skill defaults. Use for /setup-pstack, "configure pstack models", "pstack budget", or changing pstack's model choices.
disable-model-invocation: true
---

# Setup pstack

Write `~/.claude/rules/pstack-models.md`, a rule file that sets pstack's model per role. Every pstack skill that spawns subagents reads this file by path, so it works whether or not your Claude Code version auto-loads user-level rules.

## Steps

### 1. Detect available models

Enumerate the values the Agent tool's `model` parameter accepts in this session (its schema lists them, typically `opus`, `sonnet`, `haiku`, and on some accounts `fable`). That is the dependable source. A full model ID (for example `claude-opus-5-5`) is also valid when the user names one. If you cannot detect any, ask the user which they have access to. Never write a value you have not confirmed is accepted. The alias `inherit` is always valid. It means the role runs on the parent session's model (omit `model`). Treat `inherit-parent` and `auto` from an older file as `inherit`.

Claude Code subagents run Claude models only. The upstream Cursor version of pstack mixed vendors (Claude, GPT, Grok) in its review panels. Here, panel diversity comes from mixing model tiers and from independent runs of the same model.

### 2. Load current state

The default role-to-model mapping is the rule shape shown in step 5 below. If `~/.claude/rules/pstack-models.md` already exists, read it and treat its `# budget` line and its role values as the current choices. Otherwise start from those defaults. A line whose role is not in step 5, such as `how critics`, is from a retired role. Drop it.

### 3. Budget, map, and confirm

**(a) Ask for a budget.** Prefer AskUserQuestion over free text. Offer these four options with these exact labels, and name the current budget when the rule records one.

- `max — opus everywhere`
- `balanced — opus for judgment, sonnet for code`
- `lean — sonnet for judgment, haiku for code`
- `inherit — every role on the parent model`

**(b) Apply it.** Build the working table from the skill defaults, and on a re-run keep any role the user changed by hand. `balanced` is the step 5 table as written. `max` sets every `sonnet` and `haiku` value, panel entries included, to `opus`. `lean` turns `opus` into `sonnet` and `sonnet` into `haiku`. `inherit` sets every role to `inherit`. If a result is not a detected value, use the next tier up that is detected, else mark the role as needing a choice. `inherit` values do not change.

**(c) Show the roles and confirm.** Show every role with its model, marking any value not in the detected set as needing a choice. Also list each line step 2 dropped. Ask whether to accept as-is or change specific roles, offering the detected models plus `inherit` as the options. Prefer AskUserQuestion over free text. For panel roles (arena runners, architect runners, interrogate reviewers) the value is a list, and one subagent runs per entry, `inherit` entries included, so the list length sets the count. Repeat a model to add an independent run of it. `arena cross-judge pool` is also a list, but Arena selects one value from it that differs from the parent's model when possible. `swarm workers` is the default model for every worker unless a race or comparison assigns another model per arm.

### 4. Validate

Every value written must be in the detected set or be `inherit`. If a chosen value is not available, stop and ask again.

### 5. Write the rule

Write `~/.claude/rules/pstack-models.md` with a `# budget` line with the chosen label, and one line per role, using the same labels poteto-mode uses. Overwrite the whole file so re-runs stay idempotent. No frontmatter, so it applies to every file when loaded. Shape:

```
# pstack model configuration (overrides skill defaults). One line per role. Delete a line to fall back to the skill default.
# Values are Agent tool `model` values. `inherit` runs the role on the parent model (omit `model`). Panel lists spawn one subagent per entry.
# budget: balanced
feature, refactoring: sonnet
bug-fix: sonnet
perf-issue: sonnet
hillclimb: sonnet
judgment and prose: opus
hardest tasks: opus
how explorer: sonnet
how explainer: opus
why investigators: sonnet
why synthesizer: opus
reflect tooling: sonnet
reflect judgment, divergent, synthesizer: opus
arena runners: opus, sonnet, opus
arena cross-judge pool: opus, sonnet
swarm workers: sonnet
architect runners: opus, sonnet, opus
interrogate reviewers: opus, sonnet, opus
```

Optionally, if the user wants the rule in context in every session and their Claude Code version does not auto-load `~/.claude/rules/`, add the line `@~/.claude/rules/pstack-models.md` to `~/.claude/CLAUDE.md` (once, never duplicated). Skills read the file by path either way, so this is not required.

### 6. Confirm

Tell the user the rule was written and that it applies to new subagent spawns immediately (skills read it at spawn time). Re-running this skill updates it.

### 7. Offer a verification skill (optional)

Check whether the project has a way to drive the real app for proof (a `verify-*` skill in `.claude/skills/`, or an existing harness). If not, offer once: "want a project-local verification skill, so agents can drive the app the way a user does and prove changes work? I can generate one with /create-verification-skill." On yes, read and follow `${CLAUDE_SKILL_DIR}/../create-verification-skill/SKILL.md`. On no, move on without pushing.
