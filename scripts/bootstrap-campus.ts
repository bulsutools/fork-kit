#!/usr/bin/env tsx
// bootstrap-campus.ts — agent-driven campus fork bootstrap.
//
// Takes {campus_name, campus_slug, tools[]} and produces a ready-to-review
// scaffold: rendered org profile README, per-tool repo checklists with exact
// commands, and a single PR-ready PLAN.md. Never creates GitHub orgs; repo
// commands only run with --execute and are idempotent (gh repo view guards).
//
// Usage:
//   pnpm bootstrap --campus acme --tools room-tba,website --dry-run
//   pnpm bootstrap --campus acme --name "Acme Tools" --domain acme.tools
//   pnpm bootstrap --campus acme --execute   # also runs the gh commands
//
// Guide: https://fork.bulsu.tools/guides/new-campus-org/

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..");
const FORK_KIT = "https://fork.bulsu.tools";
const FORK_KIT_REPO = "https://github.com/bulsutools/fork-kit";

interface Args {
  campus: string;
  name: string;
  university: string;
  domain: string;
  tools: string[];
  out: string;
  dryRun: boolean;
  execute: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Record<string, string> = {};
  let dryRun = false;
  let execute = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") dryRun = true;
    else if (a === "--execute") execute = true;
    else if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[++i];
      if (val === undefined || val.startsWith("--")) {
        console.error(`Missing value for ${a}`);
        process.exit(2);
      }
      args[key] = val;
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  if (!args.campus) {
    console.error(
      "usage: pnpm bootstrap --campus <org-slug> [--name <display>] [--university <name>] [--domain <domain>] [--tools room-tba,website] [--out <dir>] [--dry-run] [--execute]",
    );
    process.exit(2);
  }
  const slug = args.campus;
  return {
    campus: slug,
    name: args.name ?? slug.replace(/(^|-)(\w)/g, (_, _p, c: string) => c.toUpperCase()),
    university: args.university ?? "your university",
    domain: args.domain ?? "",
    tools: (args.tools ?? "room-tba,website").split(",").map((t) => t.trim()).filter(Boolean),
    out: args.out ?? join("scaffold", slug),
    dryRun,
    execute,
  };
}

interface ToolSpec {
  label: string;
  upstream: string;
  template: string;
  guide: string;
  repoChecklist: string;
  siteUrl: (a: Args) => string;
  configChecklist: (a: Args) => string[];
  deployChecklist: (a: Args) => string[];
}

const TOOLS: Record<string, ToolSpec> = {
  "room-tba": {
    label: "Room TBA",
    upstream: "uplbtools/room-tba",
    template: "bulsutools/room-tba-template",
    guide: `${FORK_KIT}/guides/room-tba/`,
    repoChecklist: `${FORK_KIT_REPO}/blob/main/org-template/REPO-CHECKLIST.md`,
    siteUrl: (a) => `https://room-tba.${a.domain || "TODO-your-domain"}`,
    configChecklist: (a) => [
      `Clone and \`cp .env.example .env.local\`; set \`DATABASE_URL\` (Supabase session pooler), \`ADMIN_SESSION_SECRET\` (32+ random chars), \`MAPTILER_KEY\`.`,
      `bun install && bunx drizzle-kit push`,
      `\`bun run fork:init\` — interactive rewrite of \`src/campus.config.ts\` for ${a.name} (site, map bounds, camera, terrain, transit, community links). Refuses on a dirty tree; \`--force\` overrides.`,
      `Replace UPLB-only files per the guide table: \`src/constants/community-links.ts\`, \`public/room_info.json\`, jeepney routes/geometries, UPLB importers, \`src/pages/wiki/section-times.astro\`.`,
      `\`bun run seed:sample\` smoke test, then \`bun dev\` → http://localhost:4321.`,
      `Full data guide: https://github.com/uplbtools/room-tba/blob/main/docs/fork-data-guide.md`,
    ],
    deployChecklist: (a) => [
      `Canonical site URL: ${TOOLS["room-tba"].siteUrl(a)}`,
      `Deploy to Vercel (import repo, add env vars) or any Node host — \`bun run build\` prerenders from the DB so \`DATABASE_URL\` must exist at build time.`,
      `Attach DNS for \`room-tba.${a.domain || "<domain>"}\` once the domain exists.`,
      `Secrets (never committed): \`DATABASE_URL\`, \`ADMIN_SESSION_SECRET\`, \`MAPTILER_KEY\`, \`ADMIN_PASSWORD\`.`,
    ],
  },
  website: {
    label: "Website",
    upstream: "uplbtools/website",
    template: "bulsutools/website-template",
    guide: `${FORK_KIT}/guides/website/`,
    repoChecklist: `${FORK_KIT_REPO}/blob/main/org-template/REPO-CHECKLIST.md`,
    siteUrl: (a) => `https://${a.domain || "TODO-your-domain"}`,
    configChecklist: (a) => [
      `Edit \`src/data/tools.ts\` — list only ${a.name} tools.`,
      `Edit \`src/lib/site-meta.ts\` — site name, description, socials for ${a.name}.`,
      `Set \`site\` in \`astro.config.mjs\` to ${TOOLS.website.siteUrl(a)}.`,
      `Replace \`public/\` brand assets (screenshots, OG, favicon, brand/); rewrite README.`,
      `\`npm install && npm run dev\` to preview; \`npm run generate:og\` after rebrand.`,
    ],
    deployChecklist: (a) => [
      `Canonical site URL: ${TOOLS.website.siteUrl(a)}`,
      `Cloudflare Pages: create project, connect repo, build \`npm run build\`, output \`dist\`; add \`.github/workflows/deploy-cloudflare.yml\` with \`CLOUDFLARE_API_TOKEN\` + \`CLOUDFLARE_ACCOUNT_ID\` secrets (see bulsutools/website).`,
      `Vercel alternative: import repo, framework preset Astro, defaults work.`,
      `Attach DNS for \`${a.domain || "<domain>"}\` (and \`www\` if wanted) to the Pages/Vercel project.`,
      `Optional: \`public/_redirects\` and \`workers/\` pattern for subdomain redirects.`,
    ],
  },
};

