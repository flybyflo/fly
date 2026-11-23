---
name: cf-cli
description: Use Cloudflare's cf CLI for Cloudflare resources and Workers projects with cloudflare.config.ts.
---

Use `cf` on a current Node.js LTS release. If `cf cli search` is unavailable, use `npx --yes cf@latest` in place of `cf`.
Find commands with `cf cli search "<task>"`. Check arguments with `--help` or `cf schema <command>`. Preview writes with `--dry-run` where supported.
Keep Wrangler for `dev`, `build`, and `deploy` in projects with only a Wrangler config. [Cloudflare's guide for agents](https://developers.cloudflare.com/cf/agents/)
