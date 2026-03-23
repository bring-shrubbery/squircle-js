# SEO Blog & Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add blog and docs sections to squircle.js.org for SEO, targeting the "squircle" keyword with educational articles and project documentation.

**Architecture:** Next.js App Router with MDX content loaded via `next-mdx-remote`. Content lives in `apps/web/content/` as `.mdx` files with YAML frontmatter. Blog uses a simple article layout; docs uses a minimal sidebar layout. Interactive MDX components (demos, comparisons) are used sparingly.

**Tech Stack:** Next.js 15, next-mdx-remote, gray-matter, Tailwind CSS v4, Prism.js (existing), @squircle-js/react (existing)

**Spec:** `docs/superpowers/specs/2026-03-23-seo-improvement-design.md`

---

## File Structure

### New Files

```
apps/web/
  app/
    blog/
      layout.tsx                       # Blog prose layout wrapper
      page.tsx                         # Blog index (list all posts)
      [slug]/
        page.tsx                       # Individual blog post renderer
    docs/
      layout.tsx                       # Docs layout with sidebar
      [[...slug]]/
        page.tsx                       # Docs page renderer (catch-all)
  components/
    footer.tsx                         # Site footer with blog/docs links
    docs-sidebar.tsx                   # Docs sidebar navigation
    mdx/
      mdx-components.tsx               # MDX component map (prose styling overrides)
      code-block.tsx                   # Syntax-highlighted code block (prism-react-renderer)
      squircle-demo.tsx                # Compact interactive demo (sliders + preview)
      squircle-comparison.tsx          # Side-by-side border-radius vs squircle
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
    mdx.ts                             # MDX utilities: load, parse, list content
```

### Modified Files

```
apps/web/package.json                  # Add next-mdx-remote, gray-matter
apps/web/app/page.tsx                  # Add Footer import
apps/web/app/sitemap.ts                # Add blog + docs URLs
apps/web/lib/siteconfig.ts             # Fix hostname
```

---

## Task 1: Install Dependencies & Fix Siteconfig

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/lib/siteconfig.ts`

- [ ] **Step 1: Install MDX dependencies**

Run from repo root:
```bash
cd apps/web && pnpm add next-mdx-remote gray-matter
```

- [ ] **Step 2: Fix siteconfig hostname**

In `apps/web/lib/siteconfig.ts`, change line 2:
```typescript
// Before:
hostname: "https://squircle-button.js.org/",
// After:
hostname: "https://squircle.js.org",
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/package.json apps/web/lib/siteconfig.ts pnpm-lock.yaml
git commit -m "feat: add MDX dependencies and fix siteconfig hostname"
```

---

## Task 2: MDX Content Utilities

**Files:**
- Create: `apps/web/lib/mdx.ts`

- [ ] **Step 1: Create the MDX utility module**

Create `apps/web/lib/mdx.ts` with functions to:
- `getContentBySlug(type: "blog" | "docs", slug: string)` — reads an MDX file, parses frontmatter with `gray-matter`, returns `{ frontmatter, content }`
- `getAllContent(type: "blog" | "docs")` — lists all MDX files in a content directory, returns sorted array of frontmatter (blog: by date desc, docs: by order asc)

```typescript
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  keywords: string[];
  slug: string;
}

export interface DocsFrontmatter {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  order: number;
}

export function getContentBySlug<T extends "blog" | "docs">(
  type: T,
  slug: string,
): {
  frontmatter: T extends "blog" ? BlogFrontmatter : DocsFrontmatter;
  content: string;
} {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    frontmatter: data as T extends "blog" ? BlogFrontmatter : DocsFrontmatter,
    content,
  };
}

