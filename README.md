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

## Contributing

Add new skills under `skills/<skill-name>/SKILL.md`. See the [example skill format](https://skills.sh/) for reference.

