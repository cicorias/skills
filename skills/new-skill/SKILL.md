---
name: new-skill
description: Scaffold a new agent skill in this repository. Use when the user types /new-skill or says "add a new skill", "create a skill", "build a skill", "scaffold a skill", or "make a new skill". Interviews the user for the skill's purpose and triggers, writes a well-formed skills/<name>/SKILL.md, and wires up the plugin manifest and README catalog so the skill is installable for Claude Code, GitHub Copilot CLI, and other skills-compatible agents.
argument-hint: [skill-name]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# New Skill

Interactively author a new skill in this repo and do **all** the wiring so it can be
installed via `npx skills add` for Claude Code, GitHub Copilot CLI, Cursor, Codex, and
any other [`skills`](https://npm.im/skills)-compatible agent.

Read `AGENTS.md` at the repo root first — it defines the SKILL.md format and repo
conventions this skill must follow.

## Interview

Ask **one question at a time**. Provide a recommended answer for each. If the user
passed a name in `$ARGUMENTS`, use it as the default for Q1 and confirm.

1. **Name** — kebab-case, becomes the folder name, frontmatter `name`, and slash
   command. Validate: lowercase letters, digits, and hyphens only. Reject if
   `skills/<name>/` already exists (offer to edit the existing skill instead).
2. **Purpose** — one or two sentences on what the skill does.
3. **Triggers** — what should activate it? Collect the slash command, natural-language
   phrases ("add a new skill", "grill me", …), and task shapes. These become the
   back half of the `description`, so gather concrete phrasings.
4. **Tools** — which tools does it need (Read, Write, Edit, Glob, Grep, Bash, WebFetch,
   …)? Recommend the minimal set. If unrestricted, omit `allowed-tools`.
5. **Arguments** — does it take a slash-command argument? If yes, capture an
   `argument-hint` like `[topic]`.
6. **Supporting files** — will it need a `references/` folder (long docs the skill
   reads) or `scripts/` folder (helpers it runs)? Create empty stubs only if wanted.
7. **License / attribution** — if ported from elsewhere, capture the license and plan a
   `NOTICE` update. Otherwise skip.

Keep it tight — skip any question whose answer is already clear from `$ARGUMENTS` or
earlier answers.

## Write the skill

Create `skills/<name>/SKILL.md` with frontmatter built from the answers. Only `name`
and `description` are required; include `argument-hint` and `allowed-tools` only when
they apply.

```markdown
---
name: <name>
description: <what it does>. Use when <triggers: slash command, phrases, task shapes>.
argument-hint: <hint>            # only if it takes an argument
allowed-tools: [<tools>]         # only if restricted
---

# <Title Case Name>

<One-paragraph summary.>

## When to use
<Triggers, restated for the reader.>

## Instructions
1. <step>
2. <step>
```

**Description quality bar:** the `description` must name both *what the skill does* and
*the triggers that fire it*. This is the single most important line — an agent loads
the skill based on it. Draft it, show it to the user, and refine before writing.

If the user requested `references/` or `scripts/`, create those folders with a short
placeholder file so the layout is committed.

## Wire it up

After writing `SKILL.md`, update the two registries. Do this by reading each file and
editing it precisely — do not blindly overwrite.

1. **`.claude-plugin/plugin.json`** — add `"./skills/<name>"` to the `skills` array
   (keep the array valid JSON and alphabetically tidy if it already is).
2. **`README.md`** — add a row to the Skills catalog table with the skill's slash
   command and a one-line summary. If the skill is a port, also update `NOTICE`.

## Verify

1. Confirm the folder and `SKILL.md` exist and the frontmatter parses (name matches
   folder; description present).
2. Show the discovery listing so the user sees it registered:
   ```bash
   npx skills add . --list
   ```
   Run from the repo root. If the new skill appears, it is installable.
3. Report the exact install commands the user can now run:
   ```bash
   npx skills add cicorias/skills -s <name>                 # once pushed
   npx skills add . -s <name> -a claude-code                # from a local clone
   npx skills add . -s <name> -a github-copilot
   ```

## Finish

Summarize what was created and changed (the new folder, the `plugin.json` entry, the
README row) and remind the user to commit and push so `npx skills add cicorias/skills`
picks it up.
