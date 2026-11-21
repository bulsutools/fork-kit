# fork-kit

Fork kit for [UPLB Tools](https://github.com/uplbtools): an Astro Starlight
docs site ("fork wiki") explaining how to create a campus fork of **room-tba**,
**website**, and friends, plus an `org-template/` bootstrap for new campus orgs.

## Layout

- `src/content/docs/` — the fork wiki (edit these `.md` files)
- `org-template/` — org profile template, bootstrap script, checklists

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

Deployed at <https://fork.bulsu.tools> (Cloudflare Pages, direct upload).

## Forks using this

- [bulsutools](https://github.com/bulsutools) — Bulacan State University

## One-click templates

[bulsutools/room-tba-template](https://github.com/bulsutools/room-tba-template)
and [bulsutools/website-template](https://github.com/bulsutools/website-template)
are GitHub template repos (clean mirrors of upstream `main`) — use **Use this
template** to scaffold a campus repo without BulSU config baked in.
