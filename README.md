# Campus Tools (fork-kit)

Fork kit for campus tools in the [UPLB Tools](https://github.com/uplbtools)
ecosystem: an Astro Starlight docs site ("fork wiki") explaining how to create
a campus fork of **room-tba**, **website**, and friends, plus an
`org-template/` bootstrap for new campus orgs. Live at
<https://fork.bulsu.tools>.

## Layout

- `src/content/docs/` — the fork wiki (edit these `.md` files)
- `src/data/instances.json` — campus instances registry (powers `/instances` and `/api/instances.json`)
- `org-template/` — org profile template, bootstrap script, checklists

## Develop

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # static output in dist/
```

Deployed at <https://fork.bulsu.tools> (Cloudflare Pages — GitHub Actions
builds and deploys on push to `main`).

## MCP server

The wiki is also served over MCP (Streamable HTTP, JSON responses) at
`https://fork.bulsu.tools/mcp` so agents can retrieve guides programmatically.
It is a Cloudflare Pages Function in `functions/mcp.ts` with zero runtime
dependencies; it reads `/mcp/resources.json`, which an Astro endpoint
(`src/pages/mcp/resources.json.ts`) generates from the `docs` content
collection at build time — new pages in `src/content/docs/` appear automatically.

Tools:

- `list_guides` — all wiki pages (slug, title, path, summary)
- `get_guide(slug)` — full markdown of a page, identical to the published source
- `search_docs(query)` — keyword search over the corpus

MCP client config:

```json
{
  "mcpServers": {
    "fork-kit": {
      "url": "https://fork.bulsu.tools/mcp"
    }
  }
}
```

## Forks using this

- [bulsutools](https://github.com/bulsutools) — Bulacan State University

## One-click templates

[room-tba-template](https://github.com/new?template_name=room-tba-template&template_owner=bulsutools)
and
[website-template](https://github.com/new?template_name=website-template&template_owner=bulsutools)
are GitHub template repos (clean mirrors of upstream `main`) — use **Use this
template** to scaffold a campus repo without campus config baked in.
