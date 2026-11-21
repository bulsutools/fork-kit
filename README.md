# Campus Tools (fork-kit)

Fork kit for campus tools in the [UPLB Tools](https://github.com/uplbtools)
ecosystem: an Astro Starlight docs site ("fork wiki") explaining how to create
a campus fork of **room-tba**, **website**, and friends, plus an
`org-template/` bootstrap for new campus orgs. Live at
<https://fork.bulsu.tools>.

## Layout

- `src/content/docs/` — the fork wiki (edit these `.md` files)
- `org-template/` — org profile template, bootstrap script, checklists

## Develop

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static output in dist/
```

Deployed at <https://fork.bulsu.tools> (Cloudflare Pages — GitHub Actions
builds and deploys on push to `main`).

## Forks using this

- [bulsutools](https://github.com/bulsutools) — Bulacan State University

## One-click templates

[room-tba-template](https://github.com/new?template_name=room-tba-template&template_owner=bulsutools)
and
[website-template](https://github.com/new?template_name=website-template&template_owner=bulsutools)
are GitHub template repos (clean mirrors of upstream `main`) — use **Use this
template** to scaffold a campus repo without campus config baked in.