export function getAllContent<T extends "blog" | "docs">(
  type: T,
): (T extends "blog" ? BlogFrontmatter : DocsFrontmatter)[] {
  const dir = path.join(contentDirectory, type);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const items = files.map((file) => {
    const fileContents = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(fileContents);
    return data as T extends "blog" ? BlogFrontmatter : DocsFrontmatter;
  });

  if (type === "blog") {
    return items.sort(
      (a, b) =>
        new Date((b as BlogFrontmatter).date).getTime() -
        new Date((a as BlogFrontmatter).date).getTime(),
    );
  }

  return items.sort(
    (a, b) =>
      (a as DocsFrontmatter).order - (b as DocsFrontmatter).order,
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm typecheck
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/mdx.ts
git commit -m "feat: add MDX content loading utilities"
```

---

## Task 3: MDX Components (Prose Styling + Interactive Demos)

**Files:**
- Create: `apps/web/components/mdx/mdx-components.tsx`
- Create: `apps/web/components/mdx/code-block.tsx`
- Create: `apps/web/components/mdx/squircle-demo.tsx`
- Create: `apps/web/components/mdx/squircle-comparison.tsx`

- [ ] **Step 1: Create CodeBlock component**

Create `apps/web/components/mdx/code-block.tsx` — uses `prism-react-renderer` (already installed) with the existing Atom One Dark theme:

```tsx
"use client";

import { Highlight, themes } from "prism-react-renderer";

export const CodeBlock = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const language = className?.replace("language-", "") ?? "text";

  return (
    <Highlight code={children.trim()} language={language} theme={themes.oneDark}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="mb-4 overflow-x-auto rounded-lg p-4 text-sm"
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={`line-${i}`} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={`token-${key}`} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
```

- [ ] **Step 2: Create MDX component map**

Create `apps/web/components/mdx/mdx-components.tsx`. This maps standard HTML elements to styled versions for prose content, and registers custom interactive components.

```tsx
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "./code-block";
import { SquircleComparison } from "./squircle-comparison";
import { SquircleDemo } from "./squircle-demo";

export const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mb-4 font-bold text-3xl" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 mb-4 font-semibold text-2xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-3 font-semibold text-xl" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-inside list-disc space-y-2" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-inside list-decimal space-y-2" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-4 border-l-4 border-muted pl-4 italic"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
      {...props}
    />
  ),
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
    // MDX wraps code blocks in <pre><code>. Extract the code child's props.
    const codeElement = children as React.ReactElement<{
      children: string;
      className?: string;
    }>;
    if (codeElement?.props) {
      return (
        <CodeBlock className={codeElement.props.className}>
          {codeElement.props.children}
        </CodeBlock>
      );
    }
    return <pre className="mb-4 overflow-x-auto rounded-lg bg-primary p-4 text-primary-foreground text-sm" {...props}>{children}</pre>;
  },
  hr: () => <hr className="my-8 border-border" />,
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
  // Custom interactive components
  SquircleDemo,
  SquircleComparison,
};
```

- [ ] **Step 2: Create SquircleDemo component**

Create `apps/web/components/mdx/squircle-demo.tsx` — a compact version of the homepage demo.

```tsx
"use client";

import { Squircle } from "@squircle-js/react";
import { useState } from "react";

