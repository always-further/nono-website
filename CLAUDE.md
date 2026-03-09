# nono-website

## SEO Requirements

Every page on nono.sh MUST include the following. The `test:seo` script enforces these at build time.

### All Pages (static and dynamic)

1. **Title** — Use the `| nono` template. Set via `metadata.title` (static) or `generateMetadata` (dynamic). The root layout template (`%s | nono`) handles the suffix automatically when using a plain string title.
2. **Meta description** — Unique, 120–160 characters, includes target keyword.
3. **Canonical URL** — Set via `alternates: { canonical: "/path" }`.
4. **OpenGraph tags** — At minimum: `title`, `description`, `type` ("website" for static, "article" for blog/guides/academy), and `images` (fallback to `/logo.png`).
5. **Twitter card** — Inherited from root layout if OG is set correctly. Add `twitter:` object explicitly if the page needs a different title/description than OG.

### Blog Posts (`/blog/[slug]`)

- OG type: `"article"` with `publishedTime`, `authors`, `tags`
- `BlogPostSchema` JSON-LD (Article type)
- `BreadcrumbSchema` JSON-LD: Home → Blog → Post Title

### Guides (`/guides/[slug]`)

- OG type: `"article"` with `publishedTime`
- `BreadcrumbSchema` JSON-LD: Home → Guides → Guide Title

### Academy Lessons (`/academy/[slug]`)

- OG type: `"article"` with `publishedTime`
- `BreadcrumbSchema` JSON-LD: Home → Academy → Lesson Title

### Infrastructure Pages (`/linux-sandbox`, `/undo`, `/audit-trail`, `/provenance`, `/runtime-supervisor`)

- OG type: `"website"`
- OG image: `/logo.png` (or page-specific if available)

### SDK Pages (`/python-sdk`, `/typescript-sdk`)

- OG type: `"website"`
- OG image: `/logo.png` (or page-specific if available)

### Content Frontmatter (MDX files)

Blog posts in `content/blog/` MUST include:
```yaml
title: "Post Title"
date: "YYYY-MM-DD"
description: "120-160 char meta description with target keyword"
author: "Author Name"
tags: ["tag1", "tag2"]
```

Guides in `content/guides/` MUST include:
```yaml
title: "Guide Title"
date: "YYYY-MM-DD"
description: "120-160 char meta description with target keyword"
```

Academy lessons in `content/academy/` MUST include:
```yaml
title: "Lesson Title"
date: "YYYY-MM-DD"
description: "120-160 char meta description with target keyword"
author: "Author Name"
tags: ["tag1", "tag2"]
difficulty: "beginner" | "intermediate" | "advanced"
duration: "X min"
```

### Structured Data (JSON-LD)

The root layout includes these globally:
- `OrganizationSchema` — Always Further org info + social profiles
- `WebSiteSchema` — nono site metadata
- `SoftwareApplicationSchema` — nono as free SecurityApplication

Content pages add their own:
- `BlogPostSchema` — Article schema on `/blog/[slug]`
- `BreadcrumbSchema` — On all nested content pages

### Sitemap

`app/sitemap.ts` dynamically generates entries for all routes. When adding a new static page, ensure it appears in the sitemap generation logic.

### Title Separator

Use `|` not `-` as the separator. Examples:
- Homepage: `Next-Generation Agent Security | nono`
- Child page: `Linux Sandbox - Kernel-Level Isolation for AI Agents | nono`
- Blog post: `Post Title | nono` (via template)

### Internal Linking

- Use Next.js `Link` component for all internal links (not `<a>` tags)
- Infrastructure pages should cross-link to related infrastructure pages and relevant guides
- Blog posts should link to relevant docs, infrastructure pages, and guides
- Footer sitemap columns provide site-wide internal linking

## Dev Commands

- `npm run dev` — Dev server
- `npm run build` — Production build
- `npm run test:seo` — SEO smoke tests (run after build)
