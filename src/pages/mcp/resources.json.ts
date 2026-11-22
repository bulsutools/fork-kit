import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export interface GuideEntry {
  slug: string;
  title: string;
  description: string;
  path: string;
  markdown: string;
}

// Emits the full docs corpus as JSON at /mcp/resources.json. The Cloudflare
// Pages Function in functions/mcp.ts wraps this as MCP tools — new docs pages
// show up automatically because this is generated from the content collection.
export const GET: APIRoute = async () => {
  const docs = await getCollection("docs");
  const guides: GuideEntry[] = docs.map((entry) => ({
    slug: entry.id,
    title: entry.data.title ?? entry.id,
    description: entry.data.description ?? "",
    path: `/${entry.slug ?? entry.id}/`,
    markdown: entry.body ?? "",
  }));
  guides.sort((a, b) => a.slug.localeCompare(b.slug));

  return new Response(JSON.stringify({ guides }, null, 2) + "\n", {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
