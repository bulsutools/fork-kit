---
title: Fork Kit
description: Run UPLB Tools software on your own campus.
---

UPLB Tools builds free utilities for the University of the Philippines Los Baños
community. Most of them are MIT-licensed and designed to be forked: the code is
generic, and everything campus-specific is data and config you replace.

This site is the **fork wiki** — the cross-repo guide to standing up your own
campus org (like [bulsutools](https://github.com/bulsutools)) and running the
UPLB Tools stack on your campus.

## What you can fork

| Project | What it is | Fork difficulty | Guide |
| --- | --- | --- | --- |
| [room-tba](https://github.com/uplbtools/room-tba) | Campus map + class finder ("where is this room?"), PWA, offline, editor mode | Medium — real campus data work | [Fork room-tba](guides/room-tba) |
| [website](https://github.com/uplbtools/website) | Org landing site listing your tools | Easy — mostly rebrand + deploy | [Fork website](guides/website) |

Gradesim is **not** covered here — it has its own fork track.

## The 30-second version

1. [Stand up a campus org](guides/new-campus-org) — create the GitHub org,
   profile repo, and bootstrap the repo set.
2. [Fork room-tba](guides/room-tba) — clone, `bun run fork:init`, seed your
   campus data, deploy.
3. [Fork website](guides/website) — rebrand, list your tools, deploy.
4. [Keep your fork in sync](concepts/keep-in-sync) — periodically merge
   upstream improvements.

The `org-template/` directory in this repo contains a bootstrap script and
templates for step 1.
