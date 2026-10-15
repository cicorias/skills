// Offline checks that every skill's metadata, folder layout, and the repo-level
// manifests are what `npx skills add` and Claude Code plugins expect.
//
// Run: npm test

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readlinkSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, test } from 'node:test';

import {
  MARKETPLACE_JSON,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  PLUGIN_JSON,
  REPO_ROOT,
  SKILLS_DIR,
  SKILL_NAME_RE,
  gitTrackedFiles,
  isInside,
  isSymlink,
  parseSkillMd,
  readJson,
  skillFolders,
  walk,
} from '../helpers.mjs';

// Frontmatter keys understood by the skills CLI, the Agent Skills spec, or Claude Code.
// An unknown key is usually a typo (e.g. `allowed_tools`) that silently does nothing.
const KNOWN_FRONTMATTER_KEYS = new Set([
  'name',
  'description',
  'license',
  'compatibility',
  'metadata',
  'allowed-tools',
  'argument-hint',
  'disable-model-invocation',
  'user-invocable',
  'when_to_use',
  'model',
  'effort',
  'context',
  'agent',
  'hooks',
  'paths',
  'shell',
  'version',
  // Kept by the upstream claude-code-setup port (claude-automation-recommender).
  'tools',
]);

const folders = skillFolders();

test('skills/ contains at least one skill', () => {
  assert.ok(folders.length > 0, 'no skill folders found under skills/');
});