function renderProfileReadme(a: Args): string {
  const tpl = readFileSync(
    join(REPO_ROOT, "org-template/org-profile/profile/README.md"),
    "utf8",
  );
  const domain = a.domain || "TODO-your-domain";
  return tpl
    .replaceAll("<Org Display Name>", a.name)
    .replaceAll("<domain>", domain)
    .replaceAll("<University>", a.university)
    .replace(
      "<!-- One-line description placeholder -->",
      "",
    )
    .replace(
      /<One-line description:[^>]*>/,
      `Free tools for the ${a.university} community.`,
    );
}

function toolChecklist(a: Args, tool: string): string {
  const t = TOOLS[tool];
  const org = a.campus;
  const repo = tool;
  const lines: string[] = [
    `# ${t.label} fork checklist — ${a.name} (\`${org}\`)`,
    ``,
    `Guide: ${t.guide}`,
    `Per-repo checklist: ${t.repoChecklist}`,
    ``,
    `## Repo setup`,
    ``,
    `Option A — fork upstream:`,
    "",
    "```sh",
    `gh repo fork ${t.upstream} --org ${org} --clone=false`,
    `git clone git@github.com:${org}/${repo}.git`,
    "```",
    ``,
    `Option B — template repo (clean mirror of upstream main):`,
    "",
    `[Use this template](https://github.com/new?template_name=${tool}-template&template_owner=bulsutools)`,
    "",
    "```sh",
    `git clone git@github.com:${org}/${repo}.git`,
    "```",
    ``,
    "Either way, once for syncs:",
    "",
    "```sh",
    `git remote add upstream git@github.com:${t.upstream}.git`,
    "```",
    ``,
    `## Config (${a.name})`,
    "",
    ...t.configChecklist(a).map((s, i) => `${i + 1}. ${s}`),
    ``,
    `## Deploy + DNS`,
    "",
    ...t.deployChecklist(a).map((s, i) => `${i + 1}. ${s}`),
    ``,
  ];
  return lines.join("\n");
}

function buildPlan(a: Args): string {
  const tools = a.tools.map((t) => {
    if (!TOOLS[t]) {
      console.error(`Unknown tool "${t}". Supported: ${Object.keys(TOOLS).join(", ")}`);
      process.exit(2);
    }
    return t;
  });
  const domain = a.domain || "TODO-your-domain";
  const L: string[] = [
    `# Bootstrap plan — ${a.name} (\`${a.campus}\`)`,
    ``,
    `Generated by \`scripts/bootstrap-campus.ts\` from [fork-kit](${FORK_KIT}).`,
    `Full walkthrough: ${FORK_KIT}/guides/new-campus-org/`,
    ``,
    `## Inputs`,
    ``,
    `- Org slug: \`${a.campus}\``,
    `- Display name: ${a.name}`,
    `- University: ${a.university}`,
    `- Domain: ${domain}${a.domain ? "" : " (placeholder — set --domain)"}`,
    `- Tools: ${tools.join(", ")}`,
    `- Mode: ${a.dryRun ? "dry-run (no files written, no commands run)" : a.execute ? "execute (scaffold written + gh commands run)" : "scaffold only (files written, commands printed)"}`,
    ``,
    `## Prereqs`,
    ``,
    `- \`gh\` CLI authenticated with permission to create repos in \`${a.campus}\``,
    `- Org \`${a.campus}\` already exists on github.com (org creation is manual: https://github.com/account/organizations/new)`,
    ``,
    `## Step 1 — org profile repo`,
    ``,
    `Rendered README: \`org-profile/profile/README.md\` in this scaffold.`,
    "",
    "```sh",
    `gh repo create ${a.campus}/.github --public --description "Org profile and defaults"`,
    "# push the rendered profile/README.md (clone, copy, commit, push)",
    "```",
    ``,
    `Org profile guide: ${FORK_KIT}/guides/new-campus-org/`,
    ``,
    `## Step 2 — tool repos`,
    ``,
  ];
  for (const t of tools) {
    const spec = TOOLS[t];
    L.push(
      `### ${spec.label} (\`${t}\`)`,
      ``,
      `- Upstream: ${spec.upstream} · Guide: ${spec.guide}`,
      `- Template repo (one-click): https://github.com/new?template_name=${t}-template&template_owner=bulsutools`,
      `- Checklist with exact commands: \`checklists/${t}.md\``,
      ``,
    );
  }
  L.push(
    `## Step 3 — review gate`,
    ``,
    `Human reviews this scaffold, then either:`,
    ``,
    `- runs the printed \`gh\` commands manually, or`,
    `- re-runs with \`--execute\` to let the script run them (idempotent; skips repos that already exist).`,
    ``,
    `No GitHub orgs are created by this script. No repos are created without \`--execute\`.`,
    ``,
    `## Step 4 — per-repo work`,
    ``,
    `Each \`checklists/<tool>.md\` lists config values, deploy target, and DNS/Pages steps.`,
    `Terse version of every repo: ${FORK_KIT_REPO}/blob/main/org-template/REPO-CHECKLIST.md`,
    ``,
  );
  return L.join("\n");
}

