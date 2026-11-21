# org-template

Bootstrap assets for standing up a new campus org from UPLB Tools forks.

- `bootstrap.sh <org> [domain]` — creates the `.github` org profile repo from
  the template and forks `room-tba` + `website` into the org. Org creation
  itself is manual on github.com.
- `org-profile/profile/README.md` — template for the org profile README.
- `REPO-CHECKLIST.md` — per-repo checklist to run after every fork.

See the docs site (`src/content/docs/guides/new-campus-org.md`) for the full
walkthrough. Live at <https://fork.bulsu.tools>.

For a true one-click start, use the GitHub template repos instead of forking:
[room-tba-template](https://github.com/new?template_name=room-tba-template&template_owner=bulsutools)
and
[website-template](https://github.com/new?template_name=website-template&template_owner=bulsutools)
(both marked `is_template`, clean mirrors of upstream `main` — no campus
config baked in).
