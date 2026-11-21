---
title: Keeping forks in sync
description: Pull upstream improvements without losing your campus changes.
---

A fork that never merges upstream rots. The trick is keeping campus changes
confined to files upstream rarely touches.

## The golden rule

**Put your campus identity in config files, not scattered edits.**

- room-tba: `src/campus.config.ts`, `src/lib/site.ts`, `community-links.ts`,
  `public/room_info.json`, your DB data, your `scripts/import-*.ts`
- website: `src/data/tools.ts`, `src/lib/site-meta.ts`, `src/data/press.ts`,
  `public/` assets

If your changes live there, `git merge upstream/main` stays clean. If you
edited the map component itself, every sync is a conflict.

## Sync workflow

```sh
git remote add upstream git@github.com:uplbtools/room-tba.git   # once
git fetch upstream
git checkout main
git merge upstream/main          # or rebase if you prefer
# resolve conflicts (should be few if you followed the rule)
bun install                      # deps may have changed
bun run build                    # verify
bun run db:push or drizzle-kit push  # if schema changed
```

Do this monthly or before each semester — upstream ships fixes and features
you don't want to miss (room-tba's fork tooling itself improves over time).

## Schema migrations

room-tba uses Drizzle. If upstream adds migrations:

```sh
bunx drizzle-kit push    # pushes schema to your DB
# or apply generated SQL in drizzle/ manually
```

Always snapshot/backup your DB before a sync that touches `drizzle/`.

## Contributing back

If you fix something generic (a map bug, an importer edge case, an a11y
issue), open a PR **to upstream** from a branch in your fork — don't just sit
on it. UPLB Tools merges community fixes; that's how the ecosystem improves.
Campus-specific things (your data, your branding) stay in your fork.

## When upstream changes break you

- `campus.config.ts` shape changes → re-run `bun run fork:init` or hand-edit
- Importer format changes → your `import-classes-generic` path is stable;
  only the UPLB AMIS importer is campus-specific
- Deploy changes → check upstream's `vercel.json` / workflows diff