for (const folder of folders) {
  describe(`skill: ${folder}`, () => {
    const skillDir = join(SKILLS_DIR, folder);
    const skillMd = join(skillDir, 'SKILL.md');

    test('has a SKILL.md (exact case)', () => {
      assert.ok(existsSync(skillMd), `${folder}/SKILL.md is missing`);
    });
    if (!existsSync(skillMd)) return;

    const { hasFrontmatter, data, body } = parseSkillMd(skillMd);

    test('SKILL.md starts with a --- YAML frontmatter block', () => {
      assert.ok(hasFrontmatter, 'frontmatter must open on line 1 with --- and close with ---');
      assert.equal(typeof data, 'object');
      assert.ok(!Array.isArray(data), 'frontmatter must be a YAML mapping');
    });

    test('name is a valid kebab-case string matching the folder', () => {
      assert.equal(typeof data.name, 'string', 'name must be a string');
      assert.ok(data.name.length <= MAX_NAME_LENGTH, `name longer than ${MAX_NAME_LENGTH} chars`);
      assert.match(data.name, SKILL_NAME_RE, 'name must be lowercase letters, digits, single hyphens');
      assert.equal(data.name, folder, 'frontmatter name must equal the folder name');
    });

    test('description is a non-empty string within limits', () => {
      assert.equal(typeof data.description, 'string', 'description must be a string');
      const d = data.description.trim();
      assert.ok(d.length > 0, 'description is empty');
      assert.ok(
        d.length <= MAX_DESCRIPTION_LENGTH,
        `description is ${d.length} chars (max ${MAX_DESCRIPTION_LENGTH})`,
      );
      assert.ok(!/[<>]/.test(d), 'description must not contain < or > (XML tags are rejected)');
    });

    test('description says when to use it', () => {
      assert.match(
        data.description,
        /\b(use (this skill )?when|use for|use it when|triggers?)\b/i,
        'description should name its triggers ("Use when …") so agents know when to load it',
      );
    });

    test('is not hidden by metadata.internal', () => {
      assert.notEqual(
        data.metadata?.internal,
        true,
        'metadata.internal: true hides the skill from `npx skills add`',
      );
    });

    test('uses only known frontmatter keys', () => {
      const unknown = Object.keys(data).filter((k) => !KNOWN_FRONTMATTER_KEYS.has(k));
      assert.deepEqual(unknown, [], `unknown frontmatter key(s): ${unknown.join(', ')}`);
    });

    test('optional frontmatter fields have the right types', () => {
      if ('argument-hint' in data) assert.equal(typeof data['argument-hint'], 'string');
      if ('license' in data) assert.equal(typeof data.license, 'string');
      if ('compatibility' in data) assert.equal(typeof data.compatibility, 'string');
      for (const key of ['disable-model-invocation', 'user-invocable']) {
        if (key in data) assert.equal(typeof data[key], 'boolean', `${key} must be true/false`);
      }
      if ('allowed-tools' in data) {
        const t = data['allowed-tools'];
        const ok =
          typeof t === 'string' || (Array.isArray(t) && t.every((x) => typeof x === 'string'));
        assert.ok(ok, 'allowed-tools must be a string or a list of strings');
      }
      if ('metadata' in data) {
        const m = data.metadata;
        assert.ok(m && typeof m === 'object' && !Array.isArray(m), 'metadata must be a mapping');
      }
    });

    test('has instructions after the frontmatter', () => {
      assert.ok(body.trim().length > 0, 'SKILL.md body is empty');
      assert.match(body, /^#\s+\S/m, 'SKILL.md body should have a top-level heading');
    });

    test('relative links resolve to files inside the skill folder', () => {
      // Installers copy only the skill folder, so links must not escape it.
      const links = [...body.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]);
      const local = links.filter((l) => !/^([a-z]+:|#|\/)/i.test(l)).map((l) => l.split('#')[0]);
      for (const link of local) {
        const target = resolve(skillDir, link);
        assert.ok(isInside(skillDir, target), `link escapes the skill folder: ${link}`);
        assert.ok(existsSync(target), `broken link: ${link}`);
      }
    });

    test('no symlinks point outside the skill folder', () => {
      for (const rel of walk(skillDir)) {
        const full = join(skillDir, rel);
        if (!isSymlink(full)) continue;
        assert.ok(
          isInside(skillDir, resolve(dirname(full), readlinkSync(full))),
          `symlink escapes the skill folder: ${rel}`,
        );
      }
    });
  });
}

test('skill names are unique', () => {
  const names = folders
    .filter((f) => existsSync(join(SKILLS_DIR, f, 'SKILL.md')))
    .map((f) => parseSkillMd(join(SKILLS_DIR, f, 'SKILL.md')).data.name);
  assert.equal(new Set(names).size, names.length, `duplicate skill names: ${names}`);
});

describe('.claude-plugin/plugin.json', () => {
  const plugin = readJson(PLUGIN_JSON);

  test('has a kebab-case name, semver version, and description', () => {
    assert.match(plugin.name, SKILL_NAME_RE);
    assert.match(plugin.version, /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/, 'version must be semver');
    assert.equal(typeof plugin.description, 'string');
    assert.ok(plugin.description.length > 0);
  });

  test('lists every skill folder exactly once, and nothing else', () => {
    assert.ok(Array.isArray(plugin.skills), 'skills must be an array');
    const listed = plugin.skills.map((p) => p.replace(/^\.\//, '').replace(/\/$/, ''));
    assert.equal(new Set(listed).size, listed.length, 'duplicate entries in skills[]');
    assert.deepEqual(
      [...listed].sort(),
      folders.map((f) => `skills/${f}`),
      'plugin.json skills[] must match the folders under skills/',
    );
  });

  test('skill paths are ./-relative and point at a SKILL.md', () => {
    for (const p of plugin.skills) {
      assert.match(p, /^\.\/skills\/[a-z0-9-]+$/, `use the form ./skills/<name>: ${p}`);
      assert.ok(existsSync(join(REPO_ROOT, p, 'SKILL.md')), `${p}/SKILL.md missing`);
    }
  });

  test('agents entries (if any) exist', () => {
    for (const p of plugin.agents ?? []) {
      assert.ok(existsSync(join(REPO_ROOT, p)), `agent file missing: ${p}`);
    }
  });
});

describe('.claude-plugin/marketplace.json', () => {
  const plugin = readJson(PLUGIN_JSON);
  const market = readJson(MARKETPLACE_JSON);

  test('has a kebab-case name and an owner', () => {
    assert.match(market.name, SKILL_NAME_RE);
    assert.equal(typeof market.owner?.name, 'string');
  });

  test('publishes this repo as the plugin, at the same version', () => {
    const entry = market.plugins?.find((p) => p.name === plugin.name);
    assert.ok(entry, `marketplace.json must list plugin "${plugin.name}"`);
    assert.ok(['./', '.'].includes(entry.source), 'plugin source must be the repo root ("./")');
    if (entry.version) assert.equal(entry.version, plugin.version, 'versions out of sync');
  });
});

describe('README.md', () => {
  const readme = readFileSync(join(REPO_ROOT, 'README.md'), 'utf8');

  for (const folder of folders) {
    test(`catalog has a row for ${folder}`, () => {
      assert.ok(
        readme.includes(`| [${folder}](#${folder}) | \`/${folder}\` |`),
        `add "| [${folder}](#${folder}) | \`/${folder}\` | … |" to the Skills table`,
      );
    });
  }
});

describe('agent guidance files', () => {
  for (const f of ['CLAUDE.md', '.github/copilot-instructions.md']) {
    test(`${f} is a symlink to AGENTS.md`, () => {
      const full = join(REPO_ROOT, f);
      assert.ok(isSymlink(full), `${f} must be a symlink (AGENTS.md is the source of truth)`);
      assert.equal(realpathSync(full), realpathSync(join(REPO_ROOT, 'AGENTS.md')));
    });
  }

  test('symlinks are stored as git symlinks (mode 120000)', (t) => {
    if (!gitTrackedFiles()) return t.skip('not a git checkout');
    for (const f of ['CLAUDE.md', '.github/copilot-instructions.md']) {
      const line = execFileSync('git', ['ls-files', '-s', f], { cwd: REPO_ROOT, encoding: 'utf8' });
      assert.ok(line.startsWith('120000'), `${f} is not committed as a symlink: ${line.trim()}`);
    }
  });
});

