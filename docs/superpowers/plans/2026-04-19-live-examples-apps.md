# Live Examples Apps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add live iframe demos to the `/docs/vue-examples`, `/docs/svelte-examples`, and `/docs/solid-examples` pages by building three private Vite-powered demo apps (`apps/examples-{vue,svelte,solid}`) and a new `<LiveExample>` MDX component that embeds one iframe per example.

**Architecture:** Three new workspace apps, each a multi-page Vite build (one HTML entry per example, no router). Each app consumes `@squircle-js/{framework}` via `workspace:*`, ships the 10 examples already documented in the three `*-examples.mdx` pages, and deploys as its own Vercel project. `apps/web` gains a single `<LiveExample>` React component that renders a lazy-loaded `<iframe>` with a `sandbox="allow-scripts"` attribute; the iframe `src` is built from a per-framework base URL (env-var driven, with a production fallback) plus the example slug.

**Tech Stack:** Vite 5, Tailwind CSS 4 (`@tailwindcss/vite`), Vue 3 + `@vitejs/plugin-vue`, Svelte 5 + `@sveltejs/vite-plugin-svelte`, Solid 1.9 + `vite-plugin-solid`, TypeScript, Next.js 15 (existing `apps/web` for the MDX component).

---

## File Structure

**New files — Vue demo app (`apps/examples-vue/`):**

- `package.json` — `@squircle-js/examples-vue` (private), scripts, deps
- `tsconfig.json` — extends `@squircle-js/tsconfig/base.json`, adds DOM lib
- `vite.config.ts` — multi-page build, one input per example
- `.gitignore` — `node_modules`, `dist`, `.turbo`
- `index.html` — dev-only listing page linking to each example
- `button.html`, `card.html`, `avatar.html`, `image-container.html`, `app-icon.html`, `notification-badge.html`, `icon-button.html`, `reactive-squircle.html`, `list-of-squircles.html`, `transitions.html` (10 per-example HTML entries)
- `src/styles.css` — Tailwind v4 import + transparent body + flex-center `#app`
- `src/pages/{example}.ts` — one entry per example, mounts example component (10 files)
- `src/examples/Button.vue`, `Card.vue`, `Avatar.vue`, `ImageContainer.vue`, `AppIcon.vue`, `NotificationBadge.vue`, `IconButton.vue`, `ReactiveSquircle.vue`, `ListOfSquircles.vue`, `Transitions.vue` (10 component files, each lifted verbatim from `apps/web/content/docs/vue-examples.mdx`)

**New files — Svelte demo app (`apps/examples-svelte/`):** same structure as Vue with these replacements:
- `svelte.config.js` (replaces `@vitejs/plugin-vue` wiring)
- `src/examples/{Name}.svelte` (10 files)
- `src/pages/{name}.svelte` (10 thin wrappers that instantiate the example with concrete props)
- `src/pages/{name}.ts` (10 mount scripts; import the `.svelte` wrapper)
- 10 HTML entries for: button, card, avatar, image-container, app-icon, notification-badge, icon-button, reactive-squircle, list-of-squircles, transitions

**New files — Solid demo app (`apps/examples-solid/`):** same structure as Vue with:
- `src/examples/{Name}.tsx` (10 files, each lifted from `apps/web/content/docs/solid-examples.mdx`)
- `src/pages/{name}.tsx` (10 entries that instantiate with concrete props using JSX)
- 10 HTML entries for: button, card, avatar, image-container, app-icon, notification-badge, motion-card, icon-button, reactive-squircle, list-of-squircles (note: `motion-card` replaces `transitions`)

**New files — `apps/web/` additions:**
- `apps/web/components/mdx/live-example.tsx` — the `<LiveExample>` component
- `apps/web/.env.example` — documents `NEXT_PUBLIC_EXAMPLES_*_URL` env vars

**New file — deployment doc:**
- `docs/live-examples-deployment.md` — exact Vercel project settings

**Modified files:**
- `apps/web/components/mdx/mdx-components.tsx` — register `LiveExample` in the component map
- `apps/web/content/docs/vue-examples.mdx` — add a `<LiveExample framework="vue" example="..." height={...} />` above each of the 10 code blocks
- `apps/web/content/docs/svelte-examples.mdx` — same, `framework="svelte"`
- `apps/web/content/docs/solid-examples.mdx` — same, `framework="solid"`

**Assets:** For the live demos, all image sources are external placeholder URLs (`https://picsum.photos/...` for hero/app-icon images and `https://i.pravatar.cc/...` for avatars). No binary assets are committed. The iframe `sandbox="allow-scripts"` attribute allows cross-origin image loads without `allow-same-origin`.

---

## Task 1: Scaffold `apps/examples-vue` shell

**Files:**
- Create: `apps/examples-vue/package.json`
- Create: `apps/examples-vue/tsconfig.json`
- Create: `apps/examples-vue/vite.config.ts`
- Create: `apps/examples-vue/.gitignore`
- Create: `apps/examples-vue/src/styles.css`
- Create: `apps/examples-vue/index.html`

- [ ] **Step 1: Create `apps/examples-vue/package.json`**

