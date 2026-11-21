---
title: Fork website
description: Fork the UPLB Tools org landing site and rebrand it for your campus.
---

`uplbtools/website` is the org landing page — a static [Astro](https://astro.build)
site that lists your tools, team, press, and community links. Forking it is the
easiest part of standing up a campus org.

A live example: [bulsutools/website](https://github.com/bulsutools/website)
(`bulsu.tools`), deployed on Cloudflare Pages.

## What to change

| Thing | Where |
| --- | --- |
| Tool listings (name, URL, description, screenshot) | `src/data/tools.ts` |
| Site name, description, socials | `src/lib/site-meta.ts` |
| Press/team content | `src/data/press.ts`, `src/pages/people.astro`, `src/pages/press.astro` |
| Legal pages (privacy, terms, transparency) | `src/pages/privacy.astro`, `terms.astro`, `transparency.astro` |
| Brand assets, screenshots, OG image | `public/` (`brand/`, `*-screenshot.png`, `og.png`) |
| Canonical URL | `astro.config.mjs` `site` |
| Favicon/icons | `public/favicon*`, `icon-*.png`, `apple-touch-icon.png` |

Also update `README.md` — stack, dev commands, deploy section — so the next
contributor isn't reading UPLB instructions.

## Steps

**One-click option:** create your repo from
[bulsutools/website-template](https://github.com/bulsutools/website-template)
(**Use this template**), then `git clone` it.

**Fork option:**

```sh
gh repo fork uplbtools/website --org <your-org>
git clone git@github.com:<your-org>/website.git
cd website
npm install
npm run dev
```

1. Edit the files in the table above. `npm run generate:og` regenerates the OG
   image after branding changes.
2. Pick a deploy target:

   **Cloudflare Pages** (what bulsutools uses):
   - Create a Pages project, connect the repo
   - Build command `npm run build`, output dir `dist`
   - Add a GitHub Action like `bulsutools/website`'s
     `.github/workflows/deploy-cloudflare.yml` with `CLOUDFLARE_API_TOKEN` and
     `CLOUDFLARE_ACCOUNT_ID` secrets for CI deploys + PR previews
   - Attach your domain (`you.tools`, `you.github.io`, etc.)

   **Vercel** (what uplbtools uses for `uplbtools.me`):
   - Import the repo, framework preset Astro, defaults work
   - Add env vars if the site uses any

3. Optional: `public/_redirects` handles path redirects on Cloudflare Pages;
   `workers/` in the upstream repo holds Cloudflare Worker subdomain redirects
   (e.g. `messenger.uplbtools.me`) — copy the pattern if you want
   `app.you.tools`-style subdomains.

## Tips

- Remove UPLB press photos and team sections you can't replace — an empty
  section looks worse than no section.
- Keep `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `LICENSE` — they're generic.
- If your campus org has a different name casing (`bulsutools` vs
  `BulSU Tools`), decide once and use it consistently in `site-meta.ts`, the
  README, and the repo description.
