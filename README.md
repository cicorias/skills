# skills

A collection of reusable agent skills. Works with **Claude Code**, **GitHub Copilot CLI**, and any other agent supported by the [`skills`](https://npm.im/skills) ecosystem.

## Installation

### Via `skills` npm package (works with Copilot CLI, Claude Code, Cursor, Codex, and more)

```bash
# Install all skills from this repo into the detected agent(s)
npx skills add cicorias/skills

# Target a specific agent
npx skills add cicorias/skills -a github-copilot
npx skills add cicorias/skills -a claude-code

# Install only one skill
npx skills add cicorias/skills --skill grill-me -a github-copilot
```

To list available skills without installing:

```bash
npx skills add cicorias/skills --list
```

### Via Claude Code plugin

```bash
claude plugin install git@github.com:cicorias/skills.git
```

## Skills

The catalog below is the living list of skills in this repo — add a row for each new skill (the [`/new-skill`](#new-skill) builder does this for you automatically).

| Skill | Invoke | What it does |
|-------|--------|--------------|
| [new-skill](#new-skill) | `/new-skill` | Scaffold a new skill and wire it into the plugin manifest + this catalog. |
| [grill-me](#grill-me) | `/grill-me` | Interview you about a task until it's fully scoped, then write `DESIGN.md`. |
| [claude-automation-recommender](#claude-automation-recommender) | `/claude-automation-recommender` | Analyze a codebase and recommend agent automations (read-only). |
| [simplified-technical-english](#simplified-technical-english) | `/simplified-technical-english` | Write, rewrite, or audit technical docs in Simplified Technical English (ASD-STE100). |

### `/new-skill`

Interactively authors a new skill in this repo. Interviews you for the skill's name, purpose, triggers, and tools; writes a well-formed `skills/<name>/SKILL.md`; and wires it into `.claude-plugin/plugin.json` and this README so it's immediately installable for Claude Code, GitHub Copilot CLI, and any other `skills`-compatible agent.

**Usage:**

```
/new-skill
/new-skill <skill-name>
```

### `/grill-me`

Interviews you about every aspect of your task before any implementation begins. Walks the full design tree, asking one question at a time and providing a recommended answer for each. Writes a `DESIGN.md` summary when complete.

**Usage:**

```
/grill-me
/grill-me <topic>
```

**Example:**

```
/grill-me auth system redesign
```

### `/claude-automation-recommender`

Analyzes a codebase and recommends agent automations — MCP servers, skills, hooks, subagents, plugins, slash commands — tailored to the project's stack. Read-only: it surfaces recommendations but does not modify files.

Ported from Anthropic's [`claude-code-setup`](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup) plugin (Apache-2.0). The skill includes an Agent Compatibility section so it produces sensible output under GitHub Copilot CLI as well as Claude Code. See [`NOTICE`](./NOTICE) for attribution.

**Usage:**

```
/claude-automation-recommender
"recommend automations for this project"
"what hooks should I use?"
```

> **Note on hooks under Copilot CLI:** Copilot CLI does not currently have a Claude-style PreToolUse/PostToolUse hooks runtime. Hook recommendations are educational only when running under Copilot; use Claude Code (or an equivalent feature in your agent) to act on them as written.

### `/simplified-technical-english`

Writes and edits technical documentation in **Simplified Technical English (STE)** — the controlled-language style defined by ASD-STE100 and used in aerospace, defense, and engineering. Use it to write procedures, descriptions, and warnings/cautions; rewrite or simplify existing text into plain, unambiguous English; or review/audit text for clarity, consistency, and translatability (especially for non-native readers and machine translation).

**Usage:**

```
/simplified-technical-english
"rewrite this procedure in Simplified Technical English"
"audit this section for STE compliance"
```

> Teaches STE principles and method — it is not the ASD-STE100 dictionary. For certified compliance, defer to the current specification and a checker tool.

## Agent Compatibility

Skills in this repo are designed to run under any agent that the [`skills`](https://npm.im/skills) CLI supports. Feature parity across the two primary targets:

| Category | Claude Code | GitHub Copilot CLI | Notes |
|----------|-------------|--------------------|-------|
| **MCP Servers** | ✅ | ✅ | Both support MCP. In Copilot CLI use `/mcp` to configure. |
| **Skills** | ✅ | ✅ | Copilot CLI: `/skills` — installed under `~/.copilot/skills/` (global) or `.agents/skills/` (project). |
| **Hooks** | ✅ | ❌ | Copilot CLI has no PreToolUse/PostToolUse runtime today. Hook recommendations are educational only. |
| **Subagents** | ✅ | ⚠️ partial | Copilot CLI has `/agent`, `/delegate`, and `/fleet`, but no Claude-style subagent definition format. |
| **Slash commands** | ✅ | ⚠️ partial | Copilot CLI ships built-in commands; skills can be invoked via `/<skill-name>`. No custom slash-command file format. |
| **Plugins** | ✅ | ✅ | Copilot CLI: `/plugin`. |

Install paths the `skills` CLI uses for each agent:

| Agent | `--agent` flag | Project path | Global path |
|-------|----------------|--------------|-------------|
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| GitHub Copilot CLI | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |

## Agent instructions

Instructions for agents working in this repo live in **[`AGENTS.md`](./AGENTS.md)** — the single source of truth. `CLAUDE.md` and `.github/copilot-instructions.md` are **symlinks** to it, so Claude Code and GitHub Copilot both read the same maintained file. Edit `AGENTS.md` only; never edit the symlinks directly.

## Contributing

The easiest way to add a skill is to run **`/new-skill`** — it interviews you, scaffolds `skills/<name>/SKILL.md`, and updates the plugin manifest and the Skills catalog above for you.

To add one by hand:

1. Create `skills/<skill-name>/SKILL.md` (kebab-case folder = frontmatter `name`; only `name` and `description` are required).
2. Add `"./skills/<skill-name>"` to the `skills` array in `.claude-plugin/plugin.json`.
3. Add a row to the **Skills** catalog table above.

See [`AGENTS.md`](./AGENTS.md) for the full SKILL.md format and conventions, and the [example skill format](https://skills.sh/) for reference.

