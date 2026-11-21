variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project."
  type        = string
  default     = null
}

variable "pages_project_name" {
  description = "Cloudflare Pages project name."
  type        = string
  default     = "fork-kit"
}