function gh(args: string[]): { ok: boolean; out: string } {
  try {
    const out = execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return { ok: true, out: out.trim() };
  } catch (e) {
    const err = e as { stderr?: string; message?: string };
    return { ok: false, out: (err.stderr || err.message || "gh failed").trim() };
  }
}

function repoExists(org: string, repo: string): boolean {
  return gh(["repo", "view", `${org}/${repo}`]).ok;
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  const tools = a.tools.map((t) => {
    if (!TOOLS[t]) {
      console.error(`Unknown tool "${t}". Supported: ${Object.keys(TOOLS).join(", ")}`);
      process.exit(2);
    }
    return t;
  });
  a.tools = tools;

  const plan = buildPlan(a);
  const profile = renderProfileReadme(a);
  const steps: string[] = [];

  if (a.dryRun) {
    console.log(plan);
    console.log("--- dry-run: no files written, no commands executed ---");
    return;
  }

  const outDir = join(REPO_ROOT, a.out);
  mkdirSync(join(outDir, "org-profile/profile"), { recursive: true });
  mkdirSync(join(outDir, "checklists"), { recursive: true });
  writeFileSync(join(outDir, "PLAN.md"), plan);
  writeFileSync(join(outDir, "org-profile/profile/README.md"), profile);
  for (const t of tools) {
    writeFileSync(join(outDir, "checklists", `${t}.md`), toolChecklist(a, t));
  }
  steps.push(`rendered org profile README -> ${a.out}/org-profile/profile/README.md`);
  steps.push(`rendered ${tools.length} tool checklist(s) -> ${a.out}/checklists/`);
  steps.push(`wrote plan -> ${a.out}/PLAN.md`);

  if (a.execute) {
    // Org profile repo: create if missing, push rendered README.
    if (repoExists(a.campus, ".github")) {
      steps.push(`skip: ${a.campus}/.github already exists`);
    } else {
      const r = gh(["repo", "create", `${a.campus}/.github`, "--public", "--description", "Org profile and defaults"]);
      steps.push(r.ok ? `created ${a.campus}/.github` : `FAILED create ${a.campus}/.github: ${r.out}`);
      // Push profile README via gh api contents (single file, no clone needed).
      if (r.ok) {
        const content = Buffer.from(profile, "utf8").toString("base64");
        const put = gh([
          "api", `repos/${a.campus}/.github/contents/profile/README.md`, "-X", "PUT",
          "-f", "message=Add org profile",
          "-f", `content=${content}`,
        ]);
        steps.push(put.ok ? "pushed profile/README.md" : `FAILED push profile README: ${put.out}`);
      }
    }
    for (const t of tools) {
      const spec = TOOLS[t];
      if (repoExists(a.campus, t)) {
        steps.push(`skip: ${a.campus}/${t} already exists`);
        continue;
      }
      const r = gh(["repo", "fork", spec.upstream, "--org", a.campus, "--clone=false"]);
      steps.push(r.ok ? `forked ${spec.upstream} -> ${a.campus}/${t}` : `FAILED fork ${t}: ${r.out} (fork manually or use template: ${spec.template})`);
    }
  } else {
    steps.push("gh commands printed in PLAN.md not run (pass --execute to run them)");
  }

  writeFileSync(join(outDir, "STEPS.log"), steps.map((s) => `- ${s}`).join("\n") + "\n");
  console.log(plan);
  console.log(`--- scaffold written to ${a.out}/ (see STEPS.log) ---`);
}

main();
