import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  // TODO: set this to wherever the site is deployed
  site: "https://fork.bulsu.tools",
  integrations: [
    starlight({
      title: "UPLB Tools Fork Kit",
      description:
        "How to fork UPLB Tools projects — room-tba, website, and friends — into your own campus org.",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/bulsutools" }],
      sidebar: [
        {
          label: "Start here",
          items: [{ autogenerate: { directory: "guides" } }],
        },
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
