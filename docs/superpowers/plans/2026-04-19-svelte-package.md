# `@squircle-js/svelte` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `@squircle-js/svelte` package that mirrors the React/Solid API idiomatically in Svelte 5, plus matching documentation, auto-published by the existing Changesets release workflow.

**Architecture:** New `packages/svelte/` workspace package. Core logic lives in two Svelte actions (`use:squircle`, `use:staticSquircle`) that attach size observation + clip-path styling to any element; thin component wrappers (`Squircle.svelte`, `StaticSquircle.svelte`) use the actions internally for the familiar component API. SSR-safe: actions only run on the client; SSR output includes clip-path only when `defaultWidth`/`defaultHeight` are provided. Build via `@sveltejs/package`. Smoke test via Vitest + `@testing-library/svelte` + `jsdom`.

**Tech Stack:** Svelte 5 (runes), `figma-squircle`, `@sveltejs/package`, `@sveltejs/vite-plugin-svelte`, `svelte-check`, Vitest + `@testing-library/svelte` + `jsdom`, Changesets, pnpm workspaces, Turbo.

**Spec:** [`docs/superpowers/specs/2026-04-19-svelte-package-design.md`](../specs/2026-04-19-svelte-package-design.md)

---

## Task 1: Scaffold `packages/svelte` package config

**Files:**
- Create: `packages/svelte/package.json`
- Create: `packages/svelte/tsconfig.json`
- Create: `packages/svelte/svelte.config.js`
- Create: `packages/svelte/vitest.config.ts`
- Create: `packages/svelte/.gitignore`

- [ ] **Step 1: Create `packages/svelte/package.json`**

```json
{
  "name": "@squircle-js/svelte",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "svelte": "./dist/index.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "svelte-package",
    "dev": "svelte-package --watch",
    "clean": "rm -rf .turbo dist node_modules",
    "typecheck": "svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run"
  },
  "dependencies": {
    "figma-squircle": "1.1.0"
  },
  "devDependencies": {
    "@squircle-js/tsconfig": "workspace:*",
    "@sveltejs/package": "^2.3.7",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@testing-library/svelte": "^5.2.4",
    "jsdom": "^25.0.1",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "typescript": "catalog:",
    "vitest": "^2.1.0"
  },
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/bring-shrubbery/squircle-js.git"
  },
  "bugs": {
    "url": "https://github.com/bring-shrubbery/squircle-js/issues"
  },
  "homepage": "https://squircle.js.org",
  "author": {
    "name": "Antoni Silvestrovic",
    "email": "antoni@quassum.com"
  }
}
```

- [ ] **Step 2: Create `packages/svelte/tsconfig.json`**

```json
{
  "extends": "@squircle-js/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist",
    "declaration": true,
    "noImplicitAny": false,
    "strictNullChecks": true,
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*.ts", "src/**/*.svelte"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] **Step 3: Create `packages/svelte/svelte.config.js`**

```js
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  package: {
    dir: "dist",
    emitTypes: true,
  },
};
```

- [ ] **Step 4: Create `packages/svelte/vitest.config.ts`**

```ts
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    conditions: ["browser"],
  },
});
```

- [ ] **Step 5: Create `packages/svelte/.gitignore`**

```
.turbo
dist
node_modules
```

- [ ] **Step 6: Install dependencies**

Run from repo root:

```bash
pnpm install
```

Expected: pnpm resolves new workspace package and installs deps. No errors.

- [ ] **Step 7: Commit**

```bash
git add packages/svelte/package.json packages/svelte/tsconfig.json packages/svelte/svelte.config.js packages/svelte/vitest.config.ts packages/svelte/.gitignore pnpm-lock.yaml
git commit -m "feat(svelte): scaffold @squircle-js/svelte package config"
```

---

## Task 2: Shared path-computation helper

**Files:**
- Create: `packages/svelte/src/lib/computePath.ts`

- [ ] **Step 1: Create `computePath.ts`**

```ts
import { getSvgPath } from "figma-squircle";

