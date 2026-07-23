# End-to-end validation

Manual checklist for validating this skills collection from a consumer's point of
view: that the published repo is correct, that a fresh project can install the skills
for Claude Code and GitHub Copilot CLI, and that the skills actually run.

- **Parts A + B** are automated by [`smoke-test.sh`](./smoke-test.sh) — run that for a
  fast non-interactive check, or follow the steps below by hand.
- **Part C** requires an interactive agent session, so it stays manual.

All steps use a throwaway directory `~/skills-e2e`; nothing touches your real repos.

> Prerequisites: `git`, Node.js (for `npx`), and network access. Part A clones over
> HTTPS so no SSH key is needed. `npx skills` downloads the CLI on first run.

```bash
mkdir -p ~/skills-e2e && cd ~/skills-e2e
```

---

## Part A — Validate the published repo (fresh clone)

Proves the push worked and the symlinked guidance files survive a clone.

```bash
git clone https://github.com/cicorias/skills.git clone-check
cd clone-check
```

- [ ] **Symlinks are real symlinks (git mode `120000`):**
  ```bash
  git ls-files -s CLAUDE.md .github/copilot-instructions.md
  ```
  Expect both lines to start with `120000`.
  ```bash
  ls -la CLAUDE.md .github/copilot-instructions.md
  ```
  Expect `CLAUDE.md -> AGENTS.md` and `copilot-instructions.md -> ../AGENTS.md`.

- [ ] **All three guidance files resolve to the same content:**
  ```bash
  grep -c "Keep all generative-AI tool guidance in sync" \
    AGENTS.md CLAUDE.md .github/copilot-instructions.md
  ```
  Expect `1` for each file.

- [ ] **The CLI discovers all four skills:**
  ```bash
  npx skills add . --list
  ```
  Expect: `grill-me`, `claude-automation-recommender`, `new-skill`,
  `simplified-technical-english`.

```bash
cd ~/skills-e2e
```

---

## Part B — Install into a new project

The real consumer test: a brand-new repo installs your skills from GitHub.

```bash
mkdir testproj && cd testproj
git init
```

- [ ] **Install all skills for Claude Code (project scope, no prompts):**
  ```bash
  npx skills add cicorias/skills -a claude-code -s '*' -y
  ls -la .claude/skills/
  ```
  Expect the four skills present (symlinked into `node_modules`).
  ```bash
  head -3 .claude/skills/simplified-technical-english/SKILL.md
  ```
  Expect the STE frontmatter (`name: simplified-technical-english`).

- [ ] **Install all skills for GitHub Copilot CLI:**
  ```bash
  npx skills add cicorias/skills -a github-copilot -s '*' -y
  ls -la .agents/skills/
  ```
  Expect the same four skills under `.agents/skills/`.

- [ ] **Install a single skill (proves `-s` selection):**
  ```bash
  cd ~/skills-e2e && mkdir oneskill && cd oneskill && git init
  npx skills add cicorias/skills -a claude-code -s simplified-technical-english -y
  ls .claude/skills/
  ```
  Expect only `simplified-technical-english`.

```bash
cd ~/skills-e2e/testproj
```

> If a command prompts interactively instead of running clean, a flag didn't match —
> re-run with `--all` (= `-s '*' -a '*' -y`), or drop `-y` and answer the prompts.

---

## Part C — Exercise the skills (interactive)

### C1. STE skill

```bash
cd ~/skills-e2e/testproj
claude
```
Inside the session:
```
/simplified-technical-english
rewrite this in STE: "Prior to commencing the procedure, ensure that the technician has utilized the appropriate tooling in order to facilitate removal of the panel."
```
- [ ] Expect a short, active, imperative rewrite plus a bullet list of changes.

```
create a file panel.md with a 3-step STE procedure for replacing a fuse, then audit it
```
- [ ] Expect it writes `panel.md` (confirms the granted Read/Write/Edit tools) and
      lists issues as *offending text → rule → fix*.

### C2. The `/new-skill` builder

Run inside a clone of the skills repo (the builder edits `plugin.json` and the README):
```bash
cd ~/skills-e2e/clone-check
claude
```
Inside the session:
```
/new-skill hello-world
```
- [ ] Expect a short interview, then a new `skills/hello-world/SKILL.md`, a
      `"./skills/hello-world"` entry in `plugin.json`, and a README catalog row.

Verify, then undo the test skill:
```bash
npx skills add . --list        # hello-world now appears
git status                     # new folder + modified plugin.json/README
git restore . && git clean -fd # undo
```

---

## Part D — Clean up

```bash
rm -rf ~/skills-e2e
# If you installed anything globally with -g during testing:
# npx skills remove -a '*' -s '*' -y -g
```

---

## What each part proves

| Part | Validates |
|------|-----------|
| A | Push succeeded; symlinks clone as symlinks; guidance stays in sync; CLI sees all skills |
| B | A fresh project installs all/one skill for Claude Code and Copilot CLI into the correct paths |
| C | Skills actually run — STE rewrites/edits files; `/new-skill` scaffolds and wires a new skill |
| D | No residue left behind |
