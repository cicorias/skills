// Shared helpers for the skills-repo validation tests.
//
// Frontmatter parsing deliberately mirrors the `skills` CLI (npm `skills`):
// same delimiter regex, same `yaml` parser, same required-field rules. If the CLI
// changes how it reads SKILL.md, update parseSkillMd() to match.

import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const SKILLS_DIR = join(REPO_ROOT, 'skills');
export const PLUGIN_JSON = join(REPO_ROOT, '.claude-plugin', 'plugin.json');
export const MARKETPLACE_JSON = join(REPO_ROOT, '.claude-plugin', 'marketplace.json');

// Same regex the skills CLI uses in parseFrontmatter().
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

// Same rules as the skills CLI's isValidSkillName() and the Agent Skills spec.
export const SKILL_NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MAX_NAME_LENGTH = 64;
export const MAX_DESCRIPTION_LENGTH = 1024;

/** Parse a SKILL.md the way the skills CLI does. Throws on YAML errors. */
export function parseSkillMd(path) {
  const raw = readFileSync(path, 'utf8');
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { hasFrontmatter: false, data: {}, body: raw };
  return { hasFrontmatter: true, data: parse(match[1]) ?? {}, body: match[2] ?? '' };
}

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/** Paths tracked by git, relative to the repo root, or null outside a git checkout. */
export function gitTrackedFiles() {
  try {
    const out = execFileSync('git', ['ls-files', '-z'], { cwd: REPO_ROOT, encoding: 'utf8' });
    return out.split('\0').filter(Boolean);
  } catch {
    return null;
  }
}

/**
 * Skill folders under skills/. Inside a git checkout a folder counts when it has a
 * SKILL.md or any tracked file, so untracked local leftovers (e.g. a stray
 * node_modules) don't fail tests but a new, not-yet-committed skill still does.
 */
export function skillFolders() {
  const tracked = gitTrackedFiles();
  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
  if (!tracked) return dirs.sort();
  return dirs
    .filter(
      (d) =>
        existsSync(join(SKILLS_DIR, d, 'SKILL.md')) ||
        tracked.some((f) => f.startsWith(`skills/${d}/`)),
    )
    .sort();
}

/** All files in a directory tree (relative paths), skipping node_modules. */
export function walk(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else out.push(relative(base, full));
  }
  return out;
}

/** True when `target` resolves inside `base` (or is `base`). */
export function isInside(base, target) {
  const b = resolve(base);
  const t = resolve(target);
  return t === b || t.startsWith(b + sep);
}

export function isSymlink(path) {
  return existsSync(path) && lstatSync(path).isSymbolicLink();
}
