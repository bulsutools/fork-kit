# Git-connected Pages project: Cloudflare builds and deploys on every push
# to main, so no API token is needed in GitHub Actions.
#
# Auth: set CLOUDFLARE_API_TOKEN (Account → Cloudflare Pages → Edit) in the
# environment. account_id is required by provider v5 — pass it via
# TF_VAR_cloudflare_account_id or the variable default.

resource "cloudflare_pages_project" "fork_kit" {
  account_id        = var.cloudflare_account_id
  name              = var.pages_project_name
  production_branch = "main"

  build_config = {
    build_command   = "pnpm run build"
    destination_dir = "dist"
    root_dir        = ""
  }

  source = {
    type = "github"
    config = {
      owner                          = "bulsutools"
      repo_name                      = "fork-kit"
      production_branch              = "main"
      production_deployments_enabled = true
    }
  }
}
