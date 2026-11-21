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
   `uplb.tools`)

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

**One-click option:** use the template repos instead of forking —
[bulsutools/room-tba-template](https://github.com/bulsutools/room-tba-template)
and
[bulsutools/website-template](https://github.com/bulsutools/website-template).
Click **Use this template**, name the repo, done. They mirror upstream `main`
with no campus config baked in. Downside: no `upstream` remote, so add one
afterwards if you want syncs (`git remote add upstream git@github.com:uplbtools/<repo>.git`).

**Fork option:**

```sh
# room-tba is the flagship — fork it into the org
gh repo fork uplbtools/room-tba --org <org> --clone=false

# website — your org landing page
gh repo fork uplbtools/website --org <org> --clone=false
```

Then follow the per-repo guides: [room-tba](room-tba) and
[website](website).

## 4. Bootstrap checklist

`org-template/REPO-CHECKLIST.md` in this repo is the full per-repo checklist.
The short version for each fork:

- [ ] Rename repo description (drop "fork of uplbtools/..." once branded)
- [ ] Update README for your campus
- [ ] Configure secrets (deploy tokens, `ADMIN_PASSWORD`, `DATABASE_URL`)
- [ ] Set up deploy (Vercel/Cloudflare Pages) and attach your domain
- [ ] Enable issues/wiki as needed; add topic tags
- [ ] Add your org to upstream repos' community links where relevant

## 5. Optional extras

- **Discord bot / community**: uplbtools has `discord-bot` and a Messenger
  integration. These are UPLB-specific but the pattern ports.
- **Domain**: buy `you.tools`-style domain, or use `<org>.github.io` /
  `<project>.pages.dev` fallbacks while you bootstrap.
- **TEAM.md / governance**: decide who can merge, who owns data imports, who
  answers issues. bulsutools runs student-managed; document yours in the org
  profile.
