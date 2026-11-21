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
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "Stand up a campus org", slug: "guides/new-campus-org" },
        { label: "Instances", slug: "instances" },
        {
          label: "Projects",
          items: [
            { label: "Fork room-tba", slug: "guides/room-tba" },
            { label: "Fork Homepage", slug: "guides/website" },
          ],
        },
        {
          label: "Reference",
          items: [{ label: "Keeping forks in sync", slug: "keep-in-sync" }],
        },
      ],
    }),
  ],
});
