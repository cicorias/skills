---
name: no-comments
description: "Spawn the comment-sicko subagent over a diff, fix accepted findings, and offer encodings for claimed constraints. Use for /no-comments, \"kill the comments\", or a comment cleanup pass before review."
disable-model-invocation: true
---

# No comments

> **Claude Code:** pstack skills are user-invoked only (`disable-model-invocation`), so the Skill tool cannot load them. To follow a sibling pstack skill named here, Read `${CLAUDE_SKILL_DIR}/../<name>/SKILL.md` (a `principle-*` name included) and resolve its relative paths against that folder.

Spawn Comment Sicko. Act on accepted findings.

Defer to Comment Sicko's fresh perspective.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. Spawn with the Agent tool, `subagent_type: "comment-sicko"` (namespaced `skills:comment-sicko` when pstack is installed as this repo's Claude Code plugin). Pass the scope. Do not restate its rules. If neither name resolves, the agent file was not installed. Copy `agents/comment-sicko.md` from this repo into `.claude/agents/` or `~/.claude/agents/`, or spawn `general-purpose` with that file's body as the brief.
2. Inspect its report and diff. Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable. Do not restore those comments. A keep survives only with proof it is about something we cannot change. Audit missed scoped lint and TypeScript suppressions. Correctness or safety suppressions stay actionable `MUST KILL`s. Restore deletions only with exact exceptions and scoped proof. Before accepting thin `IMPORTANT` or `do not remove` kills or keeps, run `/how` or `/why` on their symbol. If a kill is ambiguous, do not restore. If a keep is refuted or still ambiguous, delete it. Revert and rerun one rejected report with the failure named. Reject a second, report it open, and fail `/no-comments`.
3. Fix trivial accepted flags directly by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a shape, run `/architect` once for the accepted set and surrounding code. Stop at the sketch. Architect shapes. Step 4 implements.
4. Implement the smallest root-cause fix in scope. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. The **principle-fix-root-causes** and **principle-redesign-from-first-principles** skills guide intent only. Neither authorizes widening the fence nor fixing instances outside it. Never bolt on symptom guards.
5. Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Offer the cheapest in-scope type, runtime, test, or CI lint. Wait for interactive approval. Unattended and eval require caller pre-approval. If approved, encode then delete. Otherwise delete, report the constraint open, and sketch out-of-scope work.
6. Report the deletion count, restored comments, reruns, architect sketch, fixes, encoding offers, encodings, unenforced constraints, and other open work.
