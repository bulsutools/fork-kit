---
title: Stand up a campus org
description: Create the GitHub org and bootstrap the repo set for a new campus.
---

Before forking anything, you need an org to hold the forks. [bulsutools](https://github.com/bulsutools)
is the reference implementation.

## 1. Create the org

GitHub org creation is manual (can't be done via `gh`):

1. Go to <https://github.com/account/organizations/new>
2. Pick the free plan, name it consistently — all-lowercase is the convention
   (`bulsutools`, not `BulSUtools`)
3. Username will be `<org>`; your domain can be anything (`bulsu.tools`,
   `uplb.tools`) but domain.tools is preferred.

## 2. Org profile repo

Every org looks better with a profile README:

```sh
gh repo create <org>/.github --public
gh api repos/<org>/.github/contents/profile/README.md -X PUT \
  -f message="Add org profile" \
  -f content="$(base64 -w0 org-template/org-profile/profile/README.md)"
```

Or just clone, copy `org-template/org-profile/profile/README.md` from this
repo, edit the placeholders, and push. Fill in:

- Org display name and one-line description
- Links to your tools (added as you fork them)
- Contact/Discord/community links

## 3. Fork the repos

**Fork option:**

```sh
# website — your org landing page
gh repo fork uplbtools/website --org <org> --clone=false
```

Then follow the per-repo guides: [room-tba](room-tba) and
[website](website).

## 4. Agent path: `pnpm bootstrap`

Prefer letting an agent run the checklist? `scripts/bootstrap-campus.ts` in this
repo turns `{campus_name, campus_slug, tools[]}` into a ready-to-review scaffold.
The matching agent skill lives at `.agents/skills/campus-bootstrap/SKILL.md`.

```sh
pnpm install
pnpm bootstrap --campus acme --tools room-tba,website --dry-run
```

- `--campus` is the org slug (required); `--name`, `--university`, `--domain`
  fill the placeholders; `--tools` defaults to `room-tba,website`.
- `--dry-run` prints the full plan with zero side effects. Review it first.
- Without `--dry-run` it writes `scaffold/<slug>/`: `PLAN.md`, a rendered
  `org-profile/profile/README.md`, per-tool `checklists/<tool>.md` with exact
  commands, and `STEPS.log`. Re-running overwrites the same files (idempotent).
- `--execute` additionally runs the `gh` repo commands (org profile repo +
  forks), skipping repos that already exist. It never creates the GitHub org —
  step 1 above stays manual, and no repos are created without `--execute`.

Every generated file links back to this guide, the per-tool guides, and
`org-template/REPO-CHECKLIST.md`.

## 5. Bootstrap checklist

`org-template/REPO-CHECKLIST.md` in this repo is the full per-repo checklist.
The short version for each fork:

- [ ] Rename repo description (drop "fork of uplbtools/..." once branded)
- [ ] Update README for your campus
- [ ] Configure secrets (deploy tokens, `ADMIN_PASSWORD`, `DATABASE_URL`)
- [ ] Set up deploy (Vercel/Cloudflare Pages) and attach your domain
- [ ] Enable issues/wiki as needed; add topic tags
- [ ] Add your org to upstream repos' community links where relevant

## 6. Optional extras

- **Discord bot / community**: uplbtools has `discord-bot` and a Messenger
  integration. These are UPLB-specific but the pattern ports.
- **Domain**: buy `you.tools`-style domain, or use `<org>.github.io` /
  `<project>.pages.dev` fallbacks while you bootstrap.
- **TEAM.md / governance**: decide who can merge, who owns data imports, who
  answers issues. bulsutools runs student-managed; document yours in the org
  profile.
