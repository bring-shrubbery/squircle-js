# `@squircle-js/solid` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `@squircle-js/solid` package that mirrors `@squircle-js/react`'s API in idiomatic Solid.js, auto-published by the existing Changesets release workflow.

**Architecture:** New `packages/solid/` workspace package. Components use `@solid-primitives/resize-observer` for sizing, `createMemo` for path computation, and a local `polymorphic.tsx` helper for `asChild`. SSR-safe by virtue of `onMount`-scoped observer setup. Build via `tsup` + `tsup-preset-solid`. Smoke test via Vitest + `@solidjs/testing-library`. Release workflow stops copying root README into the React package; both packages get checked-in per-package READMEs instead.

**Tech Stack:** Solid.js 1.8+, `@solid-primitives/resize-observer`, `figma-squircle`, tsup + `tsup-preset-solid`, Vitest + `@solidjs/testing-library` + `vite-plugin-solid` + `jsdom`, Changesets, pnpm workspaces, Turbo.

**Spec:** [`docs/superpowers/specs/2026-04-19-solid-package-design.md`](../specs/2026-04-19-solid-package-design.md)

---

## Task 1: Add shared `solid-library.json` tsconfig preset

**Files:**
- Create: `tooling/typescript/solid-library.json`

- [ ] **Step 1: Create the tsconfig preset**

Create `tooling/typescript/solid-library.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Solid Library",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2015", "DOM"],
    "module": "ESNext",
    "target": "ES2020",
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tooling/typescript/solid-library.json
git commit -m "feat(tooling): add solid-library tsconfig preset"
```

---

## Task 2: Scaffold `packages/solid` package

**Files:**
- Create: `packages/solid/package.json`
- Create: `packages/solid/tsconfig.json`
- Create: `packages/solid/tsup.config.ts`
- Create: `packages/solid/src/index.tsx`
- Create: `packages/solid/.gitignore`

- [ ] **Step 1: Create `packages/solid/package.json`**

