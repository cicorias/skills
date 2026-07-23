#!/usr/bin/env bash
#
# smoke-test.sh — automated Parts A + B of tests/e2e-validation.md
#
# Non-interactive validation of the PUBLISHED skills repo:
#   Part A: fresh clone → symlinks intact, guidance in sync, CLI discovers all skills
#   Part B: new project  → install all/one skill for claude-code and github-copilot
#
# Part C (running skills in an agent session) is interactive and NOT covered here;
# follow tests/e2e-validation.md by hand for that.
#
# Usage:
#   tests/smoke-test.sh
#
# Environment overrides:
#   SKILLS_REPO_URL   git URL to clone in Part A   (default: https://github.com/cicorias/skills.git)
#   SKILLS_REPO_SLUG  slug for `npx skills add`    (default: cicorias/skills)
#   KEEP_WORKDIR=1    do not delete the temp dir on exit (for debugging)
#
# Exit code: 0 if every check passed, 1 otherwise.

set -uo pipefail

REPO_URL="${SKILLS_REPO_URL:-https://github.com/cicorias/skills.git}"
REPO_SLUG="${SKILLS_REPO_SLUG:-cicorias/skills}"
EXPECTED_SKILLS=(grill-me claude-automation-recommender new-skill simplified-technical-english)

# ---- output helpers ---------------------------------------------------------
if [ -t 1 ]; then G=$'\033[32m'; R=$'\033[31m'; B=$'\033[1m'; Z=$'\033[0m'; else G=; R=; B=; Z=; fi
FAILURES=0
section() { printf '\n%s%s%s\n' "$B" "$1" "$Z"; }
ok()      { printf '  %s✓%s %s\n' "$G" "$Z" "$1"; }
bad()     { printf '  %s✗%s %s\n' "$R" "$Z" "$1"; FAILURES=$((FAILURES + 1)); }
# check <description> <command...>  — passes if the command succeeds
check()   { local d="$1"; shift; if "$@" >/dev/null 2>&1; then ok "$d"; else bad "$d"; fi; }

# ---- prerequisites ----------------------------------------------------------
section "Prerequisites"
for tool in git npx; do
  if command -v "$tool" >/dev/null 2>&1; then ok "$tool found"; else bad "$tool NOT found"; fi
done
[ "$FAILURES" -eq 0 ] || { printf '\n%sAborting: missing prerequisites.%s\n' "$R" "$Z"; exit 1; }

# skills CLI shortcut (‑‑yes so npx never prompts to install the package)
skills() { npx --yes skills "$@"; }

# ---- workspace --------------------------------------------------------------
WORKDIR="$(mktemp -d)"
cleanup() {
  if [ "${KEEP_WORKDIR:-0}" = "1" ]; then
    printf '\n%sKEEP_WORKDIR=1 — left workspace at %s%s\n' "$B" "$WORKDIR" "$Z"
  else
    rm -rf "$WORKDIR"
  fi
}
trap cleanup EXIT
printf '\nWorkspace: %s\n' "$WORKDIR"
printf 'Repo URL:  %s\n' "$REPO_URL"
printf 'Repo slug: %s\n' "$REPO_SLUG"

# ============================================================================
# PART A — validate the published repo via a fresh clone
# ============================================================================
section "Part A — fresh clone of the published repo"

CLONE="$WORKDIR/clone-check"
if git clone --quiet "$REPO_URL" "$CLONE" 2>/dev/null; then
  ok "cloned $REPO_URL"
else
  bad "clone failed ($REPO_URL) — cannot run Part A"
  CLONE=""
fi

if [ -n "$CLONE" ]; then
  # symlinks stored as git mode 120000
  for f in CLAUDE.md .github/copilot-instructions.md; do
    mode="$(git -C "$CLONE" ls-files -s "$f" 2>/dev/null | awk '{print $1}')"
    if [ "$mode" = "120000" ]; then ok "$f is a git symlink (120000)"; else bad "$f is NOT a symlink (mode='${mode:-missing}')"; fi
  done

  # guidance kept in sync across all three files
  needle="Keep all generative-AI tool guidance in sync"
  for f in AGENTS.md CLAUDE.md .github/copilot-instructions.md; do
    if grep -q "$needle" "$CLONE/$f" 2>/dev/null; then ok "$f carries the sync guidance"; else bad "$f is MISSING the sync guidance"; fi
  done

  # CLI discovers every expected skill
  list_out="$(cd "$CLONE" && skills add . --list 2>&1)"
  for s in "${EXPECTED_SKILLS[@]}"; do
    if printf '%s' "$list_out" | grep -q "$s"; then ok "CLI lists skill: $s"; else bad "CLI does NOT list skill: $s"; fi
  done
fi

# ============================================================================
# PART B — install into fresh projects
# ============================================================================
section "Part B — install all skills for claude-code"

PROJ="$WORKDIR/testproj"
mkdir -p "$PROJ" && ( cd "$PROJ" && git init --quiet )
( cd "$PROJ" && skills add "$REPO_SLUG" -a claude-code -s '*' -y ) >/dev/null 2>&1 \
  && ok "install command succeeded" || bad "install command failed"

for s in "${EXPECTED_SKILLS[@]}"; do
  if [ -e "$PROJ/.claude/skills/$s" ]; then ok ".claude/skills/$s present"; else bad ".claude/skills/$s MISSING"; fi
done
if head -3 "$PROJ/.claude/skills/simplified-technical-english/SKILL.md" 2>/dev/null | grep -q 'name: simplified-technical-english'; then
  ok "STE SKILL.md frontmatter reads correctly"
else
  bad "STE SKILL.md frontmatter not readable"
fi

section "Part B — install all skills for github-copilot"
( cd "$PROJ" && skills add "$REPO_SLUG" -a github-copilot -s '*' -y ) >/dev/null 2>&1 \
  && ok "install command succeeded" || bad "install command failed"
for s in "${EXPECTED_SKILLS[@]}"; do
  if [ -e "$PROJ/.agents/skills/$s" ]; then ok ".agents/skills/$s present"; else bad ".agents/skills/$s MISSING"; fi
done

section "Part B — install a single skill (-s selection)"
ONE="$WORKDIR/oneskill"
mkdir -p "$ONE" && ( cd "$ONE" && git init --quiet )
( cd "$ONE" && skills add "$REPO_SLUG" -a claude-code -s simplified-technical-english -y ) >/dev/null 2>&1 \
  && ok "install command succeeded" || bad "install command failed"
if [ -e "$ONE/.claude/skills/simplified-technical-english" ]; then ok "selected skill installed"; else bad "selected skill MISSING"; fi
# no other skill should have come along
extra=0
for s in grill-me claude-automation-recommender new-skill; do
  [ -e "$ONE/.claude/skills/$s" ] && extra=$((extra + 1))
done
if [ "$extra" -eq 0 ]; then ok "no unselected skills installed"; else bad "$extra unselected skill(s) also installed"; fi

# ============================================================================
# summary
# ============================================================================
section "Summary"
if [ "$FAILURES" -eq 0 ]; then
  printf '%sAll checks passed.%s\n' "$G" "$Z"
  exit 0
else
  printf '%s%d check(s) failed.%s\n' "$R" "$FAILURES" "$Z"
  exit 1
fi
