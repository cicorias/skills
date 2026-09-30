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
| [poteto-mode](#pstack) | `/poteto-mode` | pstack's hub: poteto's working style, playbooks (feature, bug fix, babysit, shipping, orchestrate, …), and the principles index. |
| [setup-pstack](#pstack) | `/setup-pstack` | Pick the Claude model (`opus` / `sonnet` / `haiku` / `inherit`) per pstack role; writes `~/.claude/rules/pstack-models.md`. |
| [how](#pstack) | `/how` | Explain how a subsystem works, with parallel explorer subagents for big questions. |
| [why](#pstack) | `/why` | Find why code is shaped the way it is from git, PRs, and every MCP evidence source. |
| [architect](#pstack) | `/architect` | Sketch types and module boundaries through a multi-model arena before implementing. |
| [arena](#pstack) | `/arena` | Run N candidates at one task, pick a base, graft the best parts of the rest. |
| [swarm](#pstack) | `/swarm` | Fan out N parallel workers (remote or worktree-isolated) and return one report. |
| [interrogate](#pstack) | `/interrogate` | Multi-model adversarial code review with a lead-judgment verdict. |
| [blast-radius](#pstack) | `/blast-radius` | Find what a change could break beyond the diff, and prove the safety fact by running code. |
| [figure-it-out](#pstack) | `/figure-it-out` | Design a bespoke, auditable playbook for large or unattended work. |
| [reflect](#pstack) | `/reflect` | Mine the session transcript for durable learnings and route them to skill edits. |
| [recall](#pstack) | `/recall` | Rebuild your recent working context from Claude Code transcripts and live state. |
| [automate-me](#pstack) | `/automate-me` | Turn your working conventions into a personal `<handle>-mode` skill. |
| [show-me-your-work](#pstack) | `/show-me-your-work` | Keep a TSV decision trail for long-running or unattended work. |
| [no-comments](#pstack) | `/no-comments` | Run the `comment-sicko` subagent over a diff, then fix what it flags. |
| [unslop](#pstack) | `/unslop` | Cut AI tells from any writing. |
| [technical-writing](#pstack) | `/technical-writing` | Layered standard for docs, RFCs, PR descriptions, and commit messages. |
| [teach](#pstack) | `/teach` | Explain a body of work plainly by weaving `how` and `why` together. |
| [bro](#pstack) | `/bro` | Restate the last message in plain language. |
| [tdd](#pstack) | `/tdd` | Red-green TDD when explicitly asked or when a cheap local test target exists. |
| [typescript-best-practices](#pstack) | `/typescript-best-practices` | TypeScript conventions for `.ts` / `.tsx` work. |
| [create-verification-skill](#pstack) | `/create-verification-skill` | Generate a project-local `verify-<app>` skill that drives the real app. |
| [maintain-verification-skill](#pstack) | `/maintain-verification-skill` | Keep a project's verification skill and feature map honest. |
| [make-bot-ui](#pstack) | `/make-bot-ui` | Build a local UI that fires a Claude Code routine's API trigger, optionally on Tailscale. |
| [principle-*](#pstack) (23 skills) | `/principle-<name>` | Leaf principles poteto-mode cites: laziness protocol, prove it works, fix root causes, model the domain, … |

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

### pstack

A Claude Code port of [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan ([poteto](https://x.com/poteto)), originally written for Cursor (MIT, see [`NOTICE`](./NOTICE)). It is a set of rigorous agent workflows for writing less code of higher quality: understand first (`/how`, `/why`), design before code (`/architect`, `/arena`), adversarial review (`/interrogate`), verified work, and parallel subagents you can trust. Start with `/poteto-mode`, and run `/setup-pstack` once to choose models.

It also ships two subagents in [`agents/`](./agents/):

- `poteto-agent` runs poteto-mode end to end. Spawn it with `subagent_type: "poteto-agent"`.
- `comment-sicko` is a comment-deleting reviewer that `/no-comments` spawns.

Installed through the Claude Code plugin, they are namespaced `skills:poteto-agent` and `skills:comment-sicko`. `npx skills` installs only skills. Copy `agents/*.md` into `.claude/agents/` or `~/.claude/agents/` yourself.

**What changed from the Cursor original:**

| Cursor | Claude Code |
|--------|-------------|
| `Task` tool, `subagent_type: generalPurpose`, `readonly: true` | Agent tool, `general-purpose` (or `Explore` for read-only search), with a read-only brief |
| Multi-vendor model slugs (`claude-opus-…-max`, `gpt-…`, `grok-…`) | Claude model aliases `opus` / `sonnet` / `haiku` / `inherit`. Panels get diversity by mixing tiers and running a model more than once |
| `~/.cursor/rules/pstack-models.mdc` | `~/.claude/rules/pstack-models.md`, which skills read by path |
| `environment: "cloud"` workers, Cursor dashboard | `isolation: "remote"` where available, else `isolation: "worktree"`, and `claude --cloud` sessions at claude.ai/code |
| `agent-transcripts/`, `~/.cursor/projects/` | `~/.claude/projects/<slug>/<session>.jsonl` (subagents in `<session>/subagents/`) |
| `.cursor/skills/`, `AskQuestion`, `create-skill` | `.claude/skills/`, `AskUserQuestion`, Anthropic's `skill-creator` plugin |
| `cursor-team-kit` `/deslop`, `control-ui`, `control-cli` | Built-in `/simplify`, `/run`, Claude in Chrome (`claude --chrome`) or Playwright MCP, `tmux` for CLIs |
| Bugbot-only triage | Any review bot (Bugbot, the `claude` GitHub App, Copilot). `watch-pr` also detects the `claude` bot |
| Grok Bot webhook routines (`make-bot-ui`) | Claude Code routine API triggers (research preview) |
| Skills calling skills | Skills keep `disable-model-invocation: true` and read `${CLAUDE_SKILL_DIR}/../<name>/SKILL.md` |

Not ported: the Cursor-only `automations/benny` pack (Cursor Automations) and the upstream `docs/guide`. The `poteto-mode` scripts (`watch-pr`, `orch`) need [Bun](https://bun.sh). `npx bun` works if Bun is not installed.

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

