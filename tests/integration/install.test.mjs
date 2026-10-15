// End-to-end checks against the real tools, using THIS working tree (not GitHub):
//   - `npx skills add <repo> --list` discovers every skill with no "Skipped" warnings
//   - installing all skills for claude-code and github-copilot lands each SKILL.md
//   - installing one skill with -s installs only that skill
//   - `claude plugin validate` accepts plugin.json and marketplace.json (if claude is on PATH)
//
// Needs network access the first time (npx downloads the CLI). Telemetry is disabled
// so test runs never count as installs on skills.sh.
//
// Run: npm run test:cli
// Env: SKILLS_CLI=skills@<version> to test another CLI version.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { before, describe, test } from 'node:test';

import { REPO_ROOT, SKILLS_DIR, parseSkillMd, skillFolders } from '../helpers.mjs';

const SKILLS_CLI = process.env.SKILLS_CLI ?? 'skills@1.7.1';
const TIMEOUT_MS = 180_000;
const ENV = { ...process.env, DISABLE_TELEMETRY: '1', DO_NOT_TRACK: '1', NO_COLOR: '1' };

const skills = skillFolders().filter((f) => existsSync(join(SKILLS_DIR, f, 'SKILL.md')));

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, env: ENV, encoding: 'utf8', timeout: TIMEOUT_MS });
  return { code: r.status, out: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

const skillsCli = (args, cwd) => run('npx', ['--yes', SKILLS_CLI, ...args], cwd);

function freshProject(t) {
  const dir = mkdtempSync(join(tmpdir(), 'skills-it-'));
  run('git', ['init', '--quiet'], dir);
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

describe(`skills CLI (${SKILLS_CLI})`, { timeout: TIMEOUT_MS * 4 }, () => {
  let listing;
  before(() => {
    listing = skillsCli(['add', REPO_ROOT, '--list'], tmpdir());
  });

  test('--list succeeds', () => {
    assert.equal(listing.code, 0, listing.out);
  });

  test('--list reports no skipped (invalid) SKILL.md files', () => {
    assert.doesNotMatch(listing.out, /Skipped/, listing.out);
  });

  test(`--list finds exactly ${skills.length} skills`, () => {
    assert.match(listing.out, new RegExp(`Found ${skills.length} skills?\\b`), listing.out);
  });

  for (const name of skills) {
    test(`--list includes ${name}`, () => {
      assert.match(listing.out, new RegExp(`^[│|\\s]*${name}\\s*$`, 'm'), listing.out);
    });
  }

  for (const [agent, installDir] of [
    ['claude-code', '.claude/skills'],
    ['github-copilot', '.agents/skills'],
  ]) {
    test(`installs every skill for ${agent} into ${installDir}/`, (t) => {
      const proj = freshProject(t);
      const r = skillsCli(['add', REPO_ROOT, '-a', agent, '-s', '*', '-y'], proj);
      assert.equal(r.code, 0, r.out);
      for (const name of skills) {
        const md = join(proj, installDir, name, 'SKILL.md');
        assert.ok(existsSync(md), `${installDir}/${name}/SKILL.md missing\n${r.out}`);
        assert.equal(parseSkillMd(md).data.name, name, `installed ${name} has wrong name`);
      }
    });
  }

  test('-s installs only the selected skill (with its supporting files)', (t) => {
    const proj = freshProject(t);
    const pick = skills.includes('ambition') ? 'ambition' : skills[0];
    const r = skillsCli(['add', REPO_ROOT, '-a', 'claude-code', '-s', pick, '-y'], proj);
    assert.equal(r.code, 0, r.out);
    assert.ok(existsSync(join(proj, '.claude/skills', pick, 'SKILL.md')), r.out);
    if (pick === 'ambition') {
      for (const ref of ['altitude.md', 'depth.md', 'range.md']) {
        assert.ok(existsSync(join(proj, '.claude/skills/ambition/references', ref)), ref);
      }
    }
    for (const other of skills.filter((s) => s !== pick)) {
      assert.ok(!existsSync(join(proj, '.claude/skills', other)), `${other} should not install`);
    }
  });
});

describe('claude plugin validate', () => {
  const hasClaude = run('claude', ['--version'], REPO_ROOT).code === 0;

  for (const target of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json']) {
    test(`accepts ${target}`, (t) => {
      if (!hasClaude) return t.skip('claude CLI not on PATH');
      const r = run('claude', ['plugin', 'validate', join(REPO_ROOT, target)], REPO_ROOT);
      assert.equal(r.code, 0, r.out);
      assert.match(r.out, /Validation passed/, r.out);
    });
  }
});

