# skills

A collection of reusable Claude Code skills.

## Installation

### Via `skills` npm package

```bash
npx skills add cicorias/skills
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

## Contributing

Add new skills under `skills/<skill-name>/SKILL.md`. See the [example skill format](https://skills.sh/) for reference.