export const SquircleDemo = () => {
  const [cornerRadius, setCornerRadius] = useState(20);
  const [cornerSmoothing, setCornerSmoothing] = useState(1);

  return (
    <div className="my-8 rounded-lg border border-border p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <Squircle
          className="h-32 w-32 shrink-0 bg-foreground"
          cornerRadius={cornerRadius}
          cornerSmoothing={cornerSmoothing}
        />
        <div className="w-full space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Corner Radius: {cornerRadius}px
            </span>
            <input
              className="w-full"
              max={50}
              min={0}
              onChange={(e) => setCornerRadius(Number(e.target.value))}
              type="range"
              value={cornerRadius}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">
              Corner Smoothing: {cornerSmoothing}
            </span>
            <input
              className="w-full"
              max={1}
              min={0}
              onChange={(e) => setCornerSmoothing(Number(e.target.value))}
              step={0.01}
              type="range"
              value={cornerSmoothing}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Create SquircleComparison component**

Create `apps/web/components/mdx/squircle-comparison.tsx` — shows border-radius vs squircle side by side.

```tsx
"use client";

import { Squircle } from "@squircle-js/react";
import { useState } from "react";

export const SquircleComparison = () => {
  const [cornerRadius, setCornerRadius] = useState(20);

  return (
    <div className="my-8 rounded-lg border border-border p-6">
      <div className="mb-4 flex justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-32 w-32 bg-foreground"
            style={{ borderRadius: cornerRadius }}
          />
          <span className="text-sm text-muted-foreground">border-radius</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Squircle
            className="h-32 w-32 bg-foreground"
            cornerRadius={cornerRadius}
            cornerSmoothing={1}
          />
          <span className="text-sm text-muted-foreground">squircle</span>
        </div>
      </div>
      <label className="block">
        <span className="mb-1 block text-center text-sm font-medium">
          Corner Radius: {cornerRadius}px
        </span>
        <input
          className="w-full"
          max={64}
          min={0}
          onChange={(e) => setCornerRadius(Number(e.target.value))}
          type="range"
          value={cornerRadius}
        />
      </label>
    </div>
  );
};
```

- [ ] **Step 4: Verify compilation**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/mdx/
git commit -m "feat: add MDX prose components and interactive squircle demos"
```

---

## Task 4: Blog Layout & Routes

**Files:**
- Create: `apps/web/app/blog/layout.tsx`
- Create: `apps/web/app/blog/page.tsx`
- Create: `apps/web/app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create blog layout**

Create `apps/web/app/blog/layout.tsx`:

```tsx
import { Footer } from "@/components/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-2xl px-6 py-16">
        {children}
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create blog index page**

Create `apps/web/app/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog - Squircle.js",
  description:
    "Articles about squircles, smooth corners, superellipses, and modern UI design.",
  alternates: { canonical: "https://squircle.js.org/blog" },
};

export default function BlogIndex() {
  const posts = getAllContent("blog");

  return (
    <>
      <h1 className="mb-8 font-bold text-3xl">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              className="group block"
              href={`/blog/${post.slug}`}
            >
              <h2 className="mb-1 font-semibold text-xl group-hover:text-blue-600">
                {post.title}
              </h2>
              <time className="mb-2 block text-sm text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <p className="text-muted-foreground">{post.description}</p>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: Create blog post page**

Create `apps/web/app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getAllContent, getContentBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllContent("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getContentBySlug("blog", slug);
    return {
      title: `${frontmatter.title} - Squircle.js`,
      description: frontmatter.description,
      keywords: frontmatter.keywords,
      alternates: {
        canonical: `https://squircle.js.org/blog/${slug}`,
      },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: "article",
        publishedTime: frontmatter.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = getContentBySlug("blog", slug);
  } catch {
    notFound();
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">{post.frontmatter.title}</h1>
        <time className="text-sm text-muted-foreground">
          {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <MDXRemote components={mdxComponents} source={post.content} />

      <div className="mt-12 border-t border-border pt-6">
        <Link
          className="text-blue-600 hover:text-blue-800"
          href="/blog"
        >
          Back to all posts
        </Link>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.frontmatter.title,
            description: post.frontmatter.description,
            datePublished: post.frontmatter.date,
            author: {
              "@type": "Person",
              name: "Antoni Silvestrovic",
            },
            publisher: {
              "@type": "Organization",
              name: "Squircle.js",
              url: "https://squircle.js.org",
            },
          }),
        }}
        type="application/ld+json"
      />
    </article>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/app/blog/
git commit -m "feat: add blog layout, index, and post pages"
```

---

## Task 5: Docs Layout & Routes

**Files:**
- Create: `apps/web/components/docs-sidebar.tsx`
- Create: `apps/web/app/docs/layout.tsx`
- Create: `apps/web/app/docs/[[...slug]]/page.tsx`

- [ ] **Step 1: Create docs sidebar**

Create `apps/web/components/docs-sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { DocsFrontmatter } from "@/lib/mdx";