export interface ComputeClipPathOptions {
  width: number;
  height: number;
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export function computeClipPath(opts: ComputeClipPathOptions): string {
  if (opts.width === 0 || opts.height === 0) return "";
  return getSvgPath({
    width: opts.width,
    height: opts.height,
    cornerRadius: opts.cornerRadius,
    cornerSmoothing: opts.cornerSmoothing ?? 0.6,
  });
}
```

- [ ] **Step 2: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors (no Svelte files yet but this TS file should pass).

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/computePath.ts
git commit -m "feat(svelte): add computeClipPath helper"
```

---

## Task 3: `use:squircle` dynamic action

**Files:**
- Create: `packages/svelte/src/lib/squircle.svelte.ts`

- [ ] **Step 1: Write the action**

```ts
import type { Action } from "svelte/action";

import { computeClipPath } from "./computePath.js";

export interface SquircleActionOptions {
  cornerRadius?: number;
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const squircle: Action<HTMLElement, SquircleActionOptions | undefined> = (
  node,
  initialOptions,
) => {
  let opts: SquircleActionOptions = initialOptions ?? {};
  let observer: ResizeObserver | null = null;

  const apply = (width: number, height: number) => {
    const path = computeClipPath({
      width,
      height,
      cornerRadius: opts.cornerRadius,
      cornerSmoothing: opts.cornerSmoothing,
    });
    node.style.clipPath = path ? `path('${path}')` : "";

    if (opts.cornerRadius !== undefined) {
      node.style.borderRadius = `${opts.cornerRadius}px`;
      node.setAttribute("data-squircle", String(opts.cornerRadius));
    } else {
      node.removeAttribute("data-squircle");
    }

    if (opts.width !== undefined) node.style.width = `${opts.width}px`;
    if (opts.height !== undefined) node.style.height = `${opts.height}px`;
  };

  const measure = () => {
    const w = opts.width ?? node.offsetWidth ?? opts.defaultWidth ?? 0;
    const h = opts.height ?? node.offsetHeight ?? opts.defaultHeight ?? 0;
    apply(w, h);
  };

  const hasExplicitSize =
    opts.width !== undefined && opts.height !== undefined;

  if (hasExplicitSize) {
    apply(opts.width as number, opts.height as number);
  } else {
    measure();
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      observer.observe(node);
    }
  }

  return {
    update(newOptions: SquircleActionOptions | undefined) {
      opts = newOptions ?? {};
      const nextHasExplicit =
        opts.width !== undefined && opts.height !== undefined;

      if (nextHasExplicit && observer) {
        observer.disconnect();
        observer = null;
        apply(opts.width as number, opts.height as number);
        return;
      }

      if (!nextHasExplicit && !observer && typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(measure);
        observer.observe(node);
      }

      measure();
    },
    destroy() {
      observer?.disconnect();
      observer = null;
    },
  };
};
```

- [ ] **Step 2: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/squircle.svelte.ts
git commit -m "feat(svelte): add use:squircle action"
```

---

## Task 4: `use:staticSquircle` synchronous action

**Files:**
- Create: `packages/svelte/src/lib/staticSquircle.ts`

- [ ] **Step 1: Write the action**

```ts
import type { Action } from "svelte/action";

import { computeClipPath } from "./computePath.js";

export interface StaticSquircleActionOptions {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

export const staticSquircle: Action<HTMLElement, StaticSquircleActionOptions> = (
  node,
  initialOptions,
) => {
  const apply = (opts: StaticSquircleActionOptions) => {
    const path = computeClipPath(opts);
    node.style.clipPath = path ? `path('${path}')` : "";
    node.style.borderRadius = `${opts.cornerRadius}px`;
    node.setAttribute("data-squircle", String(opts.cornerRadius));
    node.style.width = `${opts.width}px`;
    node.style.height = `${opts.height}px`;
  };

  apply(initialOptions);

  return {
    update(newOptions: StaticSquircleActionOptions) {
      apply(newOptions);
    },
  };
};
```

- [ ] **Step 2: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/staticSquircle.ts
git commit -m "feat(svelte): add use:staticSquircle action"
```

---

## Task 5: `<Squircle>` component

**Files:**
- Create: `packages/svelte/src/lib/Squircle.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { squircle } from "./squircle.svelte.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    cornerRadius?: number;
    cornerSmoothing?: number;
    width?: number;
    height?: number;
    defaultWidth?: number;
    defaultHeight?: number;
    children?: Snippet;
  }

  let {
    cornerRadius,
    cornerSmoothing = 0.6,
    width,
    height,
    defaultWidth,
    defaultHeight,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  {...rest}
  use:squircle={{
    cornerRadius,
    cornerSmoothing,
    width,
    height,
    defaultWidth,
    defaultHeight,
  }}
>
  {@render children?.()}
</div>
```

- [ ] **Step 2: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/Squircle.svelte
git commit -m "feat(svelte): add Squircle component"
```

---

## Task 6: `<StaticSquircle>` component

**Files:**
- Create: `packages/svelte/src/lib/StaticSquircle.svelte`

- [ ] **Step 1: Write the component**

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  import { staticSquircle } from "./staticSquircle.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    width: number;
    height: number;
    cornerRadius: number;
    cornerSmoothing: number;
    children?: Snippet;
  }

  let {
    width,
    height,
    cornerRadius,
    cornerSmoothing,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  {...rest}
  use:staticSquircle={{ width, height, cornerRadius, cornerSmoothing }}
>
  {@render children?.()}
</div>
```

- [ ] **Step 2: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/StaticSquircle.svelte
git commit -m "feat(svelte): add StaticSquircle component"
```

---

## Task 7: `<SquircleNoScript>` component

**Files:**
- Create: `packages/svelte/src/lib/SquircleNoScript.svelte`

- [ ] **Step 1: Write the component**

```svelte
<svelte:head>
  <!-- svelte-ignore element_invalid_self_closing_tag -->
  {@html `<noscript><style>[data-squircle] { clip-path: none !important; border-radius: attr(data-squircle) !important; }</style></noscript>`}
</svelte:head>
```

Note: `{@html}` is used because Svelte parses `<noscript>` contents as actual DOM during SSR, which can cause hydration mismatch. Emitting the raw HTML string guarantees the browser sees literal `<noscript>` bytes.

- [ ] **Step 2: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/SquircleNoScript.svelte
git commit -m "feat(svelte): add SquircleNoScript component"
```

---

## Task 8: Barrel exports

**Files:**
- Create: `packages/svelte/src/lib/index.ts`

- [ ] **Step 1: Write `index.ts`**

```ts
export { default as Squircle } from "./Squircle.svelte";
export { default as SquircleNoScript } from "./SquircleNoScript.svelte";
export { default as StaticSquircle } from "./StaticSquircle.svelte";
export { squircle, type SquircleActionOptions } from "./squircle.svelte.js";
export {
  staticSquircle,
  type StaticSquircleActionOptions,
} from "./staticSquircle.js";
```

- [ ] **Step 2: Build**

```bash
cd packages/svelte && pnpm build
```

Expected: `dist/` is created with `.svelte`, `.js`, `.d.ts` files. No errors.

- [ ] **Step 3: Typecheck**

```bash
cd packages/svelte && pnpm typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/svelte/src/lib/index.ts
git commit -m "feat(svelte): add barrel exports"
```

---

## Task 9: Smoke test

**Files:**
- Create: `packages/svelte/src/lib/Squircle.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Squircle from "./Squircle.svelte";

describe("Squircle", () => {
  test("renders a div with data-squircle and a path() clip-path", () => {
    const { container } = render(Squircle, {
      props: {
        cornerRadius: 16,
        defaultWidth: 100,
        defaultHeight: 100,
      },
    });

    const el = container.firstElementChild as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("data-squircle")).toBe("16");
    expect(el.style.clipPath.startsWith("path(")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test**

```bash
cd packages/svelte && pnpm test
```

Expected: test passes. If ResizeObserver isn't defined in jsdom (likely), the action still applies the initial style via `measure()` using `offsetWidth`/`offsetHeight` (0 in jsdom) → falls back to `defaultWidth`/`defaultHeight` = 100, so clip-path is set.

- [ ] **Step 3: Commit**

```bash
git add packages/svelte/src/lib/Squircle.test.ts
git commit -m "test(svelte): add Squircle smoke test"
```

---

## Task 10: Package README

**Files:**
- Create: `packages/svelte/README.md`

- [ ] **Step 1: Write the README**

````markdown
# @squircle-js/svelte

iOS-style squircle (smooth corners) for Svelte 5.

## Install

```bash
pnpm add @squircle-js/svelte
# or
npm install @squircle-js/svelte
```

## Component usage

```svelte
<script>
  import { Squircle } from "@squircle-js/svelte";
</script>

<Squircle cornerRadius={24} cornerSmoothing={0.6} class="card">
  <h2>Hello, squircle</h2>
</Squircle>
```

## Action usage (no wrapper element)

Apply the squircle clip-path directly to any element — no extra DOM node:

```svelte
<script>
  import { squircle } from "@squircle-js/svelte";
</script>

<button
  use:squircle={{ cornerRadius: 12, cornerSmoothing: 0.6 }}
  class="bg-indigo-600 px-4 py-2 text-white"
>
  Click me
</button>
```

## Static (fixed-dimension) variant

For elements whose size is known at authoring time, skip the `ResizeObserver`:

```svelte
<script>
  import { StaticSquircle, staticSquircle } from "@squircle-js/svelte";
</script>

<!-- component -->
<StaticSquircle width={48} height={48} cornerRadius={12} cornerSmoothing={0.6}>
  <img src="/avatar.jpg" alt="" />
</StaticSquircle>

<!-- action — applied directly to the element -->
<img
  src="/avatar.jpg"
  alt=""
  use:staticSquircle={{ width: 48, height: 48, cornerRadius: 12, cornerSmoothing: 0.6 }}
/>
```

## SvelteKit SSR

Add `<SquircleNoScript />` once in your root layout for a `border-radius` fallback when JavaScript is disabled:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { SquircleNoScript } from "@squircle-js/svelte";
</script>

<SquircleNoScript />
<slot />
```

For elements with known dimensions, prefer `StaticSquircle` / `use:staticSquircle` — they produce a stable clip-path in the server-rendered HTML. For dynamic `Squircle`, pass `defaultWidth` and `defaultHeight` when you can.

## Docs

Full documentation: https://squircle.js.org/docs/svelte-getting-started
````

- [ ] **Step 2: Commit**

```bash
git add packages/svelte/README.md
git commit -m "docs(svelte): add package README"
```

---

## Task 11: Update root README to list Svelte

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read current framework-support section**

```bash
grep -n "Framework" README.md || grep -n "@squircle-js" README.md
```

Identify where React and Solid are listed (added during Solid spec).

- [ ] **Step 2: Add Svelte to the list**

Add a bullet or row for Svelte alongside React and Solid, linking to `@squircle-js/svelte` on npm and the new docs page (`/docs/svelte-getting-started`).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: mention @squircle-js/svelte in root README"
```

---

## Task 12: Changeset for initial release

**Files:**
- Create: `.changeset/svelte-package.md`

- [ ] **Step 1: Create changeset**

```markdown
---
"@squircle-js/svelte": minor
---

Initial release of `@squircle-js/svelte`. Svelte 5 port of the squircle component with parity to `@squircle-js/react` and `@squircle-js/solid`. Exports `Squircle`, `StaticSquircle`, `SquircleNoScript` components plus `use:squircle` and `use:staticSquircle` actions (the idiomatic Svelte replacement for `asChild`).
```

- [ ] **Step 2: Commit**

```bash
git add .changeset/svelte-package.md
git commit -m "chore: add changeset for @squircle-js/svelte 0.1.0"
```

---

## Task 13: Docs — Getting Started

**Files:**
- Create: `apps/web/content/docs/svelte-getting-started.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "Getting Started"
description: "Install @squircle-js/svelte and render your first squircle in Svelte 5."
keywords: ["svelte squircle", "svelte ios squircle", "svelte smooth corners"]
slug: "svelte-getting-started"
order: 1
group: "svelte"
---

## Install

```bash
pnpm add @squircle-js/svelte
# or
npm install @squircle-js/svelte
```

Requires Svelte 5 or later. For SvelteKit projects, the package works out of the box — no additional configuration needed.

## Basic usage

```svelte
<script>
  import { Squircle } from "@squircle-js/svelte";
</script>

<Squircle cornerRadius={24} cornerSmoothing={0.6} class="bg-indigo-500 p-6">
  <h2 class="text-white font-semibold text-lg">Hello, squircle</h2>
</Squircle>
```

`Squircle` renders a `<div>` that auto-measures itself with a `ResizeObserver` and applies a computed SVG `clip-path` for the smooth-corner effect.

## The action alternative

Svelte's `asChild` equivalent is an **action** — apply the squircle clip-path directly to any element without a wrapper:

```svelte
<script>
  import { squircle } from "@squircle-js/svelte";
</script>

<button
  use:squircle={{ cornerRadius: 12, cornerSmoothing: 0.6 }}
  class="bg-blue-600 px-4 py-2 text-white"
>
  Click me
</button>
```

See [The Action Pattern](/docs/svelte-action) for the full story.

## SvelteKit SSR

Everything works with SvelteKit's SSR and prerendering. The action runs only on the client (actions are client-only by design in Svelte), so initial server-rendered HTML omits the `clip-path` unless you pass `defaultWidth` / `defaultHeight` (or use `StaticSquircle` for fixed-size elements).

See [No-JavaScript Fallback](/docs/svelte-no-javascript-fallback) and [SquircleNoScript](/docs/svelte-no-javascript-fallback) for progressive enhancement details.

## Coming from React or Solid?

The component API is nearly identical:

- `Squircle`, `StaticSquircle`, `SquircleNoScript` — same names, same props
- `cornerRadius`, `cornerSmoothing`, `width`, `height`, `defaultWidth`, `defaultHeight` — same semantics
- `asChild` → replaced by `use:squircle` action (idiomatic Svelte)

The one deviation: this package uses `class` (Svelte's attribute name) rather than `className`, and children are passed as snippets rather than JSX children.
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-getting-started.mdx
git commit -m "docs(web): add svelte getting-started page"
```

---

## Task 14: Docs — Squircle component

**Files:**
- Create: `apps/web/content/docs/svelte-squircle-component.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "Squircle Component"
description: "API reference for the Squircle Svelte component: props, ResizeObserver behavior, and SvelteKit SSR considerations."
keywords: ["svelte squircle component", "svelte squircle api", "svelte squircle props"]
slug: "svelte-squircle-component"
order: 2
group: "svelte"
---

## Overview

`Squircle` is the dynamic, size-observing component. It measures its own rendered size via `ResizeObserver` and recomputes the SVG clip-path whenever the size or corner props change.

```svelte
<script>
  import { Squircle } from "@squircle-js/svelte";
</script>

<Squircle cornerRadius={20} cornerSmoothing={0.6} class="bg-gray-800 p-6">
  <span class="text-white">Content</span>
</Squircle>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `cornerRadius` | `number` | `undefined` | Corner radius in pixels. Also written to `border-radius` and `data-squircle`. |
| `cornerSmoothing` | `number` | `0.6` | Squircle smoothing from `0` (standard arc) to `1` (maximum). |
| `width` | `number` | — | Explicit width override; disables the observer when combined with `height`. |
| `height` | `number` | — | Explicit height override. |
| `defaultWidth` | `number` | — | Width used before first measurement (useful for SSR). |
| `defaultHeight` | `number` | — | Height used before first measurement. |
| `class` | `string` | — | Forwarded to the rendered `<div>`. |
| `style` | `string` | — | Forwarded; the squircle's `clip-path` is set directly on the element, not the attribute. |
| `children` | `Snippet` | — | Standard Svelte 5 children snippet. |

Any additional HTML attributes are forwarded to the underlying `<div>`.

## How measurement works

`Squircle` uses the `squircle` action internally, which sets up a `ResizeObserver` on mount. The observer fires:

- After the initial mount (producing the first clip-path)
- Whenever the element's content box resizes
- Whenever the options passed to the action change (corner props, explicit dimensions)

When both `width` and `height` are provided explicitly, the observer is skipped — the clip-path is computed once and updated only when options change.

## SSR & hydration

The action runs only on the client, so during SSR the element is emitted with no `clip-path` unless you provide fallbacks:

- **`defaultWidth` / `defaultHeight`** — consumed by the action on first measurement (if the real offset is `0`), allowing a reasonable initial clip-path after hydration.
- **Prefer `StaticSquircle`** for any element whose size is known at authoring time — it produces a stable clip-path in the server-rendered HTML (no observer needed).
- **`SquircleNoScript`** provides a `border-radius` fallback when JavaScript is disabled entirely.

## Reactive props

Because options are passed through the action, updates to `cornerRadius` and other props reactively recompute the clip-path:

```svelte
<script>
  import { Squircle } from "@squircle-js/svelte";

  let radius = $state(16);
</script>

<input type="range" min="0" max="64" bind:value={radius} />

<Squircle cornerRadius={radius} class="w-32 h-32 bg-emerald-500" />
```

Svelte's fine-grained reactivity means only the `clip-path` style is updated — no component re-render.

## When to use `Squircle` vs `StaticSquircle`

- **Unknown / responsive dimensions** → `Squircle`.
- **Fixed dimensions known at authoring time** → `StaticSquircle`. Cheaper (no observer), SSR-friendly (produces a clip-path on the server).

## When to use the component vs the action

- **Need a wrapper `<div>` around arbitrary children** → use `<Squircle>`.
- **Want to apply squircle clipping directly to a `<button>`, `<img>`, `<a>`, etc.** → use the [`use:squircle` action](/docs/svelte-action).
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-squircle-component.mdx
git commit -m "docs(web): add svelte squircle-component page"
```

---

## Task 15: Docs — StaticSquircle

**Files:**
- Create: `apps/web/content/docs/svelte-static-squircle.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "StaticSquircle"
description: "StaticSquircle skips the ResizeObserver for elements with known dimensions — cheaper, SSR-friendly, ideal for avatars, icons, and grid cells."
keywords: ["svelte static squircle", "svelte squircle fixed size", "svelte squircle ssr"]
slug: "svelte-static-squircle"
order: 3
group: "svelte"
---

## Overview

`StaticSquircle` is for elements whose dimensions are known at authoring time. It computes the clip-path synchronously from its props — no `ResizeObserver`, no measurement. This makes it cheaper at runtime and produces a stable clip-path in server-rendered HTML.

```svelte
<script>
  import { StaticSquircle } from "@squircle-js/svelte";
</script>

<StaticSquircle width={48} height={48} cornerRadius={12} cornerSmoothing={0.6}>
  <img src="/avatar.jpg" alt="" class="w-full h-full object-cover" />
</StaticSquircle>
```

## Props

All four size/shape props are required:

| Prop | Type | Description |
|---|---|---|
| `width` | `number` | Element width in pixels. |
| `height` | `number` | Element height in pixels. |
| `cornerRadius` | `number` | Corner radius in pixels. |
| `cornerSmoothing` | `number` | Squircle smoothing from `0` to `1`. |
| `class` | `string` | Forwarded to the rendered `<div>`. |
| `style` | `string` | Forwarded. |
| `children` | `Snippet` | Standard children snippet. |

## When to prefer StaticSquircle

- **Avatars, app icons, tag chips, fixed badges** — anything with known width/height
- **Grid cells of a known size**
- **SSR-first pages** where the server-rendered HTML needs to include a valid clip-path

## Performance note

Svelte 5's reactivity is fine-grained — a `StaticSquircle` whose props change recomputes only the clip-path style, not the component. This means using it inside an `{#each}` with reactive sizes is still inexpensive.

```svelte
<script>
  import { StaticSquircle } from "@squircle-js/svelte";

  const icons = [
    { src: "/mail.png", name: "Mail" },
    { src: "/calendar.png", name: "Calendar" },
    { src: "/notes.png", name: "Notes" },
  ];
</script>

<div class="grid grid-cols-3 gap-4">
  {#each icons as icon}
    <StaticSquircle
      width={60}
      height={60}
      cornerRadius={13}
      cornerSmoothing={0.6}
      class="overflow-hidden"
    >
      <img src={icon.src} alt={icon.name} class="w-full h-full object-cover" />
    </StaticSquircle>
  {/each}
</div>
```

## When to use the action instead

If you'd rather not introduce a wrapper `<div>` around your element, use the [`use:staticSquircle` action](/docs/svelte-action) to apply the clip-path directly.
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-static-squircle.mdx
git commit -m "docs(web): add svelte static-squircle page"
```

---

## Task 16: Docs — Action pattern

**Files:**
- Create: `apps/web/content/docs/svelte-action.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "The Action Pattern"
description: "use:squircle and use:staticSquircle attach squircle clipping directly to any element — the idiomatic Svelte equivalent of React's asChild."
keywords: ["svelte squircle action", "svelte use:squircle", "svelte ios squircle button"]
slug: "svelte-action"
order: 4
group: "svelte"
---

## What is an action?

A Svelte **action** is a function that attaches behavior to an element, invoked via `use:name={options}`. It has access to the DOM node directly and gets lifecycle hooks (`update`, `destroy`).

`@squircle-js/svelte` ships two actions:

- `use:squircle` — dynamic, observes element size
- `use:staticSquircle` — synchronous, takes explicit `width` / `height`

## Why actions instead of `asChild`?

React and Solid's `asChild` pattern works because JSX children can be cloned and augmented with extra props. Svelte's snippets don't expose the DOM element to the parent component, so there's no clean way to "forward" clip-path styles through a snippet.

Svelte's answer is the action directive — a primitive specifically for attaching behavior to any element. It's lighter than wrapping, works for any intrinsic element, composes with Svelte transitions and third-party actions, and reads naturally in templates.

## `use:squircle`

```svelte
<script>
  import { squircle } from "@squircle-js/svelte";
</script>

<button
  use:squircle={{ cornerRadius: 12, cornerSmoothing: 0.6 }}
  class="bg-indigo-600 px-5 py-2.5 text-white font-semibold"
>
  Click me
</button>
```

**Behavior:**

- Sets `data-squircle`, `border-radius`, and `clip-path` on the element
- Observes size via `ResizeObserver` — updates clip-path on resize
- Respects explicit `width` / `height` (skips the observer when both are given)
- Cleans up the observer when the element is removed

**Options:**

| Option | Type | Description |
|---|---|---|
| `cornerRadius` | `number` | Corner radius in pixels. |
| `cornerSmoothing` | `number` | Squircle smoothing from `0` to `1`. Defaults to `0.6`. |
| `width` | `number` | Explicit width override. |
| `height` | `number` | Explicit height override. |
| `defaultWidth` | `number` | Fallback width used before first measurement. |
| `defaultHeight` | `number` | Fallback height used before first measurement. |

## `use:staticSquircle`

Synchronous variant. No observer. All four size/shape options are required.

```svelte
<script>
  import { staticSquircle } from "@squircle-js/svelte";
</script>

<img
  src="/avatar.jpg"
  alt="Avatar"
  use:staticSquircle={{
    width: 48,
    height: 48,
    cornerRadius: 12,
    cornerSmoothing: 0.6,
  }}
  class="object-cover"
/>
```

## Examples

### Link

```svelte
<script>
  import { squircle } from "@squircle-js/svelte";
</script>

<a
  href="/docs"
  use:squircle={{ cornerRadius: 12, cornerSmoothing: 0.6 }}
  class="inline-flex items-center bg-gray-900 px-4 py-2 text-white"
>
  Read the docs
</a>
```

### Image

```svelte
<script>
  import { staticSquircle } from "@squircle-js/svelte";
</script>

<img
  src="/hero.jpg"
  alt="Hero"
  use:staticSquircle={{
    width: 600,
    height: 400,
    cornerRadius: 32,
    cornerSmoothing: 0.8,
  }}
  class="object-cover"
/>
```

### Reactive options

```svelte
<script>
  import { squircle } from "@squircle-js/svelte";

  let radius = $state(16);
</script>

<input type="range" min="0" max="64" bind:value={radius} />

<div
  use:squircle={{ cornerRadius: radius, cornerSmoothing: 0.6 }}
  class="w-40 h-40 bg-rose-500"
></div>
```

When the `radius` rune updates, the action's `update` hook fires and recomputes the clip-path. No component re-render.

### Composition with other actions

Actions compose naturally — you can stack multiple directives on the same element:

```svelte
<script>
  import { squircle } from "@squircle-js/svelte";
  import { fade } from "svelte/transition";
</script>

<div
  use:squircle={{ cornerRadius: 20 }}
  transition:fade
  class="bg-violet-500 p-6"
>
  Fades in with a squircle clip-path
</div>
```

## Comparison: component vs action

| | `<Squircle>` component | `use:squircle` action |
|---|---|---|
| DOM nodes | 1 extra `<div>` wrapper | 0 (clip-path on the element itself) |
| Target element | Always `<div>` | Any element |
| Needs `overflow-hidden` | Often yes | No — clip-path clips contents |
| When to use | Wrapping arbitrary content | Clipping a specific `<button>`, `<img>`, `<a>`, etc. |

## Fallback behavior

If the browser doesn't support `ResizeObserver`, the action applies a one-time measurement on mount (using `offsetWidth` / `offsetHeight` or `defaultWidth` / `defaultHeight`) and skips the observer. The clip-path won't update on resize, but the initial shape is still applied.
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-action.mdx
git commit -m "docs(web): add svelte action page"
```

---

## Task 17: Docs — Corner smoothing

**Files:**
- Create: `apps/web/content/docs/svelte-corner-smoothing.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "Corner Smoothing Explained"
description: "Understand what cornerSmoothing values mean in @squircle-js/svelte, from 0 (standard border-radius) to 0.6 (iOS-like) to 1 (maximum smoothing)."
keywords: ["svelte corner smoothing", "svelte squircle smoothing", "cornerSmoothing svelte"]
slug: "svelte-corner-smoothing"
order: 5
group: "svelte"
---

## What is corner smoothing?

The `cornerSmoothing` prop controls how much the corner curve extends beyond the strict arc that CSS `border-radius` would produce. It ranges from `0` to `1`.

At `0`, the squircle path is mathematically equivalent to `border-radius` — circular arcs that meet the straight edges at a tangent point. At `1`, the curve flows smoothly from the corner all the way to the midpoint of each side, producing the continuous superellipse shape used in iOS app icons.

The values are identical across all `@squircle-js/*` packages — this is a property of the underlying `figma-squircle` path algorithm, not of the framework bindings.

## Values explained

### 0 — Standard border-radius

```svelte
<Squircle cornerRadius={24} cornerSmoothing={0} class="w-32 h-32 bg-gray-800" />
```

Equivalent to `border-radius: 24px`. The transition from the straight edge to the corner arc is abrupt at the tangent point. Use this if you want the squircle path API but no visible difference from plain CSS.

### 0.6 — iOS style (default)

```svelte
<Squircle cornerRadius={24} cornerSmoothing={0.6} class="w-32 h-32 bg-gray-800" />
```

The default. Matches the smoothing Apple uses for iOS app icons and system UI. The curve begins extending onto the straight edge, creating a softer, more refined look. Most visible at larger `cornerRadius` values.

### 1 — Maximum smoothing

```svelte
<Squircle cornerRadius={24} cornerSmoothing={1} class="w-32 h-32 bg-gray-800" />
```

The curve flows from each corner to the midpoint of every side. The "squircle" in its purest form. Use for decorative shapes or when you want a distinctly smooth aesthetic.

## Recommendations

| Use case | Suggested value |
|---|---|
| App icons, iOS-style UI | `0.6` |
| Subtle softening of cards/buttons | `0.4` – `0.6` |
| Decorative shapes, illustrations | `0.8` – `1` |
| Matching plain CSS border-radius | `0` |

## How it interacts with cornerRadius

`cornerSmoothing` only extends as far as the midpoint of each side. On a small element with a large radius, a high smoothing value will look similar to a lower one because there's no room for the curve to extend further. On a large element, the effect is pronounced.

```svelte
<!-- Small element — smoothing differences are subtle -->
<Squircle cornerRadius={8} cornerSmoothing={1} class="w-10 h-10 bg-slate-600" />

<!-- Large element — smoothing differences are very visible -->
<Squircle cornerRadius={32} cornerSmoothing={1} class="w-64 h-64 bg-slate-600" />
```

## Fractional values

Any value between `0` and `1` is valid:

```svelte
<Squircle cornerRadius={20} cornerSmoothing={0.8} class="w-32 h-32 bg-violet-500" />
```

The interpolation is smooth and continuous — tune to match your design system exactly.

## Using a rune to tune smoothing

Svelte 5's `$state` rune lets you bind `cornerSmoothing` to a reactive value:

```svelte
<script>
  import { Squircle } from "@squircle-js/svelte";

  let smoothing = $state(0.6);
</script>

<div class="flex flex-col gap-4">
  <input type="range" min="0" max="1" step="0.05" bind:value={smoothing} />
  <Squircle
    cornerRadius={32}
    cornerSmoothing={smoothing}
    class="w-48 h-48 bg-violet-500"
  />
</div>
```

Only the `clip-path` style recomputes — no component re-render.
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-corner-smoothing.mdx
git commit -m "docs(web): add svelte corner-smoothing page"
```

---

## Task 18: Docs — No-JavaScript fallback

**Files:**
- Create: `apps/web/content/docs/svelte-no-javascript-fallback.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "No-JavaScript Fallback"
description: "How SquircleNoScript provides graceful degradation in @squircle-js/svelte when JavaScript is disabled, using CSS border-radius as a fallback."
keywords: ["svelte squircle noscript", "svelte squircle ssr", "svelte squircle fallback", "sveltekit ssr"]
slug: "svelte-no-javascript-fallback"
order: 6
group: "svelte"
---

## The problem

`@squircle-js/svelte` relies on JavaScript to measure element dimensions (via `ResizeObserver`) and compute the SVG clip-path. When JavaScript is disabled or hasn't loaded yet, the element will have no `clip-path` applied, leaving it unstyled.

To handle this gracefully, the package ships `SquircleNoScript`.

## How SquircleNoScript works

`SquircleNoScript` renders a `<noscript>` block into the document `<head>` containing a CSS rule:

```css
[data-squircle] {
  clip-path: none !important;
  border-radius: attr(data-squircle) !important;
}
```

Every `Squircle` (or element with `use:squircle`) writes the `cornerRadius` value to a `data-squircle` attribute. When JavaScript is disabled, the browser applies the noscript CSS, which:

1. Removes the (non-functional) clip-path
2. Falls back to standard `border-radius` using the radius stored in `data-squircle`

The result is a rounded element that looks correct even without JavaScript — not a perfect squircle, but a clean, rounded shape that matches the intended `cornerRadius`.

## Setup in SvelteKit

Add `SquircleNoScript` once in your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { SquircleNoScript } from "@squircle-js/svelte";
</script>

<SquircleNoScript />

<slot />
```

Because `SquircleNoScript` uses `<svelte:head>` internally, the `<noscript>` block lands in the document `<head>` where it belongs. It only renders inside a `<noscript>` tag, so it has zero impact on JavaScript-enabled users.

No other configuration is needed. All `Squircle` components and `use:squircle` elements on the page automatically benefit from the fallback.

## SSR considerations

During server-side rendering, the clip-path is not yet computed — actions only run on the client in Svelte. This means there is a brief window on first paint where a `Squircle` element may appear without a clip-path, particularly when neither `defaultWidth` / `defaultHeight` nor explicit `width` / `height` are provided.

To minimise this:

- **Prefer `StaticSquircle`** for elements with fixed dimensions — the clip-path is emitted in the SSR HTML.

  Wait — note that `StaticSquircle` also relies on an action (`use:staticSquircle`) to apply the clip-path, and actions run only on the client. However, its output is stable and hydrates without a layout shift. For the absolute best SSR behavior, you can also apply the initial clip-path via an inline `style` attribute yourself.
- **Provide `defaultWidth` and `defaultHeight`** to dynamic `Squircle` instances when you know a reasonable starting size.

## What users see

| Scenario | Visual result |
|---|---|
| JavaScript enabled | Full squircle clip-path |
| JavaScript disabled, `SquircleNoScript` present | Rounded corners via `border-radius` |
| JavaScript disabled, no `SquircleNoScript` | Square element (no rounding) |
| SSR, before hydration, with `defaultWidth` / `defaultHeight` | Appears square briefly, then clip-path applies on mount |
| SSR, before hydration, without defaults | Square element until hydration |

## Progressive enhancement checklist

- Include `<SquircleNoScript />` once in your `+layout.svelte`
- Prefer `StaticSquircle` for any element whose size is known at authoring time
- Pass `defaultWidth` / `defaultHeight` to dynamic `Squircle` instances when possible
- Treat the squircle shape as a visual polish, not a structural guarantee — content should remain readable without it
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-no-javascript-fallback.mdx
git commit -m "docs(web): add svelte no-javascript-fallback page"
```

---

## Task 19: Docs — Examples & Recipes

**Files:**
- Create: `apps/web/content/docs/svelte-examples.mdx`

- [ ] **Step 1: Write the page**

````mdx
---
title: "Examples & Recipes"
description: "Common patterns for @squircle-js/svelte: buttons, cards, avatars, image containers, and more."
keywords: ["svelte squircle examples", "svelte squircle button", "svelte squircle card", "svelte squircle avatar"]
slug: "svelte-examples"
order: 7
group: "svelte"
---

## Button

Use the `use:squircle` action to render a button with no wrapper element:

```svelte
<script lang="ts">
  import { squircle } from "@squircle-js/svelte";

  let { onclick, children } = $props<{
    onclick?: () => void;
    children: import("svelte").Snippet;
  }>();
</script>

<button
  type="button"
  {onclick}
  use:squircle={{ cornerRadius: 12, cornerSmoothing: 0.6 }}
  class="bg-indigo-600 px-5 py-2.5 text-white font-semibold text-sm"
>
  {@render children()}
</button>
```

## Card

A card with responsive width — the `Squircle` component measures itself:

```svelte
<script lang="ts">
  import { Squircle } from "@squircle-js/svelte";

  let { title, body } = $props<{ title: string; body: string }>();
</script>

<Squircle
  cornerRadius={20}
  cornerSmoothing={0.6}
  class="bg-white shadow-md p-6 space-y-2"
>
  <h3 class="font-semibold text-lg">{title}</h3>
  <p class="text-gray-600 text-sm">{body}</p>
</Squircle>
```

## Avatar

Fixed-size avatars are a perfect use case for `use:staticSquircle`:

```svelte
<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { src, alt, size = 48 } = $props<{
    src: string;
    alt: string;
    size?: number;
  }>();
</script>

<img
  {src}
  {alt}
  use:staticSquircle={{
    width: size,
    height: size,
    cornerRadius: Math.round(size * 0.25),
    cornerSmoothing: 0.6,
  }}
  class="object-cover shrink-0"
/>
```

## Image container

Clip a hero image with a large squircle radius:

```svelte
<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { src, alt } = $props<{ src: string; alt: string }>();
</script>

<img
  {src}
  {alt}
  use:staticSquircle={{
    width: 600,
    height: 400,
    cornerRadius: 32,
    cornerSmoothing: 0.8,
  }}
  class="object-cover"
/>
```

## App icon

Replicate the iOS app icon shape exactly:

```svelte
<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { src, name } = $props<{ src: string; name: string }>();
</script>

<div class="flex flex-col items-center gap-1.5">
  <img
    {src}
    alt={name}
    use:staticSquircle={{
      width: 60,
      height: 60,
      cornerRadius: 13,
      cornerSmoothing: 0.6,
    }}
  />
  <span class="text-xs text-gray-700">{name}</span>
</div>
```

## Notification badge

Small squircle badges with dynamic content:

```svelte
<script lang="ts">
  import { Squircle } from "@squircle-js/svelte";

  let { count } = $props<{ count: number }>();
</script>

<Squircle
  cornerRadius={6}
  cornerSmoothing={0.6}
  class="bg-red-500 px-1.5 py-0.5 text-white text-xs font-bold min-w-[20px] text-center"
>
  {count}
</Squircle>
```

## Icon button

Equal-width-and-height buttons benefit from `use:staticSquircle`:

```svelte
<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  let { label, onclick, children } = $props<{
    label: string;
    onclick?: () => void;
    children: import("svelte").Snippet;
  }>();
</script>

<button
  type="button"
  aria-label={label}
  {onclick}
  use:staticSquircle={{
    width: 40,
    height: 40,
    cornerRadius: 10,
    cornerSmoothing: 0.6,
  }}
  class="bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
>
  {@render children()}
</button>
```

## Reactive squircle

Driving `cornerRadius` from a `$state` rune — Svelte's fine-grained reactivity only recomputes the `clip-path`:

```svelte
<script>
  import { Squircle } from "@squircle-js/svelte";

  let radius = $state(16);
</script>

<div class="flex items-center gap-4">
  <input type="range" min="0" max="64" bind:value={radius} />
  <Squircle cornerRadius={radius} class="w-32 h-32 bg-emerald-500" />
</div>
```

## List of squircles

`{#each}` is Svelte's idiomatic list primitive — each item is keyed automatically when you provide a key expression:

```svelte
<script lang="ts">
  import { staticSquircle } from "@squircle-js/svelte";

  type Tag = { id: string; label: string };

  let { tags } = $props<{ tags: Tag[] }>();
</script>

<div class="flex flex-wrap gap-2">
  {#each tags as tag (tag.id)}
    <div
      use:staticSquircle={{
        width: 80,
        height: 28,
        cornerRadius: 8,
        cornerSmoothing: 0.6,
      }}
      class="bg-sky-100 text-sky-800 text-xs font-medium flex items-center justify-center"
    >
      {tag.label}
    </div>
  {/each}
</div>
```
````

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/svelte-examples.mdx
git commit -m "docs(web): add svelte examples page"
```

---

## Task 20: Update docs sidebar to include Svelte group

**Files:**
- Modify: `apps/web/components/docs-sidebar.tsx`

- [ ] **Step 1: Update `GROUP_ORDER` and `GROUP_LABELS`**

In `apps/web/components/docs-sidebar.tsx`, change:

```tsx
const GROUP_ORDER = ["react", "solid"];
const GROUP_LABELS: Record<string, string> = {
  react: "React",
  solid: "Solid",
};
```

to:

```tsx
const GROUP_ORDER = ["react", "solid", "svelte"];
const GROUP_LABELS: Record<string, string> = {
  react: "React",
  solid: "Solid",
  svelte: "Svelte",
};
```

- [ ] **Step 2: Run the web dev server and verify**

```bash
pnpm dev:next
```

Then visit `http://localhost:3000/docs/svelte-getting-started` — the sidebar should show "React", "Solid", "Svelte" sections in that order, with all 7 Svelte pages listed under "Svelte".

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/docs-sidebar.tsx
git commit -m "docs(web): add svelte group to sidebar ordering"
```

---

## Task 21: Full build + lint + typecheck + test sweep

- [ ] **Step 1: Build all packages**

```bash
pnpm build
```

Expected: all packages build, including `@squircle-js/svelte` producing `packages/svelte/dist/`. Clean up any orphaned workers per `CLAUDE.md`:

```bash
pkill -9 -f "jest-worker/processChild" || true
```

- [ ] **Step 2: Typecheck everything**

```bash
pnpm typecheck
```

Expected: no errors across the workspace.

- [ ] **Step 3: Run tests**

```bash
pnpm test
```

Expected: Solid test passes, Svelte test passes.

- [ ] **Step 4: Lint + format check**

```bash
pnpm check
```

If errors appear, run:

```bash
pnpm fix
```

Re-run `pnpm check` to confirm clean.

- [ ] **Step 5: Commit any formatting fixes**

```bash
git add -A
git commit -m "chore: apply biome formatter after svelte package additions" || true
```

(Empty commit prevention: if nothing changed, this is a no-op via `|| true`.)

---

## Task 22: Push branch

- [ ] **Step 1: Push to remote**

```bash
git push origin main
```

Expected: all commits from this plan are pushed. The Changesets release workflow should pick up `.changeset/svelte-package.md` and open (or update) the version-bump PR.

---

## Self-review checklist

After the plan is complete, confirm:

- [ ] `packages/svelte/dist/` contains `.svelte`, `.js`, `.d.ts` files for each component and action
- [ ] `@squircle-js/svelte` appears in `pnpm-lock.yaml` as a workspace package
- [ ] `pnpm -F @squircle-js/svelte test` passes
- [ ] `pnpm -F @squircle-js/svelte typecheck` passes
- [ ] `pnpm -F @squircle-js/svelte build` produces `dist/`
- [ ] Docs sidebar on http://localhost:3000/docs shows a "Svelte" section with 7 pages
- [ ] All pages load without 404
- [ ] README (root + package) mention Svelte
- [ ] Changeset file exists for `@squircle-js/svelte`
