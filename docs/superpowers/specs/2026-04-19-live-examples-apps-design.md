# Live Examples Apps — Design

**Date:** 2026-04-19

## Goal

Replace the static code-only examples on `/docs/vue-examples`, `/docs/svelte-examples`, and `/docs/solid-examples` with live iframe demos embedded alongside each code block. Readers see the example actually running before they see its source.

React examples already work inline on the landing page and `/docs/examples` (since `apps/web` is a Next.js/React app) and stay as-is.

## Scope

### In scope

- Three new workspace apps:
  - `apps/examples-vue` — `@squircle-js/examples-vue` (private)
  - `apps/examples-svelte` — `@squircle-js/examples-svelte` (private)
  - `apps/examples-solid` — `@squircle-js/examples-solid` (private)
- Multi-page Vite build in each app (one HTML entry per example, no router)
- Shared `<LiveExample framework="…" example="…" height={…} />` MDX component in `apps/web`
- Update `vue-examples.mdx`, `svelte-examples.mdx`, `solid-examples.mdx` to embed iframes above each existing code block
- Initial example set — every example currently present in the three `*-examples.mdx` pages:
  - Common (all three): button, card, avatar, image-container, app-icon, notification-badge, icon-button, reactive-squircle, list-of-squircles
  - Vue + Svelte: transitions
  - Solid only: motion-card
- Vercel deployment instructions (three new projects, created manually in the Vercel dashboard)

### Out of scope

- React examples (stay inline, no regression)
- Other docs pages (getting-started, squircle-component, composable, directive, static-squircle, corner-smoothing, no-javascript-fallback) — keep static code
- Live editing / Sandpack-style interactivity
- Custom subdomains (`examples-vue.squircle.js.org`) — defer to post-merge Vercel dashboard work
- Changesets — these apps are private, never published
- Automated visual regression tests — manual spot-check sufficient for v1
- Shared example assets workspace — duplicate small images (avatars, hero images) in each app's `public/` dir; revisit only if list grows
- Preview-URL wiring between `apps/web` docs previews and demo-app previews — v1 uses production URLs from both environments

## Architecture

### Repository structure

Each new app has the same shape:

```
apps/examples-{framework}/
├── package.json              # "@squircle-js/examples-{framework}", private
├── tsconfig.json             # extends @squircle-js/tsconfig/base
├── vite.config.ts            # multi-page build, one input per example
├── index.html                # dev-only listing page linking to all examples
├── button.html               # one HTML per example, loads src/pages/button.ts
├── card.html
├── … (one per example)
├── src/
│   ├── styles.css            # Tailwind import + transparent body + flex-center
│   ├── pages/
│   │   ├── button.ts         # entry: mount example component into #app
│   │   └── … (one per example)
│   └── examples/
│       ├── Button.{vue,svelte,tsx}   # the example component itself
│       └── … (one per example)
└── public/
    └── (shared images: avatar.jpg, hero.jpg, etc.)
```

**Per-app dependencies:**
- `@squircle-js/{framework}` as `workspace:*`
- Framework runtime (`vue`, `svelte`, or `solid-js`)
- Vite + framework plugin (`@vitejs/plugin-vue`, `@sveltejs/vite-plugin-svelte`, `vite-plugin-solid`)
- `tailwindcss` + `@tailwindcss/vite` (v4) — matches docs and existing packages

### Multi-page Vite build

**`vite.config.ts`** (Vue shown; Svelte/Solid analogous):

```ts
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

const examples = [
  "button", "card", "avatar", "image-container", "app-icon",
  "notification-badge", "icon-button", "reactive-squircle",
  "list-of-squircles", "transitions",
];

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries([
        ["index", resolve(import.meta.dirname, "index.html")],
        ...examples.map((name) => [
          name,
          resolve(import.meta.dirname, `${name}.html`),
        ]),
      ]),
    },
  },
});
```

Rollup emits one `dist/{name}.html` per example, with shared chunks (framework runtime, Tailwind CSS) deduplicated across entries.

**Per-example HTML file** (`button.html`):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>button · @squircle-js/vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/pages/button.ts"></script>
  </body>
</html>
```

**Per-example entry** (`src/pages/button.ts`):

```ts
import { createApp } from "vue";
import "../styles.css";
import Button from "../examples/Button.vue";

createApp(Button).mount("#app");
```

**Shared CSS** (`src/styles.css`):

```css
@import "tailwindcss";

html, body {
  height: 100%;
  margin: 0;
  background: transparent;
}

#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
```

Transparent body lets the iframe blend with either light or dark docs backgrounds. Flex-center keeps each example visually balanced within its iframe at any height.

**Example components** are lifted verbatim from the existing `*-examples.mdx` code blocks — no wrapping, no extra styling, so the live iframe matches the source that appears right below it.

**Turbo wiring:** `apps/examples-vue` depends on `@squircle-js/vue` (workspace). Turbo's default `dependsOn: ["^build"]` ensures the framework package builds first. No extra `turbo.json` config needed.

### `<LiveExample>` MDX component

**API:**

```ts
type Framework = "vue" | "svelte" | "solid";

type LiveExampleProps = {
  framework: Framework;
  example: string;        // e.g. "button"; must match the HTML file name
  height: number;         // px; required, author picks per example
  title?: string;         // optional caption
};
```

`height` is required — authors pick per example to prevent layout shift during lazy iframe load. No postMessage-based auto-sizing.

**Rendered output:**

```tsx
<figure className="my-6 overflow-hidden rounded-xl border border-border bg-muted/30">
  <iframe
    src={`${BASE_URLS[framework]}/${example}.html`}
    title={title ?? `${framework} ${example} example`}
    height={height}
    width="100%"
    loading="lazy"
    sandbox="allow-scripts"
    referrerPolicy="no-referrer"
    className="block w-full border-0"
  />
  {title && (
    <figcaption className="px-3 py-2 text-xs text-muted-foreground">
      {title}
    </figcaption>
  )}
