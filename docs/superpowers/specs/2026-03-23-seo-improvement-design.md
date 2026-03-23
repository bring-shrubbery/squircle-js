# SEO Improvement Design: Blog & Docs for squircle.js.org

## Goal

Rank #1 for the "squircle" keyword by adding content-rich blog and docs pages to squircle.js.org. Pages are linked from a homepage footer but not actively promoted in the main navigation.

## Technical Architecture

### MDX Infrastructure

- **Dependencies:** `next-mdx-remote`, `gray-matter` (we use `next-mdx-remote` since MDX files live in a content directory, not co-located with routes — `@next/mdx` is not needed)
- **Content directories:**
  - `apps/web/content/blog/` — Blog MDX files
  - `apps/web/content/docs/` — Docs MDX files
- **MDX frontmatter schema:**
  ```yaml
  title: string          # Page title (used in <title> and <h1>)
  description: string    # Meta description
  date: string           # ISO date (blog only)
  keywords: string[]     # Meta keywords
  slug: string           # URL slug
  order: number          # Sidebar ordering (docs only)
  ```

### Routes

| Route | Purpose |
|---|---|
| `app/blog/page.tsx` | Blog index — chronological list of all posts |
| `app/blog/[slug]/page.tsx` | Individual blog post |
| `app/docs/[[...slug]]/page.tsx` | Docs pages (catch-all route, index + subpages) |

All pages use `generateStaticParams` for static generation at build time. Each page generates its own `metadata` export from frontmatter.

### Layouts

**Blog layout:**
- Max-width prose container consistent with current site aesthetic
- `<h1>` title, date below, then MDX content
- Bottom of each post: link back to blog index + link to relevant docs page where applicable

**Docs layout:**
- Left sidebar (~220px) with nav links, ordered by `order` frontmatter field
- Active page highlighted
- Collapsible on mobile (hamburger or slide-in)
- Content area uses same prose styling as blog
- Minimal — no heavy framework, just a simple sidebar component

### Interactive MDX Components

Used sparingly within content:

- **`<SquircleDemo />`** — Compact version of the homepage demo. Radius + smoothing sliders with a preview shape. Reuses logic from `SquircleDemoSection`.
- **`<SquircleComparison />`** — Two shapes side by side: regular `border-radius` vs squircle clip-path, with a smoothing slider to see the difference.
- **`<CodeBlock />`** — Syntax-highlighted code block. Reuses existing Prism/Atom One Dark setup.

### Footer

- New footer component added to the homepage below `LinksSection`
- Two columns: "Blog" and "Docs" listing all pages
- Subtle styling: smaller text, muted colors, thin separator line above
- Also rendered on blog and docs pages for cross-linking

### SEO Enhancements

- **Sitemap:** Update `sitemap.ts` to dynamically include all blog and docs pages
- **Siteconfig fix:** Change hostname from `squircle-button.js.org` to `https://squircle.js.org`
- **Structured data:** JSON-LD `Article` schema on blog posts, `TechArticle` on docs pages
- **Open Graph:** Tags generated from frontmatter per page
- **Canonical URLs:** Set per page from frontmatter slug

## Content Plan

### Blog Posts

#### 1. "What is a Squircle?" (`/blog/what-is-a-squircle`)
Primary keyword target. Covers:
- Definition of a squircle (square + circle portmanteau)
- Visual explanation of how it differs from a rounded rectangle
- Brief history — superellipse origins, Piet Hein
- Why squircles look more natural to the human eye
- Where squircles appear in real-world design (apps, hardware, furniture)

Interactive element: `<SquircleComparison />` showing border-radius vs squircle side-by-side.

**Target keywords:** squircle, what is a squircle, squircle shape, squircle definition

#### 2. "Squircle vs Rounded Rectangle: What's the Difference?" (`/blog/squircle-vs-rounded-rectangle`)
- Corner continuity (G2 continuity) explained visually
- Why rounded rectangles have an abrupt curvature transition
- Side-by-side comparison at various radii
- When to use each

Interactive element: `<SquircleComparison />` with adjustable radius.

**Target keywords:** squircle vs rounded rectangle, smooth corners, continuous corners, corner continuity

#### 3. "How Apple Uses Squircles in iOS Design" (`/blog/squircles-in-apple-design`)
- Apple's shift to squircles in iOS 7
- Why Apple chose continuous corners for app icons
- The design philosophy behind "natural" shapes
- How squircles appear across Apple's ecosystem (icons, hardware, UI elements)

**Target keywords:** apple squircle, ios squircle, ios icon shape, ios rounded corners, apple corner smoothing

