---
title: The fork model
description: Fork vs. template, upstream sync, and what "campus-shaped" means.
---

## Fork, don't rewrite

UPLB Tools repos are MIT-licensed. The intended path is a **GitHub fork** (or a
mirror clone if you want a clean history), not a rewrite. The engine — map UI,
schedule logic, search, editor, auth — is campus-agnostic. What makes an
instance "yours" is:

- **Data** — buildings, rooms, class schedules, orgs, events. Lives in your
  own database.
- **Config** — site name, URL, map bounds, community links. Lives in a small
  number of config files.
- **Branding** — logos, colors, copy.

## Fork vs. template repository

A fork keeps `upstream` as a remote, so you can `git fetch upstream` and merge
improvements. A GitHub *template* repository copies the code once with no
upstream link — simpler, but you lose the sync path.

We recommend real forks for anything you expect to track upstream (room-tba
moves fast). See [Keeping forks in sync](keep-in-sync).

## "Campus-shaped, not UPLB-shaped"

The room-tba schema (`buildings`, `rooms`, `classes`, `aliases`, `events`,
`organizations`, `places`, `colleges`, `dorms`, `jeepney_routes`) describes any
campus. UPLB-only things are quarantined:

- `src/campus.config.ts` — all map/site/community config in one file
- `src/lib/site.ts`, `src/constants/community-links.ts` — branding and links
- `public/room_info.json` — seed data
- `scripts/import-*.ts` — UPLB registrar importers (AMIS, OUR finals)
- `astro.config.mjs` `site` — canonical URL

Your job is replacing those, not touching the engine.