</figure>
```

- `loading="lazy"` — critical, docs pages embed 9+ iframes each
- `sandbox="allow-scripts"` — demo JS runs; form submission, top-nav, popups blocked
- Rounded border + subtle muted bg — matches docs code-block styling

**URL resolution:**

```ts
const BASE_URLS: Record<Framework, string> = {
  vue: process.env.NEXT_PUBLIC_EXAMPLES_VUE_URL
    ?? "https://squircle-examples-vue.vercel.app",
  svelte: process.env.NEXT_PUBLIC_EXAMPLES_SVELTE_URL
    ?? "https://squircle-examples-svelte.vercel.app",
  solid: process.env.NEXT_PUBLIC_EXAMPLES_SOLID_URL
    ?? "https://squircle-examples-solid.vercel.app",
};
```

Env vars let you swap to custom subdomains without touching code. The hardcoded fallbacks match the default Vercel URLs that the three projects (named `squircle-examples-vue/svelte/solid`) will receive.

**Wiring:** register in the MDX component map in `apps/web/lib/mdx.ts` alongside existing custom components. One-line addition.

**Usage in MDX:**

```mdx
<LiveExample framework="vue" example="button" height={80} />

```vue
<script setup lang="ts">
...
</script>
```
```

Iframe renders above each code block so the live result is the first thing the reader sees.

### Vercel deployment

Three new Vercel projects, all pointing at the same GitHub repo, each with a different **Root Directory**. Created manually in the Vercel dashboard (one-time setup).

**Per-project settings** (identical pattern for each framework):

| Setting | Value |
|---|---|
| Project name | `squircle-examples-{framework}` |
| Framework preset | Vite |
| Root Directory | `apps/examples-{framework}` |
| Build command | `cd ../.. && pnpm --filter @squircle-js/examples-{framework} build` |
| Output Directory | `dist` |
| Install command | `cd ../.. && pnpm install --frozen-lockfile` |
| Node version | 20.x (default) |

**Ignored Build Step** (per project):

```bash
git diff HEAD^ HEAD --quiet ./ ../../packages/{framework} ../../packages/figma-squircle 2>/dev/null
```

Skips the build if nothing under the demo app or its framework package changed. Prevents all four Vercel projects from rebuilding on every PR.

**`apps/web` env vars** (set after the three projects are deployed):

```
NEXT_PUBLIC_EXAMPLES_VUE_URL=https://squircle-examples-vue.vercel.app
NEXT_PUBLIC_EXAMPLES_SVELTE_URL=https://squircle-examples-svelte.vercel.app
NEXT_PUBLIC_EXAMPLES_SOLID_URL=https://squircle-examples-solid.vercel.app
```

Optional — the hardcoded fallbacks in `<LiveExample>` match these URLs, so env vars are only needed if Vercel assigns different slugs (typically happens when the name is taken).

## Rollout

Single PR ships everything. Splitting demo apps from docs updates is churn — apps alone are dead weight until iframes reference them.

**Implementation order** (validates each layer before moving on):

1. Vue app end-to-end: scaffold `apps/examples-vue`, all ~10 example pages, `pnpm build` + `pnpm dev` work, visual spot-check in browser
2. `<LiveExample>` MDX component in `apps/web`, register in MDX map
3. Update `vue-examples.mdx` — embed iframes above each code block, verify in docs dev server using `NEXT_PUBLIC_EXAMPLES_VUE_URL=http://localhost:5173`
4. Svelte app — mirror Vue structure, same 10 examples
5. Solid app — mirror, plus `motion-card` example
6. Update `svelte-examples.mdx` and `solid-examples.mdx` with `<LiveExample>` blocks
7. Full validation: `pnpm build`, `pnpm typecheck`, `pnpm check`, manual spot-check of each framework's examples page

**Sequencing with Vercel:**

1. Merge PR with hardcoded fallback URLs — merge does not require Vercel to exist yet; iframes 404 until deployed, but code is correct
2. Create three Vercel projects per the settings above. Once live, iframes resolve. If Vercel slugs differ from fallbacks, set the three `NEXT_PUBLIC_EXAMPLES_*_URL` env vars on `apps/web` project

**Verification checklist (PR-gating):**
- Each demo app builds: `pnpm --filter @squircle-js/examples-{framework} build`
- Each demo app typechecks: `pnpm --filter @squircle-js/examples-{framework} typecheck`
- Monorepo `pnpm build` succeeds
- `pnpm check` succeeds
- Each demo app's `pnpm dev` serves example routes correctly
- Docs dev server with overridden `NEXT_PUBLIC_EXAMPLES_*_URL` shows iframes loading from local Vite

**Known risks:**
- **First-iframe cold start**: 9 iframes per page. Lazy-loading mitigates (only visible iframes load); first-in-viewport still pulls the shared framework-runtime chunk. Acceptable for v1
- **Tailwind v4 in three apps**: adds ~3 near-identical Tailwind setups. If maintenance becomes friction, factor into `tooling/tailwind-examples/`. Not worth pre-factoring now

## Success criteria

- All 10 Vue examples, 10 Svelte examples, and 10 Solid examples (with variants as noted) render correctly in production-deployed demo apps
- `/docs/vue-examples`, `/docs/svelte-examples`, `/docs/solid-examples` show a live iframe above each existing code block
- `pnpm build`, `pnpm check`, `pnpm typecheck` all pass on main
- Lazy-load keeps initial page load cost to a single-iframe first paint
