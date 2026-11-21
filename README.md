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

Set `site` in `astro.config.mjs` to the deployed URL before shipping.

## Forks using this

- [bulsutools](https://github.com/bulsutools) — Bulacan State University
