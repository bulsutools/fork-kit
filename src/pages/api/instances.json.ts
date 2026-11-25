import type { APIRoute } from "astro";
import instances from "../../data/instances.json";

export const GET: APIRoute = () =>
	new Response(JSON.stringify({ instances }, null, 2), {
		headers: { "Content-Type": "application/json" },
	});
