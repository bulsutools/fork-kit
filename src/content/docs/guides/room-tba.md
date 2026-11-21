---
title: Fork Room TBA
description: Stand up Room TBA for your campus — map, rooms, class schedules.
---

Room TBA is the flagship: an open-source campus map and class finder. It is a
Bun + Astro app with a Postgres (Supabase or PGlite) backend, a MapLibre map,
an in-app editor, and a PWA that works offline.

> **Read the in-app guide first.** The fork itself ships a wiki page at
> `room-tba.<your-domain>/wiki/fork-for-your-campus` with exact file paths,
> and a data guide at `docs/fork-data-guide.md` in the repo. This page is the
> 10,000-ft version; those are the ground truth. Also see: `https://room-tba.uplb.tools/fork`

## Live instances

| University & campus | Domain | GitHub |
| --- | --- | --- |
| UPLB (Los Baños) | [room-tba.uplb.tools](https://room-tba.uplb.tools) | [uplbtools/room-tba](https://github.com/uplbtools/room-tba) |
| BulSU (Malolos) | [room-tba.bulsu.tools](https://room-tba.bulsu.tools) | [bulsutools/room-tba](https://github.com/bulsutools/room-tba) |

## What you keep vs. what you replace

**Keep (the engine):** map UI, search, side panel, pin flyouts, PGlite
offline cache, editor + suggest-an-edit queue, course planner, personal
schedule routing, events, alias matching, share links, the Drizzle schema.

**Replace (UPLB-only):**

| Thing | Where |
| --- | --- |
| Site name/URL/description | `src/lib/site.ts`, `src/campus.config.ts`, `astro.config.mjs` |
| Map bounds, camera, terrain, transit | `src/campus.config.ts` |
| Community links (Discord, Messenger, org) | `src/constants/community-links.ts` |
| Building/room seed data | `public/room_info.json`, your database |
| Campus transit routes | `src/constants/jeepney-routes.ts` + `jeepney-geometries.json` |
| UPLB registrar importers | `scripts/import-amis-classes.ts`, `import-final-exams.ts`, `import-osa-organizations.ts`, `import-campus-office-directory.ts` |
| UPLB wiki page | `src/pages/wiki/section-times.astro` |

## Prerequisites

- GitHub account, [Bun](https://bun.sh) 1.3+
- A Postgres database — [Supabase](https://supabase.com) free tier works
- A [MapTiler](https://maptiler.com) key for map tiles (free tier exists)
- Your campus data: building list with coordinates, room codes, class
  schedules from your registrar
- A deploy target — [Vercel](https://vercel.com) free tier works (the app is
  built for the Vercel adapter)

## Steps

**One-click option:** create your repo from
[room-tba-template](https://github.com/new?template_name=room-tba-template&template_owner=bulsutools)
(**Use this template**), then `git clone` it and `git remote add upstream
git@github.com:uplbtools/room-tba.git` if you want syncs.

**Fork option:**

```sh
gh repo fork uplbtools/room-tba --org <your-org>
git clone git@github.com:<your-org>/room-tba.git
cd room-tba
cp .env.example .env.local
```

1. **Database.** Create a Supabase project, copy the *session pooler*
   connection string into `DATABASE_URL`, and set `ADMIN_SESSION_SECRET` to
   32+ random chars.
2. **Schema.** `bun install && bunx drizzle-kit push`
3. **Campus config.** `bun run fork:init` — interactive script that rewrites
   `src/campus.config.ts` (site, map bounds, camera, terrain, transit,
   community links). Refuses to run on a dirty tree; `--force` overrides.
4. **Delete/replace UPLB data** per the table above. You can keep the import
   scripts as reference while you write your own.
5. **Seed and verify.** `bun run seed:sample` loads a fictional "Evergreen
   Park College" dataset so you can see the whole engine working before your
   real data exists. Then `bun dev` → http://localhost:4321.

## Getting your real data in

You do **not** need a custom importer on day one:

- **Buildings/rooms/orgs/places:** the in-app editor (`/?editor=login`) is the
  day-to-day tool. First login with `ADMIN_PASSWORD` bootstraps `admin`.
- **Bulk first load:** copy `data/sample-campus/campus.json`, replace entries,
  adapt `scripts/seed-sample-campus.ts`.
- **Class schedules:** `bun run import:classes-generic -- path/to/classes.csv`
  takes any flattened registrar export — one row per meeting slot with
  `course_code`, `section`, `type`, `days`, `start`, `end`, `room_code`,
  `term_id`. Upserts by natural key; `--replace-term` does a clean refresh.
  Full column reference: `docs/fork-data-guide.md`.

## Deploy

`bun run build` prerenders pages from the DB, so `DATABASE_URL` must be set at
build time. Deploy to Vercel (import the repo, add env vars) or any Node host.