#### 4. "The Math Behind Squircles: Superellipses Explained" (`/blog/math-behind-squircles`)
- Piet Hein and the superellipse
- The Lame curve formula: `|x/a|^n + |y/b|^n = 1`
- How different exponents create different shapes (n=2 is circle, n=4 is squircle, n=infinity is square)
- How this math translates to corner smoothing in practice

Interactive element: `<SquircleDemo />` with exponent visualization.

**Target keywords:** superellipse, squircle formula, squircle math, lame curve, piet hein superellipse

#### 5. "Squircles in Web Design: Why and How" (`/blog/squircles-in-web-design`)
- Why CSS `border-radius` only creates rounded rectangles, not squircles
- The gap between native app design and web
- Approaches: SVG clip-path, CSS Houdini, CSS `superellipse()` proposal
- Current browser support limitations
- How squircle-js bridges this gap

Interactive element: `<SquircleComparison />`.

**Target keywords:** squircle css, squircle web, smooth corners css, corner smoothing css, css superellipse

#### 6. "Figma Corner Smoothing on the Web" (`/blog/figma-corner-smoothing-on-the-web`)
- Figma's corner smoothing feature and what it does
- The design-to-development gap when handing off squircle designs
- How squircle-js uses the same algorithm as Figma (`figma-squircle`)
- Matching Figma designs pixel-perfectly on the web

Interactive element: `<SquircleDemo />` with Figma-equivalent smoothing values.

**Target keywords:** figma corner smoothing, figma smooth corners, figma squircle, corner smoothing css

### Docs Pages

#### 1. "Getting Started" (`/docs/getting-started`) — order: 1
- Installation (`pnpm add @squircle-js/react`)
- Basic usage example
- Minimal working component

#### 2. "Squircle Component" (`/docs/squircle-component`) — order: 2
- Full API reference for `<Squircle>`
- Props table (cornerRadius, cornerSmoothing, asChild, className, style)
- How it works internally (ResizeObserver + SVG clip-path)
- Usage examples

#### 3. "StaticSquircle Component" (`/docs/static-squircle`) — order: 3
- When to use StaticSquircle vs Squircle
- Performance benefits (no ResizeObserver)
- Props table (adds width/height)
- Usage examples

#### 4. "The asChild Pattern" (`/docs/as-child`) — order: 4
- Explanation of the Radix UI Slot pattern
- How to compose Squircle with any element
- Examples: buttons, links, images

#### 5. "Corner Smoothing Explained" (`/docs/corner-smoothing`) — order: 5
- What cornerSmoothing values mean (0 = regular border-radius, 0.6 = iOS-like, 1 = maximum)
- Visual guide with interactive demo
- Recommended values for common use cases

Interactive element: `<SquircleDemo />`.

#### 6. "No-JavaScript Fallback" (`/docs/no-javascript-fallback`) — order: 6
- How `<SquircleNoScript>` works
- SSR considerations
- Setup instructions

#### 7. "Examples & Recipes" (`/docs/examples`) — order: 7
- Buttons
- Cards
- Avatars
- Image containers
- Code snippets for each

## File Structure

```
apps/web/
  app/
    blog/
      layout.tsx                  # Blog layout (prose container)
      page.tsx                    # Blog index
      [slug]/
        page.tsx                  # Blog post page
    docs/
      layout.tsx                  # Docs layout (sidebar + content area)
      [[...slug]]/
        page.tsx                  # Docs page (catch-all)
  components/
    footer.tsx                    # New footer component
    docs-sidebar.tsx              # Docs sidebar navigation
    mdx/
      squircle-demo.tsx           # Interactive demo component
      squircle-comparison.tsx     # Side-by-side comparison component
      mdx-components.tsx          # MDX component overrides (headings, code, etc.)
  content/
    blog/
      what-is-a-squircle.mdx
      squircle-vs-rounded-rectangle.mdx
      squircles-in-apple-design.mdx
      math-behind-squircles.mdx
      squircles-in-web-design.mdx
      figma-corner-smoothing-on-the-web.mdx
    docs/
      getting-started.mdx
      squircle-component.mdx
      static-squircle.mdx
      as-child.mdx
      corner-smoothing.mdx
      no-javascript-fallback.mdx
      examples.mdx
  lib/
    mdx.ts                        # MDX utilities (frontmatter parsing, content loading)
```

## Out of Scope

- RSS feed (can add later)
- Search functionality
- Blog pagination (not needed with 6 posts)
- Comments system
- Analytics per-page (existing Umami covers this)
