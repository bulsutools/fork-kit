import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://fork.bulsu.tools",
  integrations: [
    starlight({
      title: "Campus Tools",
      description:
        "Fork guides and org bootstrap for campus tools — room-tba, website, and friends.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/bulsutools" }],
      sidebar: [
        {
          label: "Start here",
          items: [{ autogenerate: { directory: "guides" } }],
        },
        { label: "Instances", slug: "instances" },
        {
          label: "Concepts",
          items: [
            { label: "The fork model", slug: "concepts/fork-model" },
            { label: "Keeping forks in sync", slug: "concepts/keep-in-sync" },
          ],
        },
        {
          label: "Reference",
          items: [{ label: "Fork checklist", slug: "reference/checklist" }],
        },
      ],
    }),
  ],
});
