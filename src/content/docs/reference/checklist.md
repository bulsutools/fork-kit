---
title: Fork checklist
description: Copy-paste checklist for forking any UPLB Tools repo.
---

## New campus org

- [ ] GitHub org created (lowercase name)
- [ ] `.github` repo with `profile/README.md`
- [ ] Domain decided (or `<org>.github.io` / `*.pages.dev` fallback)

## room-tba

- [ ] `gh repo fork uplbtools/room-tba --org <org>`
- [ ] `cp .env.example .env.local`; set `DATABASE_URL`, `ADMIN_SESSION_SECRET`, MapTiler key
- [ ] Supabase project created; `bunx drizzle-kit push`
- [ ] `bun run fork:init` — campus name, URL, map bounds, camera, terrain, transit, community links
- [ ] UPLB-only files removed/replaced (`room_info.json`, jeepney routes, AMIS/OUR/OSA importers, `section-times.astro`)
- [ ] `bun run seed:sample` verified at `localhost:4321`
- [ ] Real data loaded (editor, `campus.json` bulk seed, `import:classes-generic`)
- [ ] Deployed (Vercel/Node host); `DATABASE_URL` available at build time
- [ ] `upstream` remote added for syncs

## website

- [ ] `gh repo fork uplbtools/website --org <org>`
- [ ] `src/data/tools.ts` lists your tools
- [ ] `src/lib/site-meta.ts` rebranded
- [ ] `src/data/press.ts`, people/press pages updated or emptied
- [ ] `public/` assets replaced (logo, screenshots, OG, favicon)
- [ ] `astro.config.mjs` `site` updated
- [ ] Deployed (Cloudflare Pages or Vercel); domain attached
- [ ] Deploy secrets configured (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) if using the GHA workflow
- [ ] `upstream` remote added for syncs

## Ongoing

- [ ] Monthly `git fetch upstream && git merge upstream/main`
- [ ] Generic fixes upstreamed as PRs
- [ ] README + repo descriptions de-UPLB'd
