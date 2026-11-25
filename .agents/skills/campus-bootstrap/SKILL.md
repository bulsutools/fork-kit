---
name: campus-bootstrap
description: Stand up a new campus org's fork scaffold — org profile README, per-tool repo checklists, deploy/DNS plan — using scripts/bootstrap-campus.ts. Use when asked to fork/set up campus tools for a new university org.
---

# Campus bootstrap

Agent path for `guides/new-campus-org`: the script turns
`{campus_name, campus_slug, tools[]}` into a reviewable scaffold instead of a
manual checklist walk.

## Run

```sh
pnpm bootstrap --campus <org-slug> --tools room-tba,website --dry-run
```

- `--campus` org slug (required), `--name` display name, `--university`,
  `--domain`, `--tools` csv (default `room-tba,website`), `--out` scaffold dir.
- `--dry-run` prints the full plan, writes nothing, runs nothing. Always dry-run
  first and show the human the plan.
- Without `--dry-run` the script writes `scaffold/<slug>/` (`PLAN.md`,
  `org-profile/profile/README.md`, `checklists/<tool>.md`, `STEPS.log`).
- `--execute` additionally runs the `gh` repo commands (org profile repo +
  forks). Idempotent: skips repos that already exist. Never creates the GitHub
  org itself — that stays manual.

## Rules

- No auto-creating GitHub orgs; no repo creation without `--execute` and human
  review of the dry-run plan.
- Every generated artifact already links back to the fork-kit guide and
  `org-template/REPO-CHECKLIST.md` — keep those links when editing output.
- After scaffold review, per-tool work follows the linked guides
  (`fork.bulsu.tools/guides/room-tba/`, `/guides/website/`).