```json
{
  "name": "@squircle-js/solid",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "solid": "./dist/index.jsx",
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf .turbo dist node_modules",
    "typecheck": "tsc --noEmit --emitDeclarationOnly false",
    "test": "vitest run"
  },
  "dependencies": {
    "@solid-primitives/resize-observer": "^2.0.26",
    "figma-squircle": "1.1.0"
  },
  "devDependencies": {
    "@solidjs/testing-library": "^0.8.10",
    "@squircle-js/tsconfig": "workspace:*",
    "jsdom": "^25.0.1",
    "solid-js": "^1.9.0",
    "tsup": "catalog:",
    "tsup-preset-solid": "^2.2.0",
    "typescript": "catalog:",
    "vite-plugin-solid": "^2.11.0",
    "vitest": "^2.1.0"
  },
  "peerDependencies": {
    "solid-js": "^1.8"
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

- [ ] **Step 2: Create `packages/solid/tsconfig.json`**

```json
{
  "extends": "@squircle-js/tsconfig/solid-library.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist",
    "declaration": true,
    "noImplicitAny": false,
    "strictNullChecks": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

- [ ] **Step 3: Create `packages/solid/tsup.config.ts`**

```ts
import { defineConfig } from "tsup";
import * as preset from "tsup-preset-solid";

const presetOptions: preset.PresetOptions = {
  entries: {
    entry: "src/index.tsx",
  },
  drop_console: false,
  cjs: true,
};

export default defineConfig((config) => {
  const watching = !!config.watch;
  const parsed = preset.parsePresetOptions(presetOptions, watching);

  return preset.generateTsupOptions(parsed);
});
```

- [ ] **Step 4: Create placeholder `packages/solid/src/index.tsx`**

```tsx
export {};
```

- [ ] **Step 5: Create `packages/solid/.gitignore`**

```
dist
node_modules
.turbo
```

- [ ] **Step 6: Commit the scaffold**

```bash
git add packages/solid
git commit -m "feat(solid): scaffold @squircle-js/solid package"
```

---

## Task 3: Install dependencies and verify empty package builds

**Files:** none modified directly; `pnpm-lock.yaml` will be updated.

- [ ] **Step 1: Install workspace dependencies**

```bash
pnpm install
```

Expected: pnpm resolves and installs `@squircle-js/solid` dependencies including `solid-js`, `@solid-primitives/resize-observer`, `tsup-preset-solid`, `vitest`, `@solidjs/testing-library`, `vite-plugin-solid`, `jsdom`.

- [ ] **Step 2: Verify the package typechecks**

```bash
pnpm --filter @squircle-js/solid typecheck
```

Expected: exit 0 (empty exports pass trivially).

- [ ] **Step 3: Verify the package builds**

```bash
pnpm --filter @squircle-js/solid build
```

Expected: exit 0; `packages/solid/dist/` contains `index.js`, `index.mjs`, `index.d.ts` (even with an empty export).

- [ ] **Step 4: Clean up zombie Next.js workers (per CLAUDE.md)**

```bash
pkill -9 -f "jest-worker/processChild" || true
```

- [ ] **Step 5: Commit lockfile if changed**

```bash
git add pnpm-lock.yaml
git commit -m "chore: update lockfile for @squircle-js/solid"
```

If `pnpm-lock.yaml` is unchanged, skip the commit.

---

## Task 4: Implement `SquircleNoScript`

**Files:**
- Create: `packages/solid/src/SquircleNoScript.tsx`
- Modify: `packages/solid/src/index.tsx`

- [ ] **Step 1: Implement the component**

Create `packages/solid/src/SquircleNoScript.tsx`:

```tsx
export const SquircleNoScript = () => {
  return (
    <noscript>
      <style type="text/css">
        {
          "[data-squircle] { clip-path: none !important; border-radius: attr(data-squircle) !important; }"
        }
      </style>
    </noscript>
  );
};
```

- [ ] **Step 2: Export from barrel**

Replace the contents of `packages/solid/src/index.tsx` with:

```tsx
export { SquircleNoScript } from "./SquircleNoScript";
```

- [ ] **Step 3: Verify typecheck and build**

Run:
```bash
pnpm --filter @squircle-js/solid typecheck && pnpm --filter @squircle-js/solid build
```
Expected: exit 0 for both.

- [ ] **Step 4: Commit**

```bash
git add packages/solid/src
git commit -m "feat(solid): add SquircleNoScript component"
```

---

## Task 5: Implement `polymorphic` / `asChild` helper

**Files:**
- Create: `packages/solid/src/polymorphic.tsx`

- [ ] **Step 1: Implement the helper**

Create `packages/solid/src/polymorphic.tsx`:

```tsx
import { children, type JSX } from "solid-js";
import { spread } from "solid-js/web";

export type PolymorphicProps = Record<string, unknown>;

/**
 * Resolves `getChildren` and, if it yields exactly one DOM element,
 * applies `props` to that element via `spread` and returns it.
 * Returns `null` if the resolved value is not a single Element —
 * callers should fall back to rendering a wrapping element themselves.
 */
export function renderAsChild(
  getChildren: () => JSX.Element,
  props: PolymorphicProps
): Element | null {
  const resolved = children(getChildren);
  const node = resolved();

  if (Array.isArray(node)) {
    return null;
  }
  if (node instanceof Element) {
    spread(node, props, false, true);
    return node;
  }
  return null;
}
```

- [ ] **Step 2: Verify typecheck**

```bash
pnpm --filter @squircle-js/solid typecheck
```

Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add packages/solid/src/polymorphic.tsx
git commit -m "feat(solid): add polymorphic asChild helper"
```

---

## Task 6: Implement `StaticSquircle`

**Files:**
- Create: `packages/solid/src/StaticSquircle.tsx`
- Modify: `packages/solid/src/index.tsx`

- [ ] **Step 1: Implement the component**

Create `packages/solid/src/StaticSquircle.tsx`:

```tsx
import { getSvgPath } from "figma-squircle";
import { createMemo, mergeProps, splitProps, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";

import { renderAsChild } from "./polymorphic";

export interface StaticSquircleProps {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
  asChild?: boolean;
  children?: JSX.Element;
  style?: JSX.CSSProperties | string;
}

export function StaticSquircle(
  rawProps: StaticSquircleProps &
    Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof StaticSquircleProps>
) {
  const [local, others] = splitProps(rawProps, [
    "asChild",
    "width",
    "height",
    "cornerRadius",
    "cornerSmoothing",
    "children",
    "style",
  ]);

  const path = createMemo(() =>
    getSvgPath({
      width: local.width,
      height: local.height,
      cornerRadius: local.cornerRadius,
      cornerSmoothing: local.cornerSmoothing,
    })
  );

  const mergedStyle = createMemo<JSX.CSSProperties>(() => {
    const extraStyle =
      typeof local.style === "object" && local.style !== null ? local.style : {};
    return {
      ...extraStyle,
      "clip-path": `path('${path()}')`,
    };
  });

  const elementProps = mergeProps(others, {
    get style() {
      return mergedStyle();
    },
    get children() {
      return local.children;
    },
  });

  if (local.asChild) {
    const rendered = renderAsChild(() => local.children, elementProps);
    if (rendered) return rendered;
  }

  return <Dynamic component="div" {...elementProps} />;
}
```

- [ ] **Step 2: Export from barrel**

Update `packages/solid/src/index.tsx`:

```tsx
export { SquircleNoScript } from "./SquircleNoScript";
export { StaticSquircle, type StaticSquircleProps } from "./StaticSquircle";
```

- [ ] **Step 3: Verify typecheck and build**

```bash
pnpm --filter @squircle-js/solid typecheck && pnpm --filter @squircle-js/solid build
```

Expected: exit 0 for both.

- [ ] **Step 4: Commit**

```bash
git add packages/solid/src
git commit -m "feat(solid): add StaticSquircle component"
```

---

## Task 7: Add Vitest configuration

**Files:**
- Create: `packages/solid/vitest.config.ts`

- [ ] **Step 1: Create the vitest config**

Create `packages/solid/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
```

- [ ] **Step 2: Sanity-check vitest starts**

```bash
pnpm --filter @squircle-js/solid test
```

Expected: exit 0 with a "No test files found" message (no tests exist yet — that's fine for this step).

- [ ] **Step 3: Commit**

```bash
git add packages/solid/vitest.config.ts
git commit -m "chore(solid): add vitest config"
```

---

## Task 8: Write failing smoke test for `Squircle`

**Files:**
- Create: `packages/solid/src/Squircle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `packages/solid/src/Squircle.test.tsx`:

```tsx
import { render } from "@solidjs/testing-library";
import { describe, expect, test } from "vitest";

import { Squircle } from "./Squircle";

describe("Squircle", () => {
  test("renders a div with data-squircle and a path() clip-path", () => {
    const { container } = render(() => (
      <Squircle cornerRadius={16} defaultWidth={100} defaultHeight={100}>
        <span>content</span>
      </Squircle>
    ));

    const el = container.firstElementChild as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.tagName).toBe("DIV");
    expect(el.getAttribute("data-squircle")).toBe("16");
    expect(el.style.clipPath.startsWith("path(")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
pnpm --filter @squircle-js/solid test
```

Expected: FAIL — `Squircle` does not exist yet (import resolution error).

- [ ] **Step 3: Commit the failing test**

```bash
git add packages/solid/src/Squircle.test.tsx
git commit -m "test(solid): add failing smoke test for Squircle"
```

---

## Task 9: Implement `Squircle`

**Files:**
- Create: `packages/solid/src/Squircle.tsx`
- Modify: `packages/solid/src/index.tsx`

- [ ] **Step 1: Implement the component**

Create `packages/solid/src/Squircle.tsx`:

```tsx
import { createElementSize } from "@solid-primitives/resize-observer";
import { getSvgPath } from "figma-squircle";
import {
  createMemo,
  createSignal,
  mergeProps,
  splitProps,
  type JSX,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import { renderAsChild } from "./polymorphic";

export interface SquircleProps {
  cornerRadius?: number;
  cornerSmoothing?: number;
  asChild?: boolean;
  children?: JSX.Element;

  width?: number;
  height?: number;

  defaultWidth?: number;
  defaultHeight?: number;

  style?: JSX.CSSProperties | string;
}

export function Squircle(
  rawProps: SquircleProps &
    Omit<JSX.HTMLAttributes<HTMLDivElement>, keyof SquircleProps>
) {
  const props = mergeProps({ cornerSmoothing: 0.6 }, rawProps);

  const [local, others] = splitProps(props, [
    "cornerRadius",
    "cornerSmoothing",
    "asChild",
    "children",
    "width",
    "height",
    "defaultWidth",
    "defaultHeight",
    "style",
  ]);

  const [ref, setRef] = createSignal<HTMLElement | null>(null);
  const observedSize = createElementSize(ref);

  const measuredWidth = () =>
    observedSize.width ?? local.defaultWidth ?? 0;
  const measuredHeight = () =>
    observedSize.height ?? local.defaultHeight ?? 0;

  const actualWidth = () => local.width ?? measuredWidth();
  const actualHeight = () => local.height ?? measuredHeight();

  const path = createMemo(() => {
    const w = actualWidth();
    const h = actualHeight();
    if (w === 0 || h === 0) return "";
    return getSvgPath({
      width: w,
      height: h,
      cornerRadius: local.cornerRadius,
      cornerSmoothing: local.cornerSmoothing,
    });
  });

  const mergedStyle = createMemo<JSX.CSSProperties>(() => {
    const extraStyle =
      typeof local.style === "object" && local.style !== null ? local.style : {};
    const p = path();
    return {
      ...extraStyle,
      "border-radius":
        local.cornerRadius !== undefined ? `${local.cornerRadius}px` : undefined,
      width: local.width ?? local.defaultWidth,
      height: local.height ?? local.defaultHeight,
      "clip-path": p ? `path('${p}')` : undefined,
    };
  });

  const elementProps = mergeProps(others, {
    ref: setRef,
    get "data-squircle"() {
      return local.cornerRadius;
    },
    get style() {
      return mergedStyle();
    },
    get children() {
      return local.children;
    },
  });

  if (local.asChild) {
    const rendered = renderAsChild(() => local.children, elementProps);
    if (rendered) return rendered;
  }

  return <Dynamic component="div" {...elementProps} />;
}
```

- [ ] **Step 2: Export from barrel**

Update `packages/solid/src/index.tsx`:

```tsx
export { Squircle, type SquircleProps } from "./Squircle";
export { SquircleNoScript } from "./SquircleNoScript";
export { StaticSquircle, type StaticSquircleProps } from "./StaticSquircle";
```

- [ ] **Step 3: Run the smoke test to confirm it passes**

```bash
pnpm --filter @squircle-js/solid test
```

Expected: PASS — the rendered element has `data-squircle="16"` and a `clip-path` style starting with `path(`.

- [ ] **Step 4: Verify typecheck and build**

```bash
pnpm --filter @squircle-js/solid typecheck && pnpm --filter @squircle-js/solid build
```

Expected: exit 0 for both. `packages/solid/dist/` should contain `index.js`, `index.mjs`, `index.d.ts`.

- [ ] **Step 5: Clean up zombie workers**

```bash
pkill -9 -f "jest-worker/processChild" || true
```

- [ ] **Step 6: Commit**

```bash
git add packages/solid/src
git commit -m "feat(solid): add dynamic Squircle component"
```

---

## Task 10: Add `packages/solid/README.md`

**Files:**
- Create: `packages/solid/README.md`

- [ ] **Step 1: Write the Solid-specific README**

Create `packages/solid/README.md`:

````markdown
# @squircle-js/solid

iOS-style squircle (smooth rounded corners) for [Solid.js](https://solidjs.com/).

Built on [`figma-squircle`](https://github.com/phamfoo/figma-squircle) — generates an SVG path and applies it as a CSS `clip-path`.

## Install

```bash
pnpm add @squircle-js/solid
# or
npm install @squircle-js/solid
# or
yarn add @squircle-js/solid
```

## Usage

```tsx
import { Squircle } from "@squircle-js/solid";

export default function App() {
  return (
    <Squircle cornerRadius={16} class="bg-blue-500 w-32 h-32">
      <p>Hello</p>
    </Squircle>
  );
}
```

### `StaticSquircle` — for known dimensions

```tsx
import { StaticSquircle } from "@squircle-js/solid";

<StaticSquircle
  width={200}
  height={120}
  cornerRadius={24}
  cornerSmoothing={0.6}
/>;
```

### `SquircleNoScript` — fallback for disabled JS

Mount once near the root of your app:

```tsx
import { SquircleNoScript } from "@squircle-js/solid";

<SquircleNoScript />;
```

### `asChild` — apply the squircle to a child element

```tsx
<Squircle cornerRadius={24} asChild>
  <section class="card">Content</section>
</Squircle>
```

## SSR

SSR-safe out of the box — works with SolidStart. The `ResizeObserver` is set up on mount; on the server the component renders using `defaultWidth` / `defaultHeight` (or no `clip-path` if neither is provided), and the real size is picked up on hydration.

## Props

### `<Squircle>`

| Prop              | Type      | Default | Description                              |
| ----------------- | --------- | ------- | ---------------------------------------- |
| `cornerRadius`    | `number`  | —       | Corner radius in pixels                  |
| `cornerSmoothing` | `number`  | `0.6`   | Smoothing intensity, `0`–`1`             |
| `width`           | `number`  | —       | Override measured width                  |
| `height`          | `number`  | —       | Override measured height                 |
| `defaultWidth`    | `number`  | —       | Width used before first measurement / on SSR |
| `defaultHeight`   | `number`  | —       | Height used before first measurement / on SSR |
| `asChild`         | `boolean` | `false` | Apply styles to the child element instead of a wrapping `<div>` |

Plus any standard `div` HTML attributes.

## License

MIT
````

- [ ] **Step 2: Commit**

```bash
git add packages/solid/README.md
git commit -m "docs(solid): add package README"
```

---

## Task 11: Create `packages/squircle-element-react/README.md` and update root README

**Files:**
- Create: `packages/squircle-element-react/README.md`
- Modify: `README.md`

- [ ] **Step 1: Create the React package README**

Create `packages/squircle-element-react/README.md` with a React-specific README. Copy the current root `README.md` verbatim, then on line 27 change `🚀 Available for React (with \`react@18\` support), with other frameworks coming later.` to read:

```
🚀 For React (supports `react@16.8+`). Also available for Solid via [`@squircle-js/solid`](https://www.npmjs.com/package/@squircle-js/solid).
```

Leave every other line of that file identical to the current root README so the npm listing keeps the same content it has today.

- [ ] **Step 2: Add a "Framework support" section to the root README**

In `README.md`, replace the "Usage" section heading and its "With React" subsection with one that lists both frameworks. Starting from the current line `## Usage`, replace through the end of the React usage example (current line 93, the closing `...`) with:

````markdown
## Framework support

| Package | npm | Framework |
| --- | --- | --- |
| [`@squircle-js/react`](./packages/squircle-element-react) | [`@squircle-js/react`](https://www.npmjs.com/package/@squircle-js/react) | React 16.8+ |
| [`@squircle-js/solid`](./packages/solid) | [`@squircle-js/solid`](https://www.npmjs.com/package/@squircle-js/solid) | Solid 1.8+ |

## Usage

### With React

#### Step 1

Star this repo ❤️ and follow [Antoni](https://x.com/bringshrubberyy)

#### Step 2

Install the package

```bash
pnpm add @squircle-js/react
```

#### Step 3

Add to your project

```tsx
import { Squircle } from "@squircle-js/react";

const YourComponent = () => {
  return (
    <Squircle
      cornerRadius={10}
      cornerSmoothing={1}
      className="bg-black p-4 text-white"
    >
      Squircle!
    </Squircle>
  );
};
```

Also, add a global component to ensure it still works when JavaScript is disabled.

```tsx
// _app.tsx, or root-level layout.tsx
import { SquircleNoScript } from "@squircle-js/react";

...
<SquircleNoScript />
...
```

### With Solid

```bash
pnpm add @squircle-js/solid
```

```tsx
import { Squircle } from "@squircle-js/solid";

export default function App() {
  return (
    <Squircle cornerRadius={10} cornerSmoothing={1} class="bg-black p-4 text-white">
      Squircle!
    </Squircle>
  );
}
```

See the [package README](./packages/solid/README.md) for the full Solid API.
````

- [ ] **Step 3: Commit**

```bash
git add README.md packages/squircle-element-react/README.md
git commit -m "docs: add per-package READMEs and list Solid in root README"
```

---

## Task 12: Remove README-copy step from release workflow

**Files:**
- Modify: `.github/workflows/release.yml`

- [ ] **Step 1: Remove the README copy step**

Delete these two lines from `.github/workflows/release.yml` (currently lines 69–70):

```yaml
      - name: Move README into place
        run: cp README.md packages/squircle-element-react/README.md
```

The resulting `release` job flows directly from the "Pre-publish requirements" step into the `changesets/action@v1` step.

- [ ] **Step 2: Verify the YAML parses**

```bash
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/release.yml')); print('OK')"
```

Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: drop README copy step now that packages have checked-in READMEs"
```

---

## Task 13: Add root `test` script and Turbo `test` task

**Files:**
- Modify: `package.json`
- Modify: `turbo.json`

- [ ] **Step 1: Add `test` script to root `package.json`**

In `package.json`, add `"test": "turbo run test"` to the `scripts` object. The scripts block should include (alongside existing scripts):

```json
    "test": "turbo run test",
```

- [ ] **Step 2: Add `test` task to `turbo.json`**

In `turbo.json`, add a `test` task under `tasks` (alongside existing `build`, `dev`, `typecheck`, etc.):

```json
    "test": {
      "dependsOn": ["^topo", "^build"],
      "outputs": []
    },
```

- [ ] **Step 3: Verify `pnpm test` runs the Solid smoke test**

```bash
pnpm test
```

Expected: Turbo executes `test` tasks for all packages that define one; the Solid package's smoke test passes. Packages without a `test` script are skipped.

- [ ] **Step 4: Clean up zombie workers**

```bash
pkill -9 -f "jest-worker/processChild" || true
```

- [ ] **Step 5: Commit**

```bash
git add package.json turbo.json
git commit -m "chore: add test task to turbo pipeline"
```

---

## Task 14: Add Solid section to docs site

**Files:**
- Modify: `apps/web/content/docs/getting-started.mdx`

- [ ] **Step 1: Append a Solid section**

Add the following to the end of `apps/web/content/docs/getting-started.mdx`:

````mdx
## Using Solid

`@squircle-js/solid` provides the same API for [Solid.js](https://solidjs.com/).

### Installation

```bash
npm install @squircle-js/solid
```

```bash
pnpm add @squircle-js/solid
```

```bash
yarn add @squircle-js/solid
```

### Basic usage

```tsx
import { Squircle } from "@squircle-js/solid";

export default function App() {
  return (
    <Squircle cornerRadius={16} class="bg-blue-500 w-32 h-32">
      <p>Hello</p>
    </Squircle>
  );
}
```

`StaticSquircle`, `SquircleNoScript`, and `asChild` all work the same as their React counterparts — see the [package README](https://www.npmjs.com/package/@squircle-js/solid) for details. Works with SolidStart; `ResizeObserver` is set up on mount, so SSR renders use `defaultWidth` / `defaultHeight` until the client hydrates.
````

- [ ] **Step 2: Verify the docs app still typechecks**

```bash
pnpm --filter web typecheck
```

Expected: exit 0.

- [ ] **Step 3: Clean up zombie workers**

```bash
pkill -9 -f "jest-worker/processChild" || true
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/content/docs/getting-started.mdx
git commit -m "docs(web): add Solid usage section to getting started"
```

---

## Task 15: Add initial changeset for `@squircle-js/solid`

**Files:**
- Create: `.changeset/solid-initial.md`

- [ ] **Step 1: Create the changeset**

Create `.changeset/solid-initial.md`:

```markdown
---
"@squircle-js/solid": minor
---

Initial release of `@squircle-js/solid` — iOS-style squircles for Solid.js. Mirrors the `@squircle-js/react` API (`Squircle`, `StaticSquircle`, `SquircleNoScript`, `asChild`) with Solid-native primitives and SSR-safe `ResizeObserver` setup.
```

Because the package starts at `0.0.0`, a `minor` bump produces `0.1.0` on first publish.

- [ ] **Step 2: Commit**

```bash
git add .changeset/solid-initial.md
git commit -m "chore: add initial changeset for @squircle-js/solid"
```

---

## Task 16: Final monorepo verification

**Files:** none modified.

- [ ] **Step 1: Full install**

```bash
pnpm install
```

Expected: exit 0, lockfile stable.

- [ ] **Step 2: Full build**

```bash
pnpm build
```

Expected: exit 0; all packages build, including `packages/solid/dist/`.

- [ ] **Step 3: Clean up zombie workers**

```bash
pkill -9 -f "jest-worker/processChild" || true
```

- [ ] **Step 4: Full typecheck**

```bash
pnpm typecheck
```

Expected: exit 0 across all workspaces.

- [ ] **Step 5: Lint / format check**

```bash
pnpm check
```

Expected: exit 0. If Biome/ultracite reports formatting issues, run `pnpm fix`, inspect the diff, and commit as `style: apply biome formatting`.

- [ ] **Step 6: Run tests**

```bash
pnpm test
```

Expected: exit 0; the Solid smoke test passes.

- [ ] **Step 7: Confirm Changesets sees the new package**

```bash
pnpm changeset status
```

Expected: output includes `@squircle-js/solid` with a `minor` bump → `0.1.0`.

- [ ] **Step 8: Final commit if formatting changes were needed**

If Step 5 required `pnpm fix`, commit those changes now. If not, this step is a no-op.

```bash
git status
```

Expected: clean working tree.
