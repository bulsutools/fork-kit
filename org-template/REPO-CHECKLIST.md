# Per-repo fork checklist

Run through this for every repo you fork into a campus org. The docs site
(`src/content/docs/`) has the full guides; this is the terse version.

## Every fork

- [ ] Forked into the org (`gh repo fork uplbtools/<repo> --org <org>`)
- [ ] `upstream` remote added: `git remote add upstream git@github.com:uplbtools/<repo>.git`
- [ ] README rewritten for your campus (no leftover UPLB instructions)
- [ ] Repo description updated (drop "fork of ..." once branded, or keep for attribution)
- [ ] Topics/description set; issues enabled if you want community reports
- [ ] License file kept (MIT requires retaining it)

## room-tba extras

- [ ] `.env.local` from `.env.example` with `DATABASE_URL`, `ADMIN_SESSION_SECRET`, `MAPTILER_KEY`
- [ ] `bun run fork:init` completed (rewrites `src/campus.config.ts`)
- [ ] UPLB-only files removed/replaced (see `src/content/docs/guides/room-tba.md` table)
- [ ] `bunx drizzle-kit push` against your Postgres
- [ ] `bun run seed:sample` smoke test passes
- [ ] Deployed with `DATABASE_URL` present at build time

## website extras

- [ ] `src/data/tools.ts` lists only your tools
- [ ] `src/lib/site-meta.ts` branded
- [ ] `public/` assets replaced (screenshots, OG, favicon, brand/)
- [ ] `astro.config.mjs` `site` updated
- [ ] Deploy target configured (Cloudflare Pages or Vercel) + domain attached
- [ ] `npm run generate:og` run after rebrand

## Org-level

- [ ] `.github` repo exists with `profile/README.md`
- [ ] Deploy secrets stored (never committed): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ADMIN_PASSWORD`, DB URLs
- [ ] Someone owns: data imports, deploys, issue triage
