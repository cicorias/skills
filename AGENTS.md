# Agent instructions for the `skills` repo

> **This is the single source of truth for agent instructions.**
> `CLAUDE.md` and `.github/copilot-instructions.md` are **symlinks** to this file.
> Edit `AGENTS.md` only — never edit the symlinks directly.

This repository is a **collection of reusable agent skills**. Each skill is a
self-contained folder that any [`skills`](https://npm.im/skills)-compatible agent
(Claude Code, GitHub Copilot CLI, Cursor, Codex, …) can install and invoke.

## What lives here

```
skills/
  <skill-name>/
    SKILL.md          # required — the skill definition (see format below)
    references/       # optional — supporting docs the skill can read
    scripts/          # optional — helper scripts the skill can run
.claude-plugin/
  plugin.json         # Claude Code plugin manifest — lists every skill
README.md             # human-facing catalog of skills
AGENTS.md             # ← you are here (canonical agent instructions)
CLAUDE.md             # symlink → AGENTS.md
.github/
  copilot-instructions.md  # symlink → ../AGENTS.md
```

## SKILL.md format

Each skill is a Markdown file with YAML frontmatter. **Only `name` and
`description` are required**; the rest are optional and mainly consumed by Claude Code.

```markdown
---
name: my-skill                       # required — kebab-case, matches the folder name
description: One or two sentences.    # required — what it does AND when to trigger it.
argument-hint: [topic]               # optional — shown for slash-command args
allowed-tools: [Read, Grep, Bash]    # optional — restrict tools (Claude Code)
license: Apache-2.0                   # optional
---

# My Skill

Instructions the agent follows when this skill is activated.

## When to use
...

## Instructions
1. ...
```

### Description field — the most important line

The `description` is how an agent decides whether to load the skill. Write it so it
names **both what the skill does and the triggers that should activate it** (user
phrases, slash-command name, task shapes). Keep it specific — vague descriptions
never fire.

## Adding a new skill

**Preferred:** run the builder skill — `/new-skill` — which interviews you, scaffolds
the folder, writes a well-formed `SKILL.md`, and updates `plugin.json` + the README
catalog automatically.

**Manually:**
1. Create `skills/<skill-name>/SKILL.md` (kebab-case folder = frontmatter `name`).
2. Add `"./skills/<skill-name>"` to the `skills` array in `.claude-plugin/plugin.json`.
3. Add a row to the **Skills** catalog table in `README.md`.
4. Keep supporting files under `references/` or `scripts/` inside the skill folder.

### Conventions
- Folder name, frontmatter `name`, and slash-command invocation all match (kebab-case).
- Ported/third-party skills: preserve their license and record attribution in `NOTICE`.
- Keep `SKILL.md` focused; push long reference material into `references/`.

## How skills get installed

The `skills` CLI **symlinks** skills into each agent's directory by default
(`--copy` to copy instead):

| Agent | `--agent` flag | Project path | Global path |
|-------|----------------|--------------|-------------|
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| GitHub Copilot CLI | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |

```bash
npx skills add cicorias/skills                 # install all into detected agent(s)
npx skills add cicorias/skills --list          # list without installing
npx skills add cicorias/skills -s <name> -a github-copilot
```

## Feature parity across agents

| Category | Claude Code | GitHub Copilot CLI |
|----------|-------------|--------------------|
| Skills | ✅ | ✅ |
| MCP servers | ✅ | ✅ (`/mcp`) |
| Plugins | ✅ | ✅ (`/plugin`) |
| Hooks | ✅ | ❌ (no PreToolUse/PostToolUse runtime) |
| Subagents | ✅ | ⚠️ partial (`/agent`, `/delegate`, `/fleet`) |
| Slash commands | ✅ | ⚠️ skills invocable as `/<name>`; no custom command files |

When a skill relies on a Claude-only feature (hooks, subagent definitions), note that
in the skill so it degrades gracefully under other agents.
