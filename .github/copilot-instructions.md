# GitHub Copilot Repository Instructions

This repository is a personal infosec blog built with Astro using the Cactus theme, deployed on Cloudflare Pages.

## Project Overview

- **Type**: Astro static site (astro-theme-cactus)
- **Purpose**: Personal blog about information security
- **Deployment**: Cloudflare Pages
- **Theme**: Cactus (dark/light mode)
- **Package Manager**: pnpm 10.29.3

## Build & Test Commands

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Production build -> dist/
pnpm build

# Preview production build locally
pnpm preview

# Type check (astro check) + lint (biome check)
pnpm check

# Auto-fix lint issues with biome
pnpm lint

# Format with prettier
pnpm format
```

### Linting

```bash
# Type checking and linting
pnpm check          # astro check + biome check
pnpm lint           # biome check --write (auto-fix)
pnpm format         # prettier -w . --cache

# CI runs these checks automatically on push/PR to main and develop branches
```

## Code Style & Conventions

### Blog Posts

- Blog posts go in `src/content/post/` directory as `.md` or `.mdx` files
- Use frontmatter for all posts:

  ```yaml
  ---
  title: "Your Title"          # max 60 characters (enforced by schema)
  description: "SEO summary"   # required, shown in post listings
  publishDate: "YYYY-MM-DD"    # or ISO 8601 date
  tags: ["tag1", "tag2"]       # array, not space-separated string
  draft: false                 # omit or set false for published posts
  pinned: false                # optional, pin to top of posts list
  coverImage:                  # optional cover image
    src: ./image.jpg
    alt: "Image description"
  ogImage: "/og-image.png"     # optional custom OG image
  updatedDate: "YYYY-MM-DD"    # optional, for last update tracking
  ---
  ```

### Directory Structure

- `src/content/post/`: Blog posts (.md, .mdx)
- `src/content/note/`: Content collection for short notes/microblog entries (defined in `src/content.config.ts`; create this directory when adding notes)
- `src/content/tag/`: Content collection for tag descriptions (defined in `src/content.config.ts`; create this directory when adding tags)
- `src/components/`: Astro components
- `src/layouts/`: Page layouts
- `src/pages/`: File-based routing pages
- `src/styles/`: Global styles (Tailwind CSS v4)
- `src/plugins/`: Custom remark/rehype plugins
- `public/`: Static assets (images, redirects, icons)
- `public/_redirects`: Cloudflare Pages redirects (Jekyll to Astro URL migration)
- `dist/`: Generated site output (built by Astro, not committed)

## Workflow & Branching

- Main branch: `main` (production, deployed to jonathanstrong.org)
- Development branch: `develop`
- Feature branches should be created from `develop`
- Copilot branches: `copilot/*` (created by GitHub Copilot)
- All changes require PR review before merging
- CI workflow runs on pushes to `main` and `develop` branches and on all PRs
- Trivy security scanning runs weekly and on push/PR

## Security & Boundaries

### DO NOT

- Commit secrets, API keys, or credentials
- Modify security scanning workflows without careful consideration
- Edit files in `dist/` directory (auto-generated, not committed)
- Change `.github/workflows/` files unless specifically requested
- Remove or disable security scanning tools (Trivy)
- Remove security overrides from `pnpm.overrides` in package.json without checking first

### DO

- Follow security best practices in blog posts
- Keep dependencies up to date (Dependabot auto-updates to `develop` daily)
- Review Dependabot alerts promptly
- Maintain code quality and security standards enforced by CI tools
- Test builds locally before pushing (`pnpm build` includes pagefind indexing and CSP hash verification)

## Astro Features

The site uses the following Astro integrations and plugins:

**Astro Integrations:**

- `@astrojs/mdx`: MDX support
- `@astrojs/sitemap`: Automatic sitemap generation
- `astro-expressive-code`: Code syntax highlighting (Dracula dark, GitHub Light themes)
- `astro-icon`: Icon components (MDI icons)
- `astro-robots-txt`: Robots.txt generation
- `astro-webmanifest`: Web manifest for PWA

**Libraries (not integrations):**

- `@astrojs/rss`: RSS feed generation via endpoint files (`src/pages/rss.xml.ts`, `src/pages/notes/rss.xml.ts`)

**Remark Plugins:**

- `remark-directive`: Handle ::: directives in markdown
- `remark-reading-time`: Calculate reading time (custom plugin)
- `remark-github-card`: GitHub card embeds (custom plugin)
- `remark-admonitions`: Admonition blocks (custom plugin)

**Rehype Plugins:**

- `rehypeHeadingIds` (from `@astrojs/markdown-remark`): Add IDs to headings
- `rehype-autolink-headings`: Make headings clickable links
- `rehype-external-links`: External links open in new tab with noopener/noreferrer
- `rehype-unwrap-images`: Remove paragraph wrappers from images

**Build Tools:**

- `pagefind`: Client-side search indexing (runs via postbuild script)

## Testing Changes

Before submitting a PR:

1. Type check and lint: `pnpm check`
2. Build the site: `pnpm build` (includes pagefind indexing and CSP verification)
3. Preview and review: `pnpm preview`
4. Verify all links work
5. Ensure posts display correctly
6. Check markdown linting (runs automatically in CI)

## Common Tasks

### Adding a New Blog Post

1. Create file in `src/content/post/` with a descriptive filename
2. Add frontmatter with title, description, publishDate, and tags
3. Write content in Markdown
4. Test locally before committing

### Adding Images

1. Place images in `public/images/` directory
2. Reference in posts: `![Alt text](/images/image-name.png)`
3. Optimize images for web before committing

## Additional Notes

- **Site URL:** <https://jonathanstrong.org>
- **Node version:** 22 (see `.nvmrc`)
- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4
- **Theme:** astro-theme-cactus (customized)
- **Old Jekyll URLs** redirect to new `/posts/` paths via `public/_redirects`
- **URL structure:** Posts are served at `/posts/[slug]` where slug is the lowercased filename
- **Pagination and dark/light mode** are built into the Cactus theme
- **Build process:** `postbuild` script runs pagefind indexing and CSP hash verification
- **CI workflows:** `ci.yml` (type check, lint, build) and `trivy.yml` (security scanning)