export const DocsSidebar = ({ items }: { items: DocsFrontmatter[] }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        className="mb-4 block font-semibold text-lg"
        href="/docs"
      >
        Docs
      </Link>
      {items.map((item) => {
        const href = `/docs/${item.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-muted font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            href={href}
            key={item.slug}
            onClick={() => setIsOpen(false)}
          >
            {item.title}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="mb-4 flex items-center gap-2 text-sm font-medium md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{isOpen ? "Hide" : "Show"} menu</span>
      </button>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="mb-6 space-y-1 md:hidden">{navLinks}</nav>
      )}

      {/* Desktop sidebar */}
      <nav className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-8 space-y-1">{navLinks}</div>
      </nav>
    </>
  );
};
```

- [ ] **Step 2: Create docs layout**

Create `apps/web/app/docs/layout.tsx`:

```tsx
import { DocsSidebar } from "@/components/docs-sidebar";
import { Footer } from "@/components/footer";
import { getAllContent } from "@/lib/mdx";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsItems = getAllContent("docs");

  return (
    <>
      <div className="mx-auto flex max-w-4xl gap-8 px-6 py-16">
        <DocsSidebar items={docsItems} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Create docs page (catch-all route)**

Create `apps/web/app/docs/[[...slug]]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getAllContent, getContentBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const docs = getAllContent("docs");
  return [
    { slug: [] }, // /docs index
    ...docs.map((doc) => ({ slug: [doc.slug] })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const docSlug = slug?.[0] ?? "getting-started";

  try {
    const { frontmatter } = getContentBySlug("docs", docSlug);
    return {
      title: `${frontmatter.title} - Squircle.js Docs`,
      description: frontmatter.description,
      keywords: frontmatter.keywords,
      alternates: {
        canonical: slug
          ? `https://squircle.js.org/docs/${docSlug}`
          : "https://squircle.js.org/docs",
      },
    };
  } catch {
    return {};
  }
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const docSlug = slug?.[0] ?? "getting-started";

  let doc;
  try {
    doc = getContentBySlug("docs", docSlug);
  } catch {
    notFound();
  }

  return (
    <article>
      <h1 className="mb-6 font-bold text-3xl">{doc.frontmatter.title}</h1>
      <MDXRemote components={mdxComponents} source={doc.content} />

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: doc.frontmatter.title,
            description: doc.frontmatter.description,
            author: {
              "@type": "Organization",
              name: "Squircle.js",
              url: "https://squircle.js.org",
            },
          }),
        }}
        type="application/ld+json"
      />
    </article>
  );
}
```

- [ ] **Step 4: Verify compilation**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/components/docs-sidebar.tsx apps/web/app/docs/
git commit -m "feat: add docs layout with sidebar and catch-all route"
```

---

## Task 6: Blog Content - Articles

**Files:**
- Create: `apps/web/content/blog/what-is-a-squircle.mdx`
- Create: `apps/web/content/blog/squircle-vs-rounded-rectangle.mdx`
- Create: `apps/web/content/blog/squircles-in-apple-design.mdx`
- Create: `apps/web/content/blog/math-behind-squircles.mdx`
- Create: `apps/web/content/blog/squircles-in-web-design.mdx`
- Create: `apps/web/content/blog/figma-corner-smoothing-on-the-web.mdx`

Each file follows this frontmatter schema:

```yaml
---
title: "Article Title"
description: "Meta description for SEO"
date: "2026-03-23"
keywords: ["keyword1", "keyword2"]
slug: "url-slug"
---
```

- [ ] **Step 1: Create "What is a Squircle?"**

Write `apps/web/content/blog/what-is-a-squircle.mdx` with this frontmatter:

```yaml
---
title: "What is a Squircle?"
description: "A squircle is a shape between a square and a circle. Learn what squircles are, their history, the math behind them, and why they're used in modern UI design."
date: "2026-03-23"
keywords: ["squircle", "what is a squircle", "squircle shape", "squircle definition"]
slug: "what-is-a-squircle"
---
```

The primary SEO target article. Covers definition, visual explanation, Piet Hein history, why squircles look natural, real-world usage. Include `<SquircleComparison />` component. Approximately 800-1200 words. Keyword: "squircle" used naturally throughout, especially in headings.

- [ ] **Step 2: Create "Squircle vs Rounded Rectangle"**

Write `apps/web/content/blog/squircle-vs-rounded-rectangle.mdx` with this frontmatter:

```yaml
---
title: "Squircle vs Rounded Rectangle: What's the Difference?"
description: "Understand the visual and mathematical differences between squircles and rounded rectangles, including corner continuity and when to use each shape."
date: "2026-03-20"
keywords: ["squircle vs rounded rectangle", "smooth corners", "continuous corners", "corner continuity"]
slug: "squircle-vs-rounded-rectangle"
---
```

Explains G2 corner continuity, abrupt curvature transition in rounded rects, visual comparison, when to use each. Include `<SquircleComparison />`. Approximately 600-900 words.

- [ ] **Step 3: Create "How Apple Uses Squircles in iOS Design"**

Write `apps/web/content/blog/squircles-in-apple-design.mdx` with this frontmatter:

```yaml
---
title: "How Apple Uses Squircles in iOS Design"
description: "Discover how and why Apple adopted squircles for iOS app icons, hardware design, and UI elements, replacing traditional rounded rectangles."
date: "2026-03-17"
keywords: ["apple squircle", "ios squircle", "ios icon shape", "ios rounded corners", "apple corner smoothing"]
slug: "squircles-in-apple-design"
---
```

Apple's iOS 7 shift, why continuous corners, design philosophy, ecosystem usage. No interactive component needed. Approximately 600-900 words.

- [ ] **Step 4: Create "The Math Behind Squircles"**

Write `apps/web/content/blog/math-behind-squircles.mdx` with this frontmatter:

```yaml
---
title: "The Math Behind Squircles: Superellipses Explained"
description: "Learn the mathematical foundation of squircles, from Piet Hein's superellipse to Lame curves, and how the formula creates smooth corners."
date: "2026-03-14"
keywords: ["superellipse", "squircle formula", "squircle math", "lame curve", "piet hein superellipse"]
slug: "math-behind-squircles"
---
```

Piet Hein, Lame curves, superellipse formula, exponent values and their shapes. Include `<SquircleDemo />`. Approximately 600-900 words.

- [ ] **Step 5: Create "Squircles in Web Design"**

Write `apps/web/content/blog/squircles-in-web-design.mdx` with this frontmatter:

```yaml
---
title: "Squircles in Web Design: Why and How"
description: "Why CSS border-radius can't create squircles, the approaches to implementing smooth corners on the web, and how squircle-js solves the problem."
date: "2026-03-11"
keywords: ["squircle css", "squircle web", "smooth corners css", "corner smoothing css", "css superellipse"]
slug: "squircles-in-web-design"
---
```

CSS border-radius limitations, native vs web gap, implementation approaches (SVG clip-path, Houdini, superellipse() proposal), how squircle-js solves it. Include `<SquircleComparison />`. Approximately 600-900 words.

- [ ] **Step 6: Create "Figma Corner Smoothing on the Web"**

Write `apps/web/content/blog/figma-corner-smoothing-on-the-web.mdx` with this frontmatter:

```yaml
---
title: "Figma Corner Smoothing on the Web"
description: "Bridge the gap between Figma's corner smoothing and web development. Learn how squircle-js uses the same algorithm to match Figma designs."
date: "2026-03-08"
keywords: ["figma corner smoothing", "figma smooth corners", "figma squircle", "corner smoothing css"]
slug: "figma-corner-smoothing-on-the-web"
---
```

Figma's feature, design-to-dev gap, figma-squircle algorithm, matching Figma output. Include `<SquircleDemo />`. Approximately 600-900 words.

- [ ] **Step 7: Commit**

```bash
git add apps/web/content/blog/
git commit -m "feat: add blog content - 6 SEO-targeted articles about squircles"
```

---

## Task 7: Docs Content

**Files:**
- Create: `apps/web/content/docs/getting-started.mdx`
- Create: `apps/web/content/docs/squircle-component.mdx`
- Create: `apps/web/content/docs/static-squircle.mdx`
- Create: `apps/web/content/docs/as-child.mdx`
- Create: `apps/web/content/docs/corner-smoothing.mdx`
- Create: `apps/web/content/docs/no-javascript-fallback.mdx`
- Create: `apps/web/content/docs/examples.mdx`

Each file uses this frontmatter schema:

```yaml
---
title: "Page Title"
description: "Meta description"
keywords: ["keyword1", "keyword2"]
slug: "url-slug"
order: 1
---
```

Reference the actual component API from `packages/squircle-element-react/src/index.tsx`:

**Squircle props:** `cornerSmoothing` (default 0.6), `cornerRadius`, `asChild`, `width`, `height`, `defaultWidth`, `defaultHeight`, plus all div props.

**StaticSquircle props:** `width` (required), `height` (required), `cornerRadius` (required), `cornerSmoothing` (required), `asChild`, plus all div props.

**SquircleNoScript:** No props. Renders a `<noscript>` style tag that falls back to `border-radius`.

- [ ] **Step 1: Create "Getting Started"** (order: 1)

Write `apps/web/content/docs/getting-started.mdx` with frontmatter:

```yaml
---
title: "Getting Started"
description: "Install and start using @squircle-js/react to add iOS-style squircle shapes to your React project."
keywords: ["squircle-js", "squircle react", "install squircle", "squircle component"]
slug: "getting-started"
order: 1
---
```

Installation via npm/pnpm/yarn, basic usage example, minimal working component.

- [ ] **Step 2: Create "Squircle Component"** (order: 2)

Write `apps/web/content/docs/squircle-component.mdx` with frontmatter:

```yaml
---
title: "Squircle Component"
description: "API reference for the Squircle component — a responsive squircle element that automatically adapts to its size."
keywords: ["squircle component", "squircle react component", "squircle api"]
slug: "squircle-component"
order: 2
---
```

Full API reference with props table, how ResizeObserver works internally, usage examples.

- [ ] **Step 3: Create "StaticSquircle Component"** (order: 3)

Write `apps/web/content/docs/static-squircle.mdx` with frontmatter:

```yaml
---
title: "StaticSquircle Component"
description: "API reference for StaticSquircle — a performant squircle component for elements with known dimensions."
keywords: ["static squircle", "squircle performance", "squircle fixed size"]
slug: "static-squircle"
order: 3
---
```

When to use it, performance benefits, props table, examples.

- [ ] **Step 4: Create "The asChild Pattern"** (order: 4)

Write `apps/web/content/docs/as-child.mdx` with frontmatter:

```yaml
---
title: "The asChild Pattern"
description: "Learn how to use the asChild prop to compose Squircle with any HTML element or React component using the Radix UI Slot pattern."
keywords: ["squircle asChild", "radix slot", "squircle composition"]
slug: "as-child"
order: 4
---
```

Radix Slot pattern explanation, composition examples with buttons/links/images.

- [ ] **Step 5: Create "Corner Smoothing Explained"** (order: 5)

Write `apps/web/content/docs/corner-smoothing.mdx` with frontmatter:

```yaml
---
title: "Corner Smoothing Explained"
description: "Understand what cornerSmoothing values mean, from 0 (standard border-radius) to 0.6 (iOS-like) to 1 (maximum smoothing)."
keywords: ["corner smoothing", "squircle smoothing", "ios corner smoothing", "cornerSmoothing"]
slug: "corner-smoothing"
order: 5
---
```

What values mean (0 = regular, 0.6 = iOS, 1 = max), visual guide, recommendations. Include `<SquircleDemo />`.

- [ ] **Step 6: Create "No-JavaScript Fallback"** (order: 6)

Write `apps/web/content/docs/no-javascript-fallback.mdx` with frontmatter:

```yaml
---
title: "No-JavaScript Fallback"
description: "How SquircleNoScript provides graceful degradation when JavaScript is disabled, using CSS border-radius as a fallback."
keywords: ["squircle noscript", "squircle ssr", "squircle fallback", "no javascript"]
slug: "no-javascript-fallback"
order: 6
---
```

How SquircleNoScript works (data-squircle attribute + CSS fallback), SSR considerations, setup.

- [ ] **Step 7: Create "Examples & Recipes"** (order: 7)

Write `apps/web/content/docs/examples.mdx` with frontmatter:

```yaml
---
title: "Examples & Recipes"
description: "Common patterns and recipes for using squircle-js: buttons, cards, avatars, image containers, and more."
keywords: ["squircle examples", "squircle button", "squircle card", "squircle avatar"]
slug: "examples"
order: 7
---
```

Buttons, cards, avatars, image containers with code snippets for each.

- [ ] **Step 8: Commit**

```bash
git add apps/web/content/docs/
git commit -m "feat: add docs content - 7 documentation pages"
```

---

## Task 8: Footer Component & Homepage Integration

**Files:**
- Create: `apps/web/components/footer.tsx`
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Create footer component**

Create `apps/web/components/footer.tsx`:

```tsx
import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const Footer = () => {
  const blogPosts = getAllContent("blog");
  const docPages = getAllContent("docs");

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Blog
            </h3>
            <ul className="space-y-2">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Docs
            </h3>
            <ul className="space-y-2">
              {docPages.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href={`/docs/${doc.slug}`}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 2: Add footer to homepage**

In `apps/web/app/page.tsx`, add the Footer import and render it after `<LinksSection />`:

```tsx
// Add import:
import { Footer } from "@/components/footer";

// Add after <LinksSection />:
<Footer />
```

- [ ] **Step 3: Verify the homepage renders**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm build
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/footer.tsx apps/web/app/page.tsx
git commit -m "feat: add footer with blog and docs links to homepage"
```

---

## Task 9: Sitemap & SEO Enhancements

**Files:**
- Modify: `apps/web/app/sitemap.ts`

- [ ] **Step 1: Update sitemap to include all content pages**

Replace `apps/web/app/sitemap.ts`:

```typescript
import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllContent("blog");
  const docPages = getAllContent("docs");

  return [
    {
      url: "https://squircle.js.org/",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://squircle.js.org/blog",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `https://squircle.js.org/blog/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.7,
    })),
    {
      url: "https://squircle.js.org/docs",
      lastModified: new Date(),
      priority: 0.8,
    },
    ...docPages.map((doc) => ({
      url: `https://squircle.js.org/docs/${doc.slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
  ];
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm build
```

Expected: Build succeeds with all blog and docs pages statically generated.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/sitemap.ts
git commit -m "feat: update sitemap to include blog and docs pages"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full build**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm build
```

Verify all pages are generated in the build output.

- [ ] **Step 2: Run linting and formatting**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm check
```

Fix any issues with `pnpm fix`.

- [ ] **Step 3: Run typecheck**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm typecheck
```

- [ ] **Step 4: Manual smoke test**

```bash
cd /Users/antoni/Projects/squircle-js && pnpm dev
```

Check in browser:
- Homepage footer shows blog and docs links
- `/blog` shows all 6 posts
- Each blog post renders with prose styling and interactive components
- `/docs` shows Getting Started content with sidebar
- Each docs page renders correctly
- Sidebar highlights active page
- `/sitemap.xml` includes all pages

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address linting and formatting issues"
```