```json
{
  "name": "@squircle-js/examples-vue",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "clean": "rm -rf .turbo dist node_modules",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": {
    "@squircle-js/vue": "workspace:*",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@squircle-js/tsconfig": "workspace:*",
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "^20.17.22",
    "@vitejs/plugin-vue": "^5.2.0",
    "tailwindcss": "^4.0.0",
    "typescript": "catalog:",
    "vite": "^5.4.0",
    "vue-tsc": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `apps/examples-vue/tsconfig.json`**

```json
{
  "extends": "@squircle-js/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": ".",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/examples-vue/vite.config.ts`**

```ts
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const examples = [
  "button",
  "card",
  "avatar",
  "image-container",
  "app-icon",
  "notification-badge",
  "icon-button",
  "reactive-squircle",
  "list-of-squircles",
  "transitions",
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

- [ ] **Step 4: Create `apps/examples-vue/.gitignore`**

```
node_modules
dist
.turbo
.DS_Store
```

- [ ] **Step 5: Create `apps/examples-vue/src/styles.css`**

```css
@import "tailwindcss";

html,
body {
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

- [ ] **Step 6: Create `apps/examples-vue/index.html` (dev listing)**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Examples · @squircle-js/vue</title>
    <style>
      body {
        font-family: ui-sans-serif, system-ui, sans-serif;
        padding: 2rem;
        max-width: 40rem;
        margin: 0 auto;
      }
      a {
        color: #2563eb;
      }
      li {
        padding: 0.25rem 0;
      }
    </style>
  </head>
  <body>
    <h1>Examples · @squircle-js/vue</h1>
    <p>
      Each page mounts one example from
      <code>src/examples/</code>. These pages are embedded into the public docs
      via iframes.
    </p>
    <ul>
      <li><a href="/button.html">button</a></li>
      <li><a href="/card.html">card</a></li>
      <li><a href="/avatar.html">avatar</a></li>
      <li><a href="/image-container.html">image-container</a></li>
      <li><a href="/app-icon.html">app-icon</a></li>
      <li><a href="/notification-badge.html">notification-badge</a></li>
      <li><a href="/icon-button.html">icon-button</a></li>
      <li><a href="/reactive-squircle.html">reactive-squircle</a></li>
      <li><a href="/list-of-squircles.html">list-of-squircles</a></li>
      <li><a href="/transitions.html">transitions</a></li>
    </ul>
  </body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add apps/examples-vue
git commit -m "chore: scaffold @squircle-js/examples-vue app shell"
```

---

## Task 2: Add Vue example components, entries, and HTML pages

**Files:**
- Create: `apps/examples-vue/src/examples/{Name}.vue` × 10
- Create: `apps/examples-vue/src/pages/{name}.ts` × 10
- Create: `apps/examples-vue/{name}.html` × 10

The 10 example components are lifted verbatim from the code blocks in
`apps/web/content/docs/vue-examples.mdx`. Each `src/pages/{name}.ts` mounts its
component with concrete prop values (the page wrapper is not shown to readers
— they only see the component source in the MDX code block).

- [ ] **Step 1: Create the 10 `.vue` component files**

Copy the contents of each code block from `apps/web/content/docs/vue-examples.mdx` (the section bodies, i.e. everything between the triple-backtick `vue` fence markers) into:

| MDX section | Destination |
|---|---|
| `## Button` | `apps/examples-vue/src/examples/Button.vue` |
| `## Card` | `apps/examples-vue/src/examples/Card.vue` |
| `## Avatar` | `apps/examples-vue/src/examples/Avatar.vue` |
| `## Image container` | `apps/examples-vue/src/examples/ImageContainer.vue` |
| `## App icon` | `apps/examples-vue/src/examples/AppIcon.vue` |
| `## Notification badge` | `apps/examples-vue/src/examples/NotificationBadge.vue` |
| `## Icon button` | `apps/examples-vue/src/examples/IconButton.vue` |
| `## Reactive squircle` | `apps/examples-vue/src/examples/ReactiveSquircle.vue` |
| `## List of squircles` | `apps/examples-vue/src/examples/ListOfSquircles.vue` |
| `## Composition with transitions` | `apps/examples-vue/src/examples/Transitions.vue` |

- [ ] **Step 2: Create the 10 per-example entry files under `src/pages/`**

Each entry imports its example component, mounts it to `#app`, and imports the shared styles. Use `h()` to pass concrete props where needed.

`apps/examples-vue/src/pages/button.ts`:

```ts
import { createApp, h } from "vue";
import Button from "../examples/Button.vue";
import "../styles.css";

createApp({
  render: () => h(Button, { onClick: () => {} }, () => "Press me"),
}).mount("#app");
```

`apps/examples-vue/src/pages/card.ts`:

```ts
import { createApp, h } from "vue";
import Card from "../examples/Card.vue";
import "../styles.css";

createApp({
  render: () =>
    h(Card, {
      title: "Smooth corners",
      body: "A responsive card clipped with a squircle — the shape adapts to any content width.",
    }),
}).mount("#app");
```

`apps/examples-vue/src/pages/avatar.ts`:

```ts
import { createApp, h } from "vue";
import Avatar from "../examples/Avatar.vue";
import "../styles.css";

createApp({
  render: () =>
    h(Avatar, {
      src: "https://i.pravatar.cc/96?img=5",
      alt: "Avatar",
      size: 96,
    }),
}).mount("#app");
```

`apps/examples-vue/src/pages/image-container.ts`:

```ts
import { createApp, h } from "vue";
import ImageContainer from "../examples/ImageContainer.vue";
import "../styles.css";

createApp({
  render: () =>
    h(ImageContainer, {
      src: "https://picsum.photos/seed/squircle-hero/600/400",
      alt: "Hero image",
    }),
}).mount("#app");
```

`apps/examples-vue/src/pages/app-icon.ts`:

```ts
import { createApp, h } from "vue";
import AppIcon from "../examples/AppIcon.vue";
import "../styles.css";

createApp({
  render: () =>
    h("div", { class: "flex gap-6" }, [
      h(AppIcon, {
        src: "https://picsum.photos/seed/icon-1/120/120",
        name: "Photos",
      }),
      h(AppIcon, {
        src: "https://picsum.photos/seed/icon-2/120/120",
        name: "Notes",
      }),
      h(AppIcon, {
        src: "https://picsum.photos/seed/icon-3/120/120",
        name: "Weather",
      }),
    ]),
}).mount("#app");
```

`apps/examples-vue/src/pages/notification-badge.ts`:

```ts
import { createApp, h } from "vue";
import NotificationBadge from "../examples/NotificationBadge.vue";
import "../styles.css";

createApp({
  render: () => h(NotificationBadge, { count: 7 }),
}).mount("#app");
```

`apps/examples-vue/src/pages/icon-button.ts`:

```ts
import { createApp, h } from "vue";
import IconButton from "../examples/IconButton.vue";
import "../styles.css";

createApp({
  render: () =>
    h(
      IconButton,
      { label: "Search", onClick: () => {} },
      () =>
        h(
          "svg",
          {
            width: 18,
            height: 18,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": 2,
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          },
          [
            h("circle", { cx: 11, cy: 11, r: 8 }),
            h("path", { d: "m21 21-4.3-4.3" }),
          ]
        )
    ),
}).mount("#app");
```

`apps/examples-vue/src/pages/reactive-squircle.ts`:

```ts
import { createApp } from "vue";
import ReactiveSquircle from "../examples/ReactiveSquircle.vue";
import "../styles.css";

createApp(ReactiveSquircle).mount("#app");
```

`apps/examples-vue/src/pages/list-of-squircles.ts`:

```ts
import { createApp, h } from "vue";
import ListOfSquircles from "../examples/ListOfSquircles.vue";
import "../styles.css";

const tags = [
  { id: "1", label: "Design" },
  { id: "2", label: "Vue" },
  { id: "3", label: "Squircle" },
  { id: "4", label: "iOS" },
  { id: "5", label: "Smooth" },
];

createApp({
  render: () => h(ListOfSquircles, { tags }),
}).mount("#app");
```

`apps/examples-vue/src/pages/transitions.ts` — `Transitions.vue` has a self-contained script (`const visible = ref(true)`), so the page just mounts it:

```ts
import { createApp } from "vue";
import Transitions from "../examples/Transitions.vue";
import "../styles.css";

createApp(Transitions).mount("#app");
```

- [ ] **Step 3: Create the 10 per-example HTML files**

Each HTML file is identical except for the title and the script src. Template:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{example} · @squircle-js/vue</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/pages/{example}.ts"></script>
  </body>
</html>
```

Create these 10 files (substituting `{example}` in each):

- `apps/examples-vue/button.html`
- `apps/examples-vue/card.html`
- `apps/examples-vue/avatar.html`
- `apps/examples-vue/image-container.html`
- `apps/examples-vue/app-icon.html`
- `apps/examples-vue/notification-badge.html`
- `apps/examples-vue/icon-button.html`
- `apps/examples-vue/reactive-squircle.html`
- `apps/examples-vue/list-of-squircles.html`
- `apps/examples-vue/transitions.html`

- [ ] **Step 4: Commit**

```bash
git add apps/examples-vue
git commit -m "feat(examples-vue): add 10 example pages"
```

---

## Task 3: Install deps and verify Vue demo app

- [ ] **Step 1: Install workspace deps**

Run: `pnpm install`
Expected: resolves new deps for `apps/examples-vue` without errors; generates lockfile update.

- [ ] **Step 2: Build the Vue framework package (prerequisite)**

Run: `pnpm --filter @squircle-js/vue build`
Expected: `packages/vue/dist/index.mjs` + `index.js` + `index.d.ts` emitted.

- [ ] **Step 3: Typecheck the demo app**

Run: `pnpm --filter @squircle-js/examples-vue typecheck`
Expected: no errors.

- [ ] **Step 4: Build the demo app**

Run: `pnpm --filter @squircle-js/examples-vue build`
Expected: `apps/examples-vue/dist/` contains `index.html` + 10 `{name}.html` files + hashed assets in `assets/`.

- [ ] **Step 5: Clean up any orphaned build workers**

Run: `pkill -9 -f "jest-worker/processChild" || true`
Expected: silent exit.

- [ ] **Step 6: Spot-check in dev server**

Run: `pnpm --filter @squircle-js/examples-vue dev`
Expected: Vite prints `Local: http://localhost:5173/`. Open it in a browser, verify the listing page. Click `button` — the page should show a centred indigo button. Click each link in turn; every example should render its squircle visually without console errors. Stop the dev server (Ctrl-C) when done.

- [ ] **Step 7: Commit any fixes made during spot-check**

If any example was broken, fix it, then:

```bash
git add apps/examples-vue
git commit -m "fix(examples-vue): resolve issues found during spot-check"
```

Otherwise skip this step.

---

## Task 4: Scaffold `apps/examples-svelte` shell

**Files:**
- Create: `apps/examples-svelte/package.json`
- Create: `apps/examples-svelte/tsconfig.json`
- Create: `apps/examples-svelte/svelte.config.js`
- Create: `apps/examples-svelte/vite.config.ts`
- Create: `apps/examples-svelte/.gitignore`
- Create: `apps/examples-svelte/src/styles.css`
- Create: `apps/examples-svelte/index.html`

- [ ] **Step 1: Create `apps/examples-svelte/package.json`**

```json
{
  "name": "@squircle-js/examples-svelte",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "clean": "rm -rf .turbo dist node_modules",
    "typecheck": "svelte-check --tsconfig ./tsconfig.json"
  },
  "dependencies": {
    "@squircle-js/svelte": "workspace:*",
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "@squircle-js/tsconfig": "workspace:*",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "^20.17.22",
    "svelte-check": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "catalog:",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `apps/examples-svelte/tsconfig.json`**

```json
{
  "extends": "@squircle-js/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": ".",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "bundler",
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.svelte", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/examples-svelte/svelte.config.js`**

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
};
```

- [ ] **Step 4: Create `apps/examples-svelte/vite.config.ts`**

```ts
import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const examples = [
  "button",
  "card",
  "avatar",
  "image-container",
  "app-icon",
  "notification-badge",
  "icon-button",
  "reactive-squircle",
  "list-of-squircles",
  "transitions",
];

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
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

- [ ] **Step 5: Create `apps/examples-svelte/.gitignore`**

```
node_modules
dist
.turbo
.DS_Store
```

- [ ] **Step 6: Create `apps/examples-svelte/src/styles.css`**

```css
@import "tailwindcss";

html,
body {
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

- [ ] **Step 7: Create `apps/examples-svelte/index.html`** (same template as Vue, title reads `@squircle-js/svelte`)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Examples · @squircle-js/svelte</title>
    <style>
      body {
        font-family: ui-sans-serif, system-ui, sans-serif;
        padding: 2rem;
        max-width: 40rem;
        margin: 0 auto;
      }
      a {
        color: #2563eb;
      }
      li {
        padding: 0.25rem 0;
      }
    </style>
  </head>
  <body>
    <h1>Examples · @squircle-js/svelte</h1>
    <p>
      Each page mounts one example from
      <code>src/examples/</code>. These pages are embedded into the public docs
      via iframes.
    </p>
    <ul>
      <li><a href="/button.html">button</a></li>
      <li><a href="/card.html">card</a></li>
      <li><a href="/avatar.html">avatar</a></li>
      <li><a href="/image-container.html">image-container</a></li>
      <li><a href="/app-icon.html">app-icon</a></li>
      <li><a href="/notification-badge.html">notification-badge</a></li>
      <li><a href="/icon-button.html">icon-button</a></li>
      <li><a href="/reactive-squircle.html">reactive-squircle</a></li>
      <li><a href="/list-of-squircles.html">list-of-squircles</a></li>
      <li><a href="/transitions.html">transitions</a></li>
    </ul>
  </body>
</html>
```

- [ ] **Step 8: Commit**

```bash
git add apps/examples-svelte
git commit -m "chore: scaffold @squircle-js/examples-svelte app shell"
```

---

## Task 5: Add Svelte example components, wrappers, entries, and HTML pages

**Files:**
- Create: `apps/examples-svelte/src/examples/{Name}.svelte` × 10
- Create: `apps/examples-svelte/src/pages/{name}.svelte` × 10 (wrappers)
- Create: `apps/examples-svelte/src/pages/{name}.ts` × 10 (mount scripts)
- Create: `apps/examples-svelte/{name}.html` × 10

Each example component is lifted verbatim from `apps/web/content/docs/svelte-examples.mdx`. Snippet-passing in Svelte 5 is awkward from plain JS, so every example uses a tiny `.svelte` wrapper that instantiates the example with concrete values, and a `.ts` script that mounts the wrapper.

- [ ] **Step 1: Create the 10 `.svelte` component files**

Copy from the code blocks in `apps/web/content/docs/svelte-examples.mdx`:

| MDX section | Destination |
|---|---|
| `## Button` | `apps/examples-svelte/src/examples/Button.svelte` |
| `## Card` | `apps/examples-svelte/src/examples/Card.svelte` |
| `## Avatar` | `apps/examples-svelte/src/examples/Avatar.svelte` |
| `## Image container` | `apps/examples-svelte/src/examples/ImageContainer.svelte` |
| `## App icon` | `apps/examples-svelte/src/examples/AppIcon.svelte` |
| `## Notification badge` | `apps/examples-svelte/src/examples/NotificationBadge.svelte` |
| `## Icon button` | `apps/examples-svelte/src/examples/IconButton.svelte` |
| `## Reactive squircle` | `apps/examples-svelte/src/examples/ReactiveSquircle.svelte` |
| `## List of squircles` | `apps/examples-svelte/src/examples/ListOfSquircles.svelte` |
| `## Composition with transitions` | `apps/examples-svelte/src/examples/Transitions.svelte` |

- [ ] **Step 2: Create the 10 wrapper `.svelte` files under `src/pages/`**

`src/pages/button.svelte`:

```svelte
<script>
  import Button from "../examples/Button.svelte";
</script>

<Button onclick={() => {}}>Press me</Button>
```

`src/pages/card.svelte`:

```svelte
<script>
  import Card from "../examples/Card.svelte";
</script>

<Card
  title="Smooth corners"
  body="A responsive card clipped with a squircle — the shape adapts to any content width."
/>
```

`src/pages/avatar.svelte`:

```svelte
<script>
  import Avatar from "../examples/Avatar.svelte";
</script>

<Avatar src="https://i.pravatar.cc/96?img=5" alt="Avatar" size={96} />
```

`src/pages/image-container.svelte`:

```svelte
<script>
  import ImageContainer from "../examples/ImageContainer.svelte";
</script>

<ImageContainer
  src="https://picsum.photos/seed/squircle-hero/600/400"
  alt="Hero image"
/>
```

`src/pages/app-icon.svelte`:

```svelte
<script>
  import AppIcon from "../examples/AppIcon.svelte";
</script>

<div class="flex gap-6">
  <AppIcon src="https://picsum.photos/seed/icon-1/120/120" name="Photos" />
  <AppIcon src="https://picsum.photos/seed/icon-2/120/120" name="Notes" />
  <AppIcon src="https://picsum.photos/seed/icon-3/120/120" name="Weather" />
</div>
```

`src/pages/notification-badge.svelte`:

```svelte
<script>
  import NotificationBadge from "../examples/NotificationBadge.svelte";
</script>

<NotificationBadge count={7} />
```

`src/pages/icon-button.svelte`:

```svelte
<script>
  import IconButton from "../examples/IconButton.svelte";
</script>

<IconButton label="Search" onclick={() => {}}>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
</IconButton>
```

`src/pages/reactive-squircle.svelte`:

```svelte
<script>
  import ReactiveSquircle from "../examples/ReactiveSquircle.svelte";
</script>

<ReactiveSquircle />
```

`src/pages/list-of-squircles.svelte`:

```svelte
<script lang="ts">
  import ListOfSquircles from "../examples/ListOfSquircles.svelte";

  const tags = [
    { id: "1", label: "Design" },
    { id: "2", label: "Svelte" },
    { id: "3", label: "Squircle" },
    { id: "4", label: "iOS" },
    { id: "5", label: "Smooth" },
  ];
</script>

<ListOfSquircles {tags} />
```

`src/pages/transitions.svelte`:

```svelte
<script>
  import Transitions from "../examples/Transitions.svelte";
</script>

<Transitions />
```

- [ ] **Step 3: Create the 10 mount scripts under `src/pages/`**

Each `.ts` file is identical except the import. Template:

```ts
import { mount } from "svelte";
import "../styles.css";
import Page from "./{example}.svelte";

mount(Page, { target: document.getElementById("app")! });
```

Create 10 files: `button.ts`, `card.ts`, `avatar.ts`, `image-container.ts`, `app-icon.ts`, `notification-badge.ts`, `icon-button.ts`, `reactive-squircle.ts`, `list-of-squircles.ts`, `transitions.ts`. Each imports its own `{name}.svelte` wrapper.

For example, `apps/examples-svelte/src/pages/button.ts`:

```ts
import { mount } from "svelte";
import "../styles.css";
import Page from "./button.svelte";

mount(Page, { target: document.getElementById("app")! });
```

- [ ] **Step 4: Create the 10 per-example HTML files**

Same template as Vue — substitute framework in title. For `apps/examples-svelte/button.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>button · @squircle-js/svelte</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/pages/button.ts"></script>
  </body>
</html>
```

Repeat for the other 9 example slugs.

- [ ] **Step 5: Commit**

```bash
git add apps/examples-svelte
git commit -m "feat(examples-svelte): add 10 example pages"
```

---

## Task 6: Install deps and verify Svelte demo app

- [ ] **Step 1: Install workspace deps**

Run: `pnpm install`
Expected: resolves new deps without errors.

- [ ] **Step 2: Build the Svelte framework package**

Run: `pnpm --filter @squircle-js/svelte build`
Expected: `packages/svelte/dist/index.js` + `index.d.ts` emitted.

- [ ] **Step 3: Typecheck the demo app**

Run: `pnpm --filter @squircle-js/examples-svelte typecheck`
Expected: no errors.

- [ ] **Step 4: Build the demo app**

Run: `pnpm --filter @squircle-js/examples-svelte build`
Expected: `apps/examples-svelte/dist/` contains `index.html` + 10 `{name}.html` + hashed assets.

- [ ] **Step 5: Clean up orphaned workers**

Run: `pkill -9 -f "jest-worker/processChild" || true`
Expected: silent exit.

- [ ] **Step 6: Spot-check each example in dev**

Run: `pnpm --filter @squircle-js/examples-svelte dev`
Open `http://localhost:5173/`, click through each example; verify all render a visible squircle shape. Pay special attention to `reactive-squircle` (slider mutates the shape) and `transitions` (fade animates on mount). Stop the dev server when done.

- [ ] **Step 7: Commit any fixes**

```bash
git add apps/examples-svelte
git commit -m "fix(examples-svelte): resolve issues found during spot-check"
```

Skip if nothing needed fixing.

---

## Task 7: Scaffold `apps/examples-solid` shell

**Files:**
- Create: `apps/examples-solid/package.json`
- Create: `apps/examples-solid/tsconfig.json`
- Create: `apps/examples-solid/vite.config.ts`
- Create: `apps/examples-solid/.gitignore`
- Create: `apps/examples-solid/src/styles.css`
- Create: `apps/examples-solid/index.html`

- [ ] **Step 1: Create `apps/examples-solid/package.json`**

```json
{
  "name": "@squircle-js/examples-solid",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview",
    "clean": "rm -rf .turbo dist node_modules",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@motionone/solid": "^10.16.4",
    "@squircle-js/solid": "workspace:*",
    "solid-js": "^1.9.0"
  },
  "devDependencies": {
    "@squircle-js/tsconfig": "workspace:*",
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "^20.17.22",
    "tailwindcss": "^4.0.0",
    "typescript": "catalog:",
    "vite": "^5.4.0",
    "vite-plugin-solid": "^2.11.0"
  }
}
```

(The `@motionone/solid` dep is required only for the `motion-card` example.)

- [ ] **Step 2: Create `apps/examples-solid/tsconfig.json`**

```json
{
  "extends": "@squircle-js/tsconfig/solid-library.json",
  "compilerOptions": {
    "rootDir": ".",
    "lib": ["ES2022", "DOM"],
    "moduleResolution": "bundler",
    "noEmit": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `apps/examples-solid/vite.config.ts`**

```ts
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const examples = [
  "button",
  "card",
  "avatar",
  "image-container",
  "app-icon",
  "notification-badge",
  "motion-card",
  "icon-button",
  "reactive-squircle",
  "list-of-squircles",
];

export default defineConfig({
  plugins: [solid(), tailwindcss()],
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

- [ ] **Step 4: Create `apps/examples-solid/.gitignore`**

```
node_modules
dist
.turbo
.DS_Store
```

- [ ] **Step 5: Create `apps/examples-solid/src/styles.css`**

```css
@import "tailwindcss";

html,
body {
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

- [ ] **Step 6: Create `apps/examples-solid/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Examples · @squircle-js/solid</title>
    <style>
      body {
        font-family: ui-sans-serif, system-ui, sans-serif;
        padding: 2rem;
        max-width: 40rem;
        margin: 0 auto;
      }
      a {
        color: #2563eb;
      }
      li {
        padding: 0.25rem 0;
      }
    </style>
  </head>
  <body>
    <h1>Examples · @squircle-js/solid</h1>
    <p>
      Each page mounts one example from
      <code>src/examples/</code>. These pages are embedded into the public docs
      via iframes.
    </p>
    <ul>
      <li><a href="/button.html">button</a></li>
      <li><a href="/card.html">card</a></li>
      <li><a href="/avatar.html">avatar</a></li>
      <li><a href="/image-container.html">image-container</a></li>
      <li><a href="/app-icon.html">app-icon</a></li>
      <li><a href="/notification-badge.html">notification-badge</a></li>
      <li><a href="/motion-card.html">motion-card</a></li>
      <li><a href="/icon-button.html">icon-button</a></li>
      <li><a href="/reactive-squircle.html">reactive-squircle</a></li>
      <li><a href="/list-of-squircles.html">list-of-squircles</a></li>
    </ul>
  </body>
</html>
```

- [ ] **Step 7: Commit**

```bash
git add apps/examples-solid
git commit -m "chore: scaffold @squircle-js/examples-solid app shell"
```

---

## Task 8: Add Solid example components, entries, and HTML pages

**Files:**
- Create: `apps/examples-solid/src/examples/{Name}.tsx` × 10
- Create: `apps/examples-solid/src/pages/{name}.tsx` × 10
- Create: `apps/examples-solid/{name}.html` × 10

Solid's JSX and named exports let us keep entries as a single `.tsx` file each — no wrapper component needed.

- [ ] **Step 1: Create the 10 `.tsx` example files**

Copy from `apps/web/content/docs/solid-examples.mdx`:

| MDX section | Destination |
|---|---|
| `## Button` | `apps/examples-solid/src/examples/Button.tsx` |
| `## Card` | `apps/examples-solid/src/examples/Card.tsx` |
| `## Avatar` | `apps/examples-solid/src/examples/Avatar.tsx` |
| `## Image container` | `apps/examples-solid/src/examples/ImageContainer.tsx` |
| `## App icon` | `apps/examples-solid/src/examples/AppIcon.tsx` |
| `## Notification badge` | `apps/examples-solid/src/examples/NotificationBadge.tsx` |
| `## Animated card with Motion One` | `apps/examples-solid/src/examples/MotionCard.tsx` |
| `## Icon button` | `apps/examples-solid/src/examples/IconButton.tsx` |
| `## Reactive squircle` | `apps/examples-solid/src/examples/ReactiveSquircle.tsx` |
| `## List of squircles` | `apps/examples-solid/src/examples/ListOfSquircles.tsx` |

Note: the Solid MDX uses `class="..."` — keep it as-is (Solid accepts `class` natively). Export names in each file must match the one used in the MDX source (e.g. `Button`, `Card`, `Avatar`, `HeroImage` for ImageContainer, `AppIcon`, `Badge` for NotificationBadge, `AnimatedCard` for MotionCard, `IconButton`, `Adjustable` for ReactiveSquircle, `TagList` for ListOfSquircles).

- [ ] **Step 2: Create the 10 per-example entries under `src/pages/`**

`apps/examples-solid/src/pages/button.tsx`:

```tsx
import { render } from "solid-js/web";
import { Button } from "../examples/Button";
import "../styles.css";

render(
  () => <Button onClick={() => {}}>Press me</Button>,
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/card.tsx`:

```tsx
import { render } from "solid-js/web";
import { Card } from "../examples/Card";
import "../styles.css";

render(
  () => (
    <Card
      title="Smooth corners"
      body="A responsive card clipped with a squircle — the shape adapts to any content width."
    />
  ),
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/avatar.tsx`:

```tsx
import { render } from "solid-js/web";
import { Avatar } from "../examples/Avatar";
import "../styles.css";

render(
  () => (
    <Avatar src="https://i.pravatar.cc/96?img=5" alt="Avatar" size={96} />
  ),
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/image-container.tsx`:

```tsx
import { render } from "solid-js/web";
import { HeroImage } from "../examples/ImageContainer";
import "../styles.css";

render(
  () => (
    <HeroImage
      src="https://picsum.photos/seed/squircle-hero/600/400"
      alt="Hero image"
    />
  ),
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/app-icon.tsx`:

```tsx
import { render } from "solid-js/web";
import { AppIcon } from "../examples/AppIcon";
import "../styles.css";

render(
  () => (
    <div class="flex gap-6">
      <AppIcon src="https://picsum.photos/seed/icon-1/120/120" name="Photos" />
      <AppIcon src="https://picsum.photos/seed/icon-2/120/120" name="Notes" />
      <AppIcon src="https://picsum.photos/seed/icon-3/120/120" name="Weather" />
    </div>
  ),
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/notification-badge.tsx`:

```tsx
import { render } from "solid-js/web";
import { Badge } from "../examples/NotificationBadge";
import "../styles.css";

render(() => <Badge count={7} />, document.getElementById("app")!);
```

`apps/examples-solid/src/pages/motion-card.tsx`:

```tsx
import { render } from "solid-js/web";
import { AnimatedCard } from "../examples/MotionCard";
import "../styles.css";

render(
  () => (
    <AnimatedCard>
      <h3 class="font-semibold text-lg text-white">Smooth corners</h3>
      <p class="text-sm text-white/80">Animating in from below.</p>
    </AnimatedCard>
  ),
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/icon-button.tsx`:

```tsx
import type { Component } from "solid-js";
import { render } from "solid-js/web";
import { IconButton } from "../examples/IconButton";
import "../styles.css";

const SearchIcon: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

render(
  () => <IconButton icon={SearchIcon} label="Search" onClick={() => {}} />,
  document.getElementById("app")!,
);
```

`apps/examples-solid/src/pages/reactive-squircle.tsx`:

```tsx
import { render } from "solid-js/web";
import { Adjustable } from "../examples/ReactiveSquircle";
import "../styles.css";

render(() => <Adjustable />, document.getElementById("app")!);
```

`apps/examples-solid/src/pages/list-of-squircles.tsx`:

```tsx
import { render } from "solid-js/web";
import { TagList } from "../examples/ListOfSquircles";
import "../styles.css";

const tags = [
  { id: "1", label: "Design" },
  { id: "2", label: "Solid" },
  { id: "3", label: "Squircle" },
  { id: "4", label: "iOS" },
  { id: "5", label: "Smooth" },
];

render(() => <TagList tags={tags} />, document.getElementById("app")!);
```

- [ ] **Step 3: Create the 10 per-example HTML files**

Template for `apps/examples-solid/button.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>button · @squircle-js/solid</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/pages/button.tsx"></script>
  </body>
</html>
```

Repeat for: `card`, `avatar`, `image-container`, `app-icon`, `notification-badge`, `motion-card`, `icon-button`, `reactive-squircle`, `list-of-squircles`. Note the script extension is `.tsx`, not `.ts`.

- [ ] **Step 4: Commit**

```bash
git add apps/examples-solid
git commit -m "feat(examples-solid): add 10 example pages"
```

---

## Task 9: Install deps and verify Solid demo app

- [ ] **Step 1: Install workspace deps**

Run: `pnpm install`
Expected: resolves new deps including `@motionone/solid`.

- [ ] **Step 2: Build the Solid framework package**

Run: `pnpm --filter @squircle-js/solid build`
Expected: `packages/solid/dist/index.js` + `index.d.ts` emitted.

- [ ] **Step 3: Typecheck the demo app**

Run: `pnpm --filter @squircle-js/examples-solid typecheck`
Expected: no errors.

- [ ] **Step 4: Build the demo app**

Run: `pnpm --filter @squircle-js/examples-solid build`
Expected: `apps/examples-solid/dist/` contains `index.html` + 10 `{name}.html` + hashed assets.

- [ ] **Step 5: Clean up orphaned workers**

Run: `pkill -9 -f "jest-worker/processChild" || true`
Expected: silent exit.

- [ ] **Step 6: Spot-check each example in dev**

Run: `pnpm --filter @squircle-js/examples-solid dev`
Open `http://localhost:5173/`, click through each example; verify all render. Pay special attention to `motion-card` (should slide up and fade in on mount) and `reactive-squircle`. Stop the dev server when done.

- [ ] **Step 7: Commit any fixes**

```bash
git add apps/examples-solid
git commit -m "fix(examples-solid): resolve issues found during spot-check"
```

Skip if nothing needed fixing.

---

## Task 10: Create `<LiveExample>` MDX component and register it

**Files:**
- Create: `apps/web/components/mdx/live-example.tsx`
- Modify: `apps/web/components/mdx/mdx-components.tsx`
- Create: `apps/web/.env.example`

- [ ] **Step 1: Create `apps/web/components/mdx/live-example.tsx`**

```tsx
type Framework = "vue" | "svelte" | "solid";

const BASE_URLS: Record<Framework, string> = {
  vue:
    process.env.NEXT_PUBLIC_EXAMPLES_VUE_URL ??
    "https://squircle-examples-vue.vercel.app",
  svelte:
    process.env.NEXT_PUBLIC_EXAMPLES_SVELTE_URL ??
    "https://squircle-examples-svelte.vercel.app",
  solid:
    process.env.NEXT_PUBLIC_EXAMPLES_SOLID_URL ??
    "https://squircle-examples-solid.vercel.app",
};

interface LiveExampleProps {
  framework: Framework;
  example: string;
  height: number;
  title?: string;
}

export const LiveExample = ({
  framework,
  example,
  height,
  title,
}: LiveExampleProps) => {
  const src = `${BASE_URLS[framework]}/${example}.html`;
  const iframeTitle = title ?? `${framework} ${example} example`;

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-muted/30">
      <iframe
        className="block w-full border-0"
        height={height}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts"
        src={src}
        title={iframeTitle}
        width="100%"
      />
      {title ? (
        <figcaption className="px-3 py-2 text-muted-foreground text-xs">
          {title}
        </figcaption>
      ) : null}
    </figure>
  );
};
```

- [ ] **Step 2: Register in `apps/web/components/mdx/mdx-components.tsx`**

Read the existing file to confirm the component-map shape, then make the edit below.

Edit `apps/web/components/mdx/mdx-components.tsx`:

Replace the import block:

```tsx
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "./code-block";
import { SquircleComparison } from "./squircle-comparison";
import { SquircleDemo } from "./squircle-demo";
```

with:

```tsx
import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "./code-block";
import { LiveExample } from "./live-example";
import { SquircleComparison } from "./squircle-comparison";
import { SquircleDemo } from "./squircle-demo";
```

And replace the end of the `mdxComponents` object:

```tsx
  SquircleDemo,
  SquircleComparison,
};
```

with:

```tsx
  SquircleDemo,
  SquircleComparison,
  LiveExample,
};
```

- [ ] **Step 3: Create `apps/web/.env.example`**

```
# URLs for the three live-example demo apps embedded in /docs/{vue,svelte,solid}-examples.
# Defaults in components/mdx/live-example.tsx match the Vercel project slugs
# created per docs/live-examples-deployment.md — only set these if the Vercel
# slugs differ (e.g. the default name was taken).
#
# NEXT_PUBLIC_EXAMPLES_VUE_URL=https://squircle-examples-vue.vercel.app
# NEXT_PUBLIC_EXAMPLES_SVELTE_URL=https://squircle-examples-svelte.vercel.app
# NEXT_PUBLIC_EXAMPLES_SOLID_URL=https://squircle-examples-solid.vercel.app
```

- [ ] **Step 4: Typecheck `apps/web`**

Run: `pnpm --filter web typecheck`
Expected: no errors.

- [ ] **Step 5: Lint**

Run: `pnpm check`
Expected: clean. If formatting or lint errors surface, run `pnpm fix` and re-run `pnpm check`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/components/mdx/live-example.tsx apps/web/components/mdx/mdx-components.tsx apps/web/.env.example
git commit -m "feat(web): add <LiveExample> MDX component for iframe demos"
```

---

## Task 11: Add `<LiveExample>` blocks to `vue-examples.mdx`

**Files:**
- Modify: `apps/web/content/docs/vue-examples.mdx`

Insert one `<LiveExample>` tag between each section heading and its code block. MDX allows JSX tags inline — they render to React components at build time.

- [ ] **Step 1: Insert `<LiveExample>` above each code block**

For each of the 10 sections in `apps/web/content/docs/vue-examples.mdx`, add a `<LiveExample>` line between the intro paragraph and the triple-backtick fence. The mapping is:

| Section heading | Line to insert (before the ` ```vue ` fence) |
|---|---|
| `## Button` | `<LiveExample framework="vue" example="button" height={120} />` |
| `## Card` | `<LiveExample framework="vue" example="card" height={220} />` |
| `## Avatar` | `<LiveExample framework="vue" example="avatar" height={160} />` |
| `## Image container` | `<LiveExample framework="vue" example="image-container" height={460} />` |
| `## App icon` | `<LiveExample framework="vue" example="app-icon" height={180} />` |
| `## Notification badge` | `<LiveExample framework="vue" example="notification-badge" height={80} />` |
| `## Icon button` | `<LiveExample framework="vue" example="icon-button" height={100} />` |
| `## Reactive squircle` | `<LiveExample framework="vue" example="reactive-squircle" height={200} />` |
| `## List of squircles` | `<LiveExample framework="vue" example="list-of-squircles" height={120} />` |
| `## Composition with transitions` | `<LiveExample framework="vue" example="transitions" height={200} />` |

Insert each line on its own line, with a blank line before and after. For example, the Button section now reads:

````mdx
## Button

Use the `v-squircle` directive to render a button with no wrapper element:

<LiveExample framework="vue" example="button" height={120} />

```vue
<script setup lang="ts">
import { squircleDirective as vSquircle } from "@squircle-js/vue";
...
```
````

- [ ] **Step 2: Verify rendering in dev**

In one terminal, run: `pnpm --filter @squircle-js/examples-vue dev` (note the port, usually `5173`).

In another terminal, run: `NEXT_PUBLIC_EXAMPLES_VUE_URL=http://localhost:5173 pnpm --filter web dev`.

Open `http://localhost:3000/docs/vue-examples`. Scroll through the page and verify that each code block is preceded by a live iframe showing the running example. The iframes should load lazily as you scroll. Stop both dev servers when done.

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter web typecheck`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `pnpm check`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add apps/web/content/docs/vue-examples.mdx
git commit -m "docs(vue): embed live iframe demos above each example"
```

---

## Task 12: Add `<LiveExample>` blocks to `svelte-examples.mdx`

**Files:**
- Modify: `apps/web/content/docs/svelte-examples.mdx`

- [ ] **Step 1: Insert `<LiveExample>` above each code block**

For each section in `apps/web/content/docs/svelte-examples.mdx`, insert a `<LiveExample>` line between the intro paragraph and the fence:

| Section heading | Line to insert |
|---|---|
| `## Button` | `<LiveExample framework="svelte" example="button" height={120} />` |
| `## Card` | `<LiveExample framework="svelte" example="card" height={220} />` |
| `## Avatar` | `<LiveExample framework="svelte" example="avatar" height={160} />` |
| `## Image container` | `<LiveExample framework="svelte" example="image-container" height={460} />` |
| `## App icon` | `<LiveExample framework="svelte" example="app-icon" height={180} />` |
| `## Notification badge` | `<LiveExample framework="svelte" example="notification-badge" height={80} />` |
| `## Icon button` | `<LiveExample framework="svelte" example="icon-button" height={100} />` |
| `## Reactive squircle` | `<LiveExample framework="svelte" example="reactive-squircle" height={200} />` |
| `## List of squircles` | `<LiveExample framework="svelte" example="list-of-squircles" height={120} />` |
| `## Composition with transitions` | `<LiveExample framework="svelte" example="transitions" height={200} />` |

- [ ] **Step 2: Verify in dev**

In one terminal: `pnpm --filter @squircle-js/examples-svelte dev`. Note the port.

In another: `NEXT_PUBLIC_EXAMPLES_SVELTE_URL=http://localhost:<svelte-port> pnpm --filter web dev`.

Open `http://localhost:3000/docs/svelte-examples`. Verify iframes render above each code block. Stop servers.

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm --filter web typecheck && pnpm check`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add apps/web/content/docs/svelte-examples.mdx
git commit -m "docs(svelte): embed live iframe demos above each example"
```

---

## Task 13: Add `<LiveExample>` blocks to `solid-examples.mdx`

**Files:**
- Modify: `apps/web/content/docs/solid-examples.mdx`

- [ ] **Step 1: Insert `<LiveExample>` above each code block**

| Section heading | Line to insert |
|---|---|
| `## Button` | `<LiveExample framework="solid" example="button" height={120} />` |
| `## Card` | `<LiveExample framework="solid" example="card" height={220} />` |
| `## Avatar` | `<LiveExample framework="solid" example="avatar" height={160} />` |
| `## Image container` | `<LiveExample framework="solid" example="image-container" height={460} />` |
| `## App icon` | `<LiveExample framework="solid" example="app-icon" height={180} />` |
| `## Notification badge` | `<LiveExample framework="solid" example="notification-badge" height={80} />` |
| `## Animated card with Motion One` | `<LiveExample framework="solid" example="motion-card" height={220} />` |
| `## Icon button` | `<LiveExample framework="solid" example="icon-button" height={100} />` |
| `## Reactive squircle` | `<LiveExample framework="solid" example="reactive-squircle" height={200} />` |
| `## List of squircles` | `<LiveExample framework="solid" example="list-of-squircles" height={120} />` |

- [ ] **Step 2: Verify in dev**

In one terminal: `pnpm --filter @squircle-js/examples-solid dev`. Note the port.

In another: `NEXT_PUBLIC_EXAMPLES_SOLID_URL=http://localhost:<solid-port> pnpm --filter web dev`.

Open `http://localhost:3000/docs/solid-examples`. Verify iframes render above each code block. Stop servers.

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm --filter web typecheck && pnpm check`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add apps/web/content/docs/solid-examples.mdx
git commit -m "docs(solid): embed live iframe demos above each example"
```

---

## Task 14: Write Vercel deployment documentation

**Files:**
- Create: `docs/live-examples-deployment.md`

- [ ] **Step 1: Create `docs/live-examples-deployment.md`**

```markdown
# Live Examples — Vercel Deployment

The three demo apps under `apps/examples-{vue,svelte,solid}` each deploy as
their own Vercel project. `apps/web` embeds them as iframes via
`<LiveExample>` in the MDX component map. This doc covers the one-time dashboard
setup.

## Create three Vercel projects

For each framework, create a new project pointing at the same GitHub repo:

| Setting | Vue | Svelte | Solid |
|---|---|---|---|
| Project name | `squircle-examples-vue` | `squircle-examples-svelte` | `squircle-examples-solid` |
| Framework preset | Vite | Vite | Vite |
| Root Directory | `apps/examples-vue` | `apps/examples-svelte` | `apps/examples-solid` |
| Build command | `cd ../.. && pnpm turbo build --filter=@squircle-js/examples-vue` | `cd ../.. && pnpm turbo build --filter=@squircle-js/examples-svelte` | `cd ../.. && pnpm turbo build --filter=@squircle-js/examples-solid` |
| Output Directory | `dist` | `dist` | `dist` |
| Install command | `cd ../.. && pnpm install --frozen-lockfile` | same | same |
| Node version | 20.x (default) | 20.x | 20.x |

The `pnpm turbo build --filter=…` command is important — it ensures the
corresponding framework package (`@squircle-js/vue`, `@squircle-js/svelte`,
`@squircle-js/solid`) is built before the demo app, satisfying the
`workspace:*` dependency.

## Ignored Build Step

To avoid rebuilding all three apps on every PR, set an Ignored Build Step per
project. In project Settings → Git → Ignored Build Step:

```bash
git diff HEAD^ HEAD --quiet ./ ../../packages/{framework} ../../packages/figma-squircle 2>/dev/null
```

Substitute `{framework}` with `vue`, `svelte`, or `solid` for the matching
project. The build runs only if something under the demo app itself, its
framework package, or `figma-squircle` changed.

## Wire the URLs into `apps/web`

Once the three Vercel projects are deployed, the default URLs
(`https://squircle-examples-{framework}.vercel.app`) match the hardcoded
fallbacks in `apps/web/components/mdx/live-example.tsx`, so no env-var
configuration is needed. If a slug was taken and Vercel assigned a different
URL, set the corresponding env var on the `apps/web` project:

```
NEXT_PUBLIC_EXAMPLES_VUE_URL=https://<actual-slug>.vercel.app
NEXT_PUBLIC_EXAMPLES_SVELTE_URL=https://<actual-slug>.vercel.app
NEXT_PUBLIC_EXAMPLES_SOLID_URL=https://<actual-slug>.vercel.app
```

## Verifying after deployment

- Open `https://squircle.js.org/docs/vue-examples` and confirm each iframe
  loads a working live demo (not a 404).
- Repeat for `/docs/svelte-examples` and `/docs/solid-examples`.
- Check the browser network tab — iframes should load lazily as you scroll,
  not all on first paint.
```

- [ ] **Step 2: Commit**

```bash
git add docs/live-examples-deployment.md
git commit -m "docs: add Vercel deployment guide for live-examples apps"
```

---

## Task 15: Full validation sweep and PR

- [ ] **Step 1: Full monorepo build**

Run: `pnpm build`
Expected: all packages and apps build successfully. Turbo should report 6+ tasks succeeded (4 packages + 4 apps).

- [ ] **Step 2: Clean up orphaned workers**

Run: `pkill -9 -f "jest-worker/processChild" || true`
Expected: silent exit.

- [ ] **Step 3: Full typecheck**

Run: `pnpm typecheck`
Expected: no errors across any package or app.

- [ ] **Step 4: Full lint**

Run: `pnpm check`
Expected: clean. If errors surface, run `pnpm fix` and re-run.

- [ ] **Step 5: Smoke-test all three iframes together**

In three terminals, start all three demo apps:

```bash
# Terminal 1
pnpm --filter @squircle-js/examples-vue dev     # usually :5173
# Terminal 2
pnpm --filter @squircle-js/examples-svelte dev  # usually :5174
# Terminal 3
pnpm --filter @squircle-js/examples-solid dev   # usually :5175
```

In a fourth terminal, start docs with all three URLs overridden (match the actual ports Vite printed):

```bash
NEXT_PUBLIC_EXAMPLES_VUE_URL=http://localhost:5173 \
NEXT_PUBLIC_EXAMPLES_SVELTE_URL=http://localhost:5174 \
NEXT_PUBLIC_EXAMPLES_SOLID_URL=http://localhost:5175 \
pnpm --filter web dev
```

Open each of `http://localhost:3000/docs/{vue,svelte,solid}-examples`. Verify:
- Every code block has a working iframe above it showing the running example.
- The `reactive-squircle` iframes respond to the slider input.
- The `transitions` (vue/svelte) and `motion-card` (solid) iframes animate on load (refresh to re-trigger).
- Open DevTools Network; the iframes load lazily (not all on first paint) — scroll to trigger later ones.
- No console errors.

Stop all four dev servers.

- [ ] **Step 6: Commit any fixes from smoke-test**

If anything was broken:

```bash
git add <files>
git commit -m "fix: resolve issues found during final smoke-test"
```

Skip if clean.

- [ ] **Step 7: Push and open PR**

```bash
git push -u origin $(git branch --show-current)
gh pr create --title "feat: live iframe demos on vue/svelte/solid examples pages" --body "$(cat <<'EOF'
## Summary

- Add three private workspace apps (`apps/examples-{vue,svelte,solid}`) each shipping the 10 examples currently shown on the corresponding docs page as runnable pages under one Vite multi-page build.
- Add `<LiveExample framework="..." example="..." height={...} />` MDX component in `apps/web` that renders a lazy-loaded, sandboxed iframe pointing at the deployed demo app.
- Embed a `<LiveExample>` above every code block on `/docs/{vue,svelte,solid}-examples` — readers now see the example running before they read the source.
- React examples stay inline (unchanged); other docs pages unaffected.

Vercel setup is manual — see `docs/live-examples-deployment.md`. Merging this PR with the hardcoded fallback URLs is safe: iframes 404 until the three Vercel projects are created, then resolve without any further code change.

## Test plan

- [ ] `pnpm build` clean from a fresh install
- [ ] `pnpm typecheck` clean
- [ ] `pnpm check` clean
- [ ] Local smoke-test: run all three demo apps + docs with `NEXT_PUBLIC_EXAMPLES_*_URL` overrides; every iframe on `/docs/{vue,svelte,solid}-examples` renders correctly
- [ ] After merge: create the three Vercel projects per `docs/live-examples-deployment.md` and confirm prod URLs render

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Print the PR URL in the final response.

---

## Self-review checklist (run after implementation)

- [ ] All 30 example components exist in their respective `src/examples/` dirs and were lifted verbatim from the MDX files.
- [ ] Each framework app's `dist/` after `pnpm build` contains one HTML file per example plus `index.html`.
- [ ] `<LiveExample>` appears exactly once above every code block on all three `*-examples.mdx` pages (30 total occurrences).
- [ ] `pnpm build`, `pnpm typecheck`, `pnpm check` all clean on main after merge.
- [ ] No committed binary assets under `apps/examples-*/public/` — all images are external URLs.
- [ ] `docs/live-examples-deployment.md` exists with the three-project Vercel table.
