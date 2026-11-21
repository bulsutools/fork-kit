#!/usr/bin/env bash
# bootstrap.sh — stand up a campus org's repo set from UPLB Tools forks.
#
# Usage:
#   ./bootstrap.sh <org-name> [domain]
#
# Example:
#   ./bootstrap.sh camtools cam.tools
#
# Prereqs: gh CLI authenticated, org already created on github.com.
# This script does NOT create the org (GitHub has no API for that) — do that
# first at https://github.com/account/organizations/new
set -euo pipefail

ORG="${1:?usage: bootstrap.sh <org-name> [domain]}"
DOMAIN="${2:-}"
HERE="$(cd "$(dirname "$0")" && pwd)"

say() { printf '\033[1;36m==>\033[0m %s\n' "$*"; }

# --- org profile repo -------------------------------------------------------
say "Creating $ORG/.github org profile repo"
if gh repo view "$ORG/.github" >/dev/null 2>&1; then
  say "$ORG/.github already exists, skipping"
else
  gh repo create "$ORG/.github" --public \
    --description "Org profile and defaults"
fi

PROFILE_TMP="$(mktemp -d)"
mkdir -p "$PROFILE_TMP/profile"
sed -e "s/<Org Display Name>/${ORG}/g" \
    -e "s|<domain>|${DOMAIN:-TODO-your-domain}|g" \
    "$HERE/org-profile/profile/README.md" > "$PROFILE_TMP/profile/README.md"
(
  cd "$PROFILE_TMP"
  git init -b main -q
  git add profile/README.md
  git -c user.name="$ORG bootstrap" -c user.email="bootstrap@localhost" \
      commit -qm "Add org profile"
  git remote add origin "git@github.com:$ORG/.github.git"
  git push -u origin main
) || say "profile push failed — push $PROFILE_TMP manually"
rm -rf "$PROFILE_TMP"

# --- fork the products ------------------------------------------------------
for repo in room-tba website; do
  if gh repo view "$ORG/$repo" >/dev/null 2>&1; then
    say "$ORG/$repo already exists, skipping"
  else
    say "Forking uplbtools/$repo -> $ORG/$repo"
    gh repo fork "uplbtools/$repo" --org "$ORG" --clone=false \
      || say "fork failed for $repo (missing perms? fork it manually on github.com)"
  fi
done

cat <<EOF

Done. Next steps:
  1. Clone each fork and follow the guides:
       https://github.com/$ORG/fork-kit  (or the docs site once deployed)
  2. room-tba: cp .env.example .env.local, bun install, bun run fork:init
  3. website: edit src/data/tools.ts + src/lib/site-meta.ts, npm run dev
  4. Work through org-template/REPO-CHECKLIST.md for every repo
EOF
