# CLAUDE.md

This file provides guidance for Claude Code when working in this repository.

## Project Overview

Personal infosec blog for **Jonathan Strong** (`jonathanstrong.org`), migrated from Jekyll/GitHub Pages to **Astro** using the [astro-theme-cactus](https://github.com/chrismwilliams/astro-theme-cactus) template, deployed on **Cloudflare Pages**.

**Repository:** `mrjonstrong/website` (renamed from `mrjonstrong/mrjonstrong.github.io` to prevent GitHub Pages from auto-building)

## Commands

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server (http://localhost:4321)
pnpm build          # Production build -> dist/ (includes pagefind + CSP verification)
pnpm preview        # Preview production build locally
pnpm check          # Type check (astro check) + lint (biome check)
pnpm lint           # Auto-fix lint issues with biome
pnpm format         # Format with prettier
pnpm audit          # Check for known vulnerabilities
```

## Branch Strategy

- `main` — production (jonathanstrong.org)
- `develop` — integration branch
- `copilot/*` — GitHub Copilot feature branches, always branch from `develop`
- `claude/*` — Claude Code feature branches, always branch from `develop`
- All PRs require review before merging to `main` or `develop`

## Architecture

- **Framework:** Astro 5 (static output)
- **Theme:** astro-theme-cactus (customized)
- **Styling:** Tailwind CSS v4
- **Package manager:** pnpm 10.29.3 (do not use npm or yarn)
- **Deployment:** Cloudflare Pages (build command: `pnpm build`, output: `dist/`)
- **Node version:** 22 (see `.nvmrc`)

## Content

Blog posts live in `src/content/post/` as `.md` or `.mdx` files.

### Required frontmatter

```yaml
---
title: "Post title"          # max 60 characters — enforced by schema
description: "SEO summary"   # required, shown in post listings
publishDate: "YYYY-MM-DD"    # or ISO 8601 date
tags: ["tag1", "tag2"]       # array, not space-separated string
draft: true                  # omit or set false for published posts
pinned: false                # optional, pin to top of posts list
coverImage:                  # optional cover image
  src: ./image.jpg
  alt: "Image description"
ogImage: "/og-image.png"     # optional custom OG image
updatedDate: "YYYY-MM-DD"    # optional, for last update tracking
---
```

### URL structure

Posts are served at `/posts/[slug]` where slug is the **lowercased** filename (Astro lowercases all slugs automatically). Example: `src/content/post/Password-Managers.md` → `/posts/password-managers`.

Old Jekyll URLs at the site root redirect to the new paths via `public/_redirects` (Cloudflare Pages redirects).

### Images

Place images in `public/images/` and reference as `/images/filename.jpg`.

## Key Files

| File                              | Purpose                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `src/site.config.ts`              | Site title, description, author, URL, nav menu                                      |
| `astro.config.ts`                 | Astro integrations, markdown plugins, env schema                                    |
| `src/content.config.ts`           | Content collection schemas (post, note, tag)                                        |
| `src/components/SocialList.astro` | Footer social links                                                                 |
| `src/pages/about.astro`           | About page                                                                          |
| `src/plugins/`                    | Custom remark/rehype plugins                                                        |
| `public/_redirects`               | Cloudflare Pages URL redirects                                                      |
| `public/images/`                  | Static images                                                                       |
| `.github/workflows/`              | CI, security scanning, and supply-chain workflows (see CI Workflows table)          |
| `.github/dependabot.yml`          | Auto-updates: npm (minor + patch, grouped) + github-actions (SHA-pinned) to develop |
| `scripts/verify-csp-hashes.mjs`   | CSP hash verification (runs in postbuild)                                           |

## Security

- **Never** commit secrets, API keys, or `.env` files
- **Never** disable security scanning workflows (trivy)
- Keep dependencies up to date — run `pnpm audit` and `pnpm update --latest` periodically
- The `pnpm.overrides` section in `package.json` contains security patches for transitive dependencies — do not remove them without verifying security first
- **GitHub Actions supply chain:** All actions must be pinned to full commit SHAs (not tags or branches). Use `persist-credentials: false` on `actions/checkout` unless the workflow pushes. All workflows include `step-security/harden-runner` in audit mode as the first step. To resolve a tag to its commit SHA, use `gh api repos/OWNER/REPO/git/ref/tags/TAG` — if `.object.type` is `"tag"` (annotated), dereference with `gh api repos/OWNER/REPO/git/tags/SHA --jq '.object.sha'`; if `"commit"`, use `.object.sha` directly.
- **Linting:** This project uses Biome, not eslint — do not add eslint configs or pre-commit hooks

## CI Workflows

| Workflow                | Trigger                           | Purpose                                              |
| ----------------------- | --------------------------------- | ---------------------------------------------------- |
| `ci.yml`                | push/PR to main, develop          | Type check, lint (biome + markdownlint), build       |
| `trivy.yml`             | weekly + push/PR to main, develop | Filesystem vulnerability scanning                    |
| `dependency-review.yml` | pull_request                      | Flag vulnerable dependencies before merge            |
| `zizmor.yml`            | PR modifying `.github/workflows/` | Audit workflows for unpinned actions, injection, etc |
| `lighthouse.yml`        | weekly + manual                   | Lighthouse scores + badge generation                 |
| `observatory.yml`       | weekly + manual                   | Mozilla Observatory HTTP header check                |
| `scorecards.yml`        | weekly + push to main + branch_protection_rule | OpenSSF Scorecard supply-chain analysis              |

CI runs the same `pnpm check` and `pnpm build` commands used locally. The `postbuild` script runs `pagefind --site dist` for search indexing and `scripts/verify-csp-hashes.mjs` for CSP hash verification.

## Cloudflare Pages Setup

- **Repository:** `mrjonstrong/website`
- **Production branch:** `main` (deployed to jonathanstrong.org)
- **Preview branches:** Feature branches get automatic preview deployments
- **Build command:** `pnpm build`
- **Output directory:** `dist`
- **Environment variable:** `NODE_VERSION=22`
