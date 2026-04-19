# `@squircle-js/vue` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `@squircle-js/vue` package that mirrors the React/Solid/Svelte API idiomatically in Vue 3, plus matching documentation, auto-published by the existing Changesets release workflow.

**Architecture:** New `packages/vue/` workspace package. Core logic is a shared `computeClipPath()` helper. Three primitives consume it: two composables (`useSquircle`, `useStaticSquircle`), two directives (`v-squircle`, `v-static-squircle`), and three components (`<Squircle>`, `<StaticSquircle>`, `<SquircleNoScript>`) that wrap the composables. A `SquirclePlugin` registers everything globally. Build via Vite library mode + `vite-plugin-dts`.

**Tech Stack:** Vue 3 (^3.3 Composition API + `<script setup>`), `figma-squircle`, Vite, `@vitejs/plugin-vue`, `vite-plugin-dts`, `vue-tsc`, Vitest + `@testing-library/vue` + `@vue/test-utils` + `jsdom`, Changesets, pnpm workspaces, Turbo.

**Spec:** [`docs/superpowers/specs/2026-04-19-vue-package-design.md`](../specs/2026-04-19-vue-package-design.md)

---

## Task 1: Scaffold `packages/vue` package config

**Files:**
- Create: `packages/vue/package.json`
- Create: `packages/vue/tsconfig.json`
- Create: `packages/vue/vite.config.ts`
- Create: `packages/vue/vitest.config.ts`
- Create: `packages/vue/.gitignore`

- [ ] **Step 1: Create `packages/vue/package.json`**

```json
{
  "name": "@squircle-js/vue",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "default": "./dist/index.mjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "clean": "rm -rf .turbo dist node_modules",
    "typecheck": "vue-tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "figma-squircle": "1.1.0"
  },
  "devDependencies": {
    "@squircle-js/tsconfig": "workspace:*",
    "@testing-library/vue": "^8.1.0",
    "@vitejs/plugin-vue": "^5.2.0",
    "@vue/test-utils": "^2.4.6",
    "jsdom": "^25.0.1",
    "typescript": "catalog:",
    "vite": "^5.4.0",
    "vite-plugin-dts": "^4.3.0",
    "vitest": "^2.1.0",
    "vue": "^3.3.0",
    "vue-tsc": "^2.1.0"
  },
  "peerDependencies": {
    "vue": "^3.3.0"
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

- [ ] **Step 2: Create `packages/vue/tsconfig.json`**

```json
{
  "extends": "@squircle-js/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "dist",
    "declaration": true,
    "noImplicitAny": false,
    "strictNullChecks": true,
    "types": ["vitest/globals"],
    "moduleResolution": "bundler",
    "jsx": "preserve"
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- [ ] **Step 3: Create `packages/vue/vite.config.ts`**

```ts
import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: ["src/**/*.test.ts", "src/__tests__/**"],
      rollupTypes: true,
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "SquircleJsVue",
      fileName: (format) => (format === "es" ? "index.mjs" : "index.js"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", "figma-squircle"],
      output: {
        globals: { vue: "Vue", "figma-squircle": "FigmaSquircle" },
      },
    },
  },
});
```

- [ ] **Step 4: Create `packages/vue/vitest.config.ts`**

```ts
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["node_modules", "dist"],
  },
});
```

- [ ] **Step 5: Create `packages/vue/.gitignore`**

```
.turbo
dist
node_modules
```

- [ ] **Step 6: Commit**

```bash
git add packages/vue/package.json packages/vue/tsconfig.json packages/vue/vite.config.ts packages/vue/vitest.config.ts packages/vue/.gitignore
git commit -m "feat(vue): scaffold @squircle-js/vue package config"
```

---

## Task 2: Add `computeClipPath` helper

**Files:**
- Create: `packages/vue/src/computePath.ts`

- [ ] **Step 1: Write `packages/vue/src/computePath.ts`**

```ts
import { getSvgPath } from "figma-squircle";

export interface ComputeClipPathOptions {
  width: number;
  height: number;
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export function computeClipPath(opts: ComputeClipPathOptions): string {
  if (opts.width === 0 || opts.height === 0) {
    return "";
  }
  return getSvgPath({
    width: opts.width,
    height: opts.height,
    cornerRadius: opts.cornerRadius,
    cornerSmoothing: opts.cornerSmoothing ?? 0.6,
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/computePath.ts
git commit -m "feat(vue): add computeClipPath helper"
```

---

## Task 3: Add `useSquircle` composable

**Files:**
- Create: `packages/vue/src/useSquircle.ts`

- [ ] **Step 1: Write `packages/vue/src/useSquircle.ts`**

```ts
import {
  type MaybeRefOrGetter,
  onBeforeUnmount,
  onMounted,
  type Ref,
  toValue,
  watchEffect,
} from "vue";
import { computeClipPath } from "./computePath.js";

export interface UseSquircleOptions {
  cornerRadius?: number;
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function useSquircle(
  elRef: Ref<HTMLElement | null | undefined>,
  options: MaybeRefOrGetter<UseSquircleOptions> = {},
): void {
  let observer: ResizeObserver | null = null;

  const apply = (
    node: HTMLElement,
    width: number,
    height: number,
    opts: UseSquircleOptions,
  ) => {
    const path = computeClipPath({
      width,
      height,
      cornerRadius: opts.cornerRadius,
      cornerSmoothing: opts.cornerSmoothing,
    });
    node.style.clipPath = path ? `path('${path}')` : "";
    if (opts.cornerRadius === undefined) {
      node.removeAttribute("data-squircle");
    } else {
      node.style.borderRadius = `${opts.cornerRadius}px`;
      node.setAttribute("data-squircle", String(opts.cornerRadius));
    }
    if (opts.width !== undefined) {
      node.style.width = `${opts.width}px`;
    }
    if (opts.height !== undefined) {
      node.style.height = `${opts.height}px`;
    }
  };

  const measure = (node: HTMLElement, opts: UseSquircleOptions) => {
    const w = opts.width ?? node.offsetWidth ?? opts.defaultWidth ?? 0;
    const h = opts.height ?? node.offsetHeight ?? opts.defaultHeight ?? 0;
    const effectiveW = w > 0 ? w : (opts.defaultWidth ?? 0);
    const effectiveH = h > 0 ? h : (opts.defaultHeight ?? 0);
    apply(node, effectiveW, effectiveH, opts);
  };

  onMounted(() => {
    watchEffect(() => {
      const node = elRef.value;
      if (!node) {
        return;
      }
      const opts = toValue(options);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (opts.width !== undefined && opts.height !== undefined) {
        apply(node, opts.width, opts.height, opts);
        return;
      }
      measure(node, opts);
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => measure(node, toValue(options)));
        observer.observe(node);
      }
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/useSquircle.ts
git commit -m "feat(vue): add useSquircle composable"
```

---

## Task 4: Add `useStaticSquircle` composable

**Files:**
- Create: `packages/vue/src/useStaticSquircle.ts`

- [ ] **Step 1: Write `packages/vue/src/useStaticSquircle.ts`**

```ts
import {
  type MaybeRefOrGetter,
  onMounted,
  type Ref,
  toValue,
  watchEffect,
} from "vue";
import { computeClipPath } from "./computePath.js";

export interface UseStaticSquircleOptions {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

export function useStaticSquircle(
  elRef: Ref<HTMLElement | null | undefined>,
  options: MaybeRefOrGetter<UseStaticSquircleOptions>,
): void {
  const apply = (node: HTMLElement, opts: UseStaticSquircleOptions) => {
    const path = computeClipPath({
      width: opts.width,
      height: opts.height,
      cornerRadius: opts.cornerRadius,
      cornerSmoothing: opts.cornerSmoothing,
    });
    node.style.clipPath = path ? `path('${path}')` : "";
    node.style.borderRadius = `${opts.cornerRadius}px`;
    node.setAttribute("data-squircle", String(opts.cornerRadius));
    node.style.width = `${opts.width}px`;
    node.style.height = `${opts.height}px`;
  };

  onMounted(() => {
    watchEffect(() => {
      const node = elRef.value;
      if (!node) {
        return;
      }
      apply(node, toValue(options));
    });
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/useStaticSquircle.ts
git commit -m "feat(vue): add useStaticSquircle composable"
```

---

## Task 5: Add `v-squircle` directive

**Files:**
- Create: `packages/vue/src/squircleDirective.ts`

- [ ] **Step 1: Write `packages/vue/src/squircleDirective.ts`**

```ts
import type { Directive } from "vue";
import { computeClipPath } from "./computePath.js";

export interface SquircleDirectiveOptions {
  cornerRadius?: number;
  cornerSmoothing?: number;
  width?: number;
  height?: number;
  defaultWidth?: number;
  defaultHeight?: number;
}

interface SquircleState {
  observer: ResizeObserver | null;
  opts: SquircleDirectiveOptions;
}

const state = new WeakMap<HTMLElement, SquircleState>();

function apply(
  node: HTMLElement,
  width: number,
  height: number,
  opts: SquircleDirectiveOptions,
) {
  const path = computeClipPath({
    width,
    height,
    cornerRadius: opts.cornerRadius,
    cornerSmoothing: opts.cornerSmoothing,
  });
  node.style.clipPath = path ? `path('${path}')` : "";
  if (opts.cornerRadius === undefined) {
    node.removeAttribute("data-squircle");
  } else {
    node.style.borderRadius = `${opts.cornerRadius}px`;
    node.setAttribute("data-squircle", String(opts.cornerRadius));
  }
  if (opts.width !== undefined) {
    node.style.width = `${opts.width}px`;
  }
  if (opts.height !== undefined) {
    node.style.height = `${opts.height}px`;
  }
}

function measure(node: HTMLElement, opts: SquircleDirectiveOptions) {
  const w = opts.width ?? node.offsetWidth ?? opts.defaultWidth ?? 0;
  const h = opts.height ?? node.offsetHeight ?? opts.defaultHeight ?? 0;
  const effectiveW = w > 0 ? w : (opts.defaultWidth ?? 0);
  const effectiveH = h > 0 ? h : (opts.defaultHeight ?? 0);
  apply(node, effectiveW, effectiveH, opts);
}

function reattach(node: HTMLElement, opts: SquircleDirectiveOptions) {
  const s = state.get(node);
  if (s?.observer) {
    s.observer.disconnect();
    s.observer = null;
  }
  const hasExplicit = opts.width !== undefined && opts.height !== undefined;
  if (hasExplicit) {
    apply(node, opts.width as number, opts.height as number, opts);
    return;
  }
  measure(node, opts);
  if (typeof ResizeObserver !== "undefined") {
    const entry: SquircleState = s ?? { observer: null, opts };
    entry.opts = opts;
    entry.observer = new ResizeObserver(() => measure(node, entry.opts));
    entry.observer.observe(node);
    state.set(node, entry);
  }
}

export const squircleDirective: Directive<
  HTMLElement,
  SquircleDirectiveOptions | undefined
> = {
  mounted(node, binding) {
    const opts = binding.value ?? {};
    state.set(node, { observer: null, opts });
    reattach(node, opts);
  },
  updated(node, binding) {
    reattach(node, binding.value ?? {});
  },
  beforeUnmount(node) {
    const s = state.get(node);
    s?.observer?.disconnect();
    state.delete(node);
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/squircleDirective.ts
git commit -m "feat(vue): add v-squircle directive"
```

---

## Task 6: Add `v-static-squircle` directive

**Files:**
- Create: `packages/vue/src/staticSquircleDirective.ts`

- [ ] **Step 1: Write `packages/vue/src/staticSquircleDirective.ts`**

```ts
import type { Directive } from "vue";
import { computeClipPath } from "./computePath.js";

export interface StaticSquircleDirectiveOptions {
  width: number;
  height: number;
  cornerRadius: number;
  cornerSmoothing: number;
}

function apply(node: HTMLElement, opts: StaticSquircleDirectiveOptions) {
  const path = computeClipPath({
    width: opts.width,
    height: opts.height,
    cornerRadius: opts.cornerRadius,
    cornerSmoothing: opts.cornerSmoothing,
  });
  node.style.clipPath = path ? `path('${path}')` : "";
  node.style.borderRadius = `${opts.cornerRadius}px`;
  node.setAttribute("data-squircle", String(opts.cornerRadius));
  node.style.width = `${opts.width}px`;
  node.style.height = `${opts.height}px`;
}

export const staticSquircleDirective: Directive<
  HTMLElement,
  StaticSquircleDirectiveOptions
> = {
  mounted(node, binding) {
    apply(node, binding.value);
  },
  updated(node, binding) {
    apply(node, binding.value);
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/staticSquircleDirective.ts
git commit -m "feat(vue): add v-static-squircle directive"
```

---

## Task 7: Add `<Squircle>` component

**Files:**
- Create: `packages/vue/src/Squircle.vue`

- [ ] **Step 1: Write `packages/vue/src/Squircle.vue`**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useSquircle, type UseSquircleOptions } from "./useSquircle";

defineOptions({ inheritAttrs: true });

const props = withDefaults(defineProps<UseSquircleOptions>(), {
  cornerSmoothing: 0.6,
});

const el = ref<HTMLDivElement | null>(null);

useSquircle(el, () => ({
  cornerRadius: props.cornerRadius,
  cornerSmoothing: props.cornerSmoothing,
  width: props.width,
  height: props.height,
  defaultWidth: props.defaultWidth,
  defaultHeight: props.defaultHeight,
}));
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/Squircle.vue
git commit -m "feat(vue): add Squircle component"
```

---

## Task 8: Add `<StaticSquircle>` component

**Files:**
- Create: `packages/vue/src/StaticSquircle.vue`

- [ ] **Step 1: Write `packages/vue/src/StaticSquircle.vue`**

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  useStaticSquircle,
  type UseStaticSquircleOptions,
} from "./useStaticSquircle";

defineOptions({ inheritAttrs: true });

const props = withDefaults(defineProps<UseStaticSquircleOptions>(), {
  cornerSmoothing: 0.6,
});

const el = ref<HTMLDivElement | null>(null);

useStaticSquircle(el, () => ({
  width: props.width,
  height: props.height,
  cornerRadius: props.cornerRadius,
  cornerSmoothing: props.cornerSmoothing,
}));
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/StaticSquircle.vue
git commit -m "feat(vue): add StaticSquircle component"
```

---

## Task 9: Add `SquircleNoScript` component

**Files:**
- Create: `packages/vue/src/SquircleNoScript.ts`

- [ ] **Step 1: Write `packages/vue/src/SquircleNoScript.ts`**

```ts
import { defineComponent, h, Teleport } from "vue";

const NOSCRIPT_INNER_HTML =
  '<style>[data-squircle] { clip-path: none !important; border-radius: attr(data-squircle) !important; }</style>';

export const SquircleNoScript = defineComponent({
  name: "SquircleNoScript",
  setup() {
    return () =>
      h(Teleport, { to: "head" }, [
        h("noscript", { innerHTML: NOSCRIPT_INNER_HTML }),
      ]);
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/src/SquircleNoScript.ts
git commit -m "feat(vue): add SquircleNoScript component"
```

---

## Task 10: Add `SquirclePlugin` and barrel exports

**Files:**
- Create: `packages/vue/src/plugin.ts`
- Create: `packages/vue/src/index.ts`

- [ ] **Step 1: Write `packages/vue/src/plugin.ts`**

```ts
import type { Plugin } from "vue";
import Squircle from "./Squircle.vue";
import { SquircleNoScript } from "./SquircleNoScript";
import { squircleDirective } from "./squircleDirective";
import StaticSquircle from "./StaticSquircle.vue";
import { staticSquircleDirective } from "./staticSquircleDirective";

export const SquirclePlugin: Plugin = {
  install(app) {
    app.component("Squircle", Squircle);
    app.component("StaticSquircle", StaticSquircle);
    app.component("SquircleNoScript", SquircleNoScript);
    app.directive("squircle", squircleDirective);
    app.directive("static-squircle", staticSquircleDirective);
  },
};
```

- [ ] **Step 2: Write `packages/vue/src/index.ts`**

```ts
export { default as Squircle } from "./Squircle.vue";
export { SquircleNoScript } from "./SquircleNoScript";
export {
  squircleDirective,
  type SquircleDirectiveOptions,
} from "./squircleDirective";
export { SquirclePlugin } from "./plugin";
export { default as StaticSquircle } from "./StaticSquircle.vue";
export {
  staticSquircleDirective,
  type StaticSquircleDirectiveOptions,
} from "./staticSquircleDirective";
export { useSquircle, type UseSquircleOptions } from "./useSquircle";
export {
  useStaticSquircle,
  type UseStaticSquircleOptions,
} from "./useStaticSquircle";
```

- [ ] **Step 3: Commit**

```bash
git add packages/vue/src/plugin.ts packages/vue/src/index.ts
git commit -m "feat(vue): add SquirclePlugin and barrel exports"
```

---

## Task 11: Update Biome config to exclude `.vue` files

**Files:**
- Modify: `biome.jsonc`

Biome does not parse Vue single-file component templates, so it strips imports it cannot see referenced. Exclude `.vue` alongside the existing `.svelte` exclusion.

- [ ] **Step 1: Edit `biome.jsonc`**

Change line 5 from:

```jsonc
    "includes": ["!**/*.svelte"]
```

to:

```jsonc
    "includes": ["!**/*.svelte", "!**/*.vue"]
```

- [ ] **Step 2: Commit**

```bash
git add biome.jsonc
git commit -m "chore(biome): exclude .vue files"
```

---

## Task 12: Install deps and verify build + typecheck

- [ ] **Step 1: Install dependencies**

Run: `pnpm install`
Expected: installs Vue package's devDependencies (Vite, `@vitejs/plugin-vue`, `@testing-library/vue`, `@vue/test-utils`, `vite-plugin-dts`, `vue-tsc`, `vue`, `jsdom`, vitest) and links the workspace.

- [ ] **Step 2: Run build**

Run: `pnpm --filter @squircle-js/vue build`
Expected: creates `packages/vue/dist/index.mjs`, `packages/vue/dist/index.js`, `packages/vue/dist/index.d.ts`. No errors.

- [ ] **Step 3: Run typecheck**

Run: `pnpm --filter @squircle-js/vue typecheck`
Expected: exits 0 with no errors.

- [ ] **Step 4: Run lint check (top-level)**

Run: `pnpm check`
Expected: exits 0; no errors.

- [ ] **Step 5: Clean up orphaned Next.js workers**

Run: `pkill -9 -f "jest-worker/processChild" || true`
Expected: silent (process list cleaned if any existed).

- [ ] **Step 6: Commit pnpm lockfile**

```bash
git add pnpm-lock.yaml
git commit -m "chore(deps): lock Vue package dependencies"
```

---

## Task 13: Add smoke tests

**Files:**
- Create: `packages/vue/src/__tests__/Squircle.test.ts`
- Create: `packages/vue/src/__tests__/useSquircle.test.ts`
- Create: `packages/vue/src/__tests__/squircleDirective.test.ts`

- [ ] **Step 1: Write `packages/vue/src/__tests__/Squircle.test.ts`**

```ts
import { render } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import Squircle from "../Squircle.vue";

describe("Squircle", () => {
  it("renders slot content", () => {
    const { getByText } = render(Squircle, {
      props: { cornerRadius: 16 },
      slots: { default: "hello" },
    });
    expect(getByText("hello")).toBeTruthy();
  });

  it("forwards class attribute", () => {
    const { container } = render(Squircle, {
      props: { cornerRadius: 16 },
      attrs: { class: "my-card" },
      slots: { default: "x" },
    });
    const div = container.firstElementChild as HTMLDivElement;
    expect(div.classList.contains("my-card")).toBe(true);
  });
});
```

- [ ] **Step 2: Write `packages/vue/src/__tests__/useSquircle.test.ts`**

```ts
import { mount } from "@vue/test-utils";
import { defineComponent, h, ref } from "vue";
import { describe, expect, it } from "vitest";
import { useSquircle } from "../useSquircle";

describe("useSquircle", () => {
  it("applies clip-path on mount when width and height are provided", async () => {
    const TestComponent = defineComponent({
      setup() {
        const el = ref<HTMLDivElement | null>(null);
        useSquircle(el, { cornerRadius: 16, width: 100, height: 100 });
        return () => h("div", { ref: el }, "x");
      },
    });
    const wrapper = mount(TestComponent);
    await wrapper.vm.$nextTick();
    const div = wrapper.element as HTMLDivElement;
    expect(div.style.clipPath).toContain("path(");
    expect(div.getAttribute("data-squircle")).toBe("16");
    wrapper.unmount();
  });
});
```

- [ ] **Step 3: Write `packages/vue/src/__tests__/squircleDirective.test.ts`**

```ts
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import { describe, expect, it } from "vitest";
import { squircleDirective } from "../squircleDirective";

describe("squircleDirective", () => {
  it("applies clip-path on mount and cleans up on unmount", async () => {
    const Test = defineComponent({
      directives: { squircle: squircleDirective },
      template:
        '<div v-squircle="{ cornerRadius: 16, width: 100, height: 100 }">x</div>',
    });
    const wrapper = mount(Test);
    await wrapper.vm.$nextTick();
    const div = wrapper.element as HTMLDivElement;
    expect(div.style.clipPath).toContain("path(");
    expect(div.getAttribute("data-squircle")).toBe("16");
    wrapper.unmount();
  });
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @squircle-js/vue test`
Expected: 4 tests, all passing.

- [ ] **Step 5: Commit**

```bash
git add packages/vue/src/__tests__/
git commit -m "test(vue): add smoke tests for component, composable, directive"
```

---

## Task 14: Add package README

**Files:**
- Create: `packages/vue/README.md`

- [ ] **Step 1: Write `packages/vue/README.md`**

```markdown
# @squircle-js/vue

iOS-style squircle (smooth corners) for Vue 3.

## Install

\`\`\`bash
pnpm add @squircle-js/vue
# or
npm install @squircle-js/vue
\`\`\`

Requires Vue 3.3 or later.

## Component usage

\`\`\`vue
<script setup>
import { Squircle } from "@squircle-js/vue";
</script>

<template>
  <Squircle :corner-radius="24" :corner-smoothing="0.6" class="card">
    <h2>Hello, squircle</h2>
  </Squircle>
</template>
\`\`\`

## Directive usage (no wrapper element)

Apply the squircle clip-path directly to any element — no extra DOM node:

\`\`\`vue
<script setup>
import { vSquircle as squircle } from "./use-squircle-shortcut";
import { squircleDirective } from "@squircle-js/vue";

const vSquircle = squircleDirective;
</script>

<template>
  <button
    v-squircle="{ cornerRadius: 12, cornerSmoothing: 0.6 }"
    class="bg-indigo-600 px-4 py-2 text-white"
  >
    Click me
  </button>
</template>
\`\`\`

Or install globally via the plugin:

\`\`\`ts
// main.ts
import { createApp } from "vue";
import { SquirclePlugin } from "@squircle-js/vue";
import App from "./App.vue";

createApp(App).use(SquirclePlugin).mount("#app");
\`\`\`

Then \`v-squircle\` and \`v-static-squircle\` are available in every template.

## Composable usage

\`\`\`vue
<script setup>
import { ref } from "vue";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
useSquircle(el, { cornerRadius: 16, cornerSmoothing: 0.6 });
</script>

<template>
  <div ref="el" class="bg-indigo-500 p-6">Content</div>
</template>
\`\`\`

## Static (fixed-dimension) variant

For elements whose size is known at authoring time, skip the \`ResizeObserver\`:

\`\`\`vue
<script setup>
import { StaticSquircle, staticSquircleDirective } from "@squircle-js/vue";

const vStaticSquircle = staticSquircleDirective;
</script>

<template>
  <!-- component -->
  <StaticSquircle :width="48" :height="48" :corner-radius="12" :corner-smoothing="0.6">
    <img src="/avatar.jpg" alt="" />
  </StaticSquircle>

  <!-- directive — applied directly to the element -->
  <img
    src="/avatar.jpg"
    alt=""
    v-static-squircle="{ width: 48, height: 48, cornerRadius: 12, cornerSmoothing: 0.6 }"
  />
</template>
\`\`\`

## SSR / Nuxt

Add \`<SquircleNoScript />\` once in your root layout for a \`border-radius\` fallback when JavaScript is disabled. For elements with known dimensions, prefer \`StaticSquircle\` / \`v-static-squircle\`. For dynamic \`Squircle\`, pass \`defaultWidth\` and \`defaultHeight\` when you can.

## Docs

Full documentation: https://squircle.js.org/docs/vue-getting-started
```

- [ ] **Step 2: Commit**

```bash
git add packages/vue/README.md
git commit -m "docs(vue): add package README"
```

---

## Task 15: Add Vue to root README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Read existing README**

Find the "Framework support" table (mentions `@squircle-js/react`, `@squircle-js/solid`, `@squircle-js/svelte`) and the Usage section. The Vue row should match the existing row formatting.

- [ ] **Step 2: Add Vue row to the framework support table**

Insert a new row for `@squircle-js/vue` beside the existing Svelte row. The expected format:

```markdown
| Vue 3 | `@squircle-js/vue` | ✅ | [docs](https://squircle.js.org/docs/vue-getting-started) |
```

- [ ] **Step 3: Add a Vue usage snippet below the Svelte example**

```markdown
### Vue

\`\`\`vue
<script setup>
import { Squircle } from "@squircle-js/vue";
</script>

<template>
  <Squircle :corner-radius="24" :corner-smoothing="0.6" class="card">
    Hello, squircle
  </Squircle>
</template>
\`\`\`
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: mention @squircle-js/vue in root README"
```

---

## Task 16: Add changeset

**Files:**
- Create: `.changeset/vue-package.md`

- [ ] **Step 1: Write `.changeset/vue-package.md`**

```markdown
---
"@squircle-js/vue": minor
---

Introduce `@squircle-js/vue` for Vue 3 (^3.3). Ships three APIs:

- Components: `<Squircle>`, `<StaticSquircle>`, `<SquircleNoScript>`
- Directives: `v-squircle`, `v-static-squircle` (the `asChild` replacement)
- Composables: `useSquircle`, `useStaticSquircle`

Also ships `SquirclePlugin` for global registration via `app.use(SquirclePlugin)`.
```

- [ ] **Step 2: Commit**

```bash
git add .changeset/vue-package.md
git commit -m "chore: add changeset for @squircle-js/vue 0.1.0"
```

---

## Task 17: Docs page — Getting Started

**Files:**
- Create: `apps/web/content/docs/vue-getting-started.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-getting-started.mdx`**

```mdx
---
title: "Getting Started"
description: "Install @squircle-js/vue and render your first squircle in Vue 3."
keywords: ["vue squircle", "vue ios squircle", "vue smooth corners"]
slug: "vue-getting-started"
order: 1
group: "vue"
---

## Install

\`\`\`bash
pnpm add @squircle-js/vue
# or
npm install @squircle-js/vue
\`\`\`

Requires Vue 3.3 or later. Nuxt 3 is supported out of the box — the library has no Nuxt-specific configuration.

## Basic usage

\`\`\`vue
<script setup>
import { Squircle } from "@squircle-js/vue";
</script>

<template>
  <Squircle :corner-radius="24" :corner-smoothing="0.6" class="bg-indigo-500 p-6">
    <h2 class="text-white font-semibold text-lg">Hello, squircle</h2>
  </Squircle>
</template>
\`\`\`

`Squircle` renders a `<div>` that auto-measures itself with a `ResizeObserver` and applies a computed SVG `clip-path` for the smooth-corner effect.

## The directive alternative

Vue's `asChild` equivalent is a **directive** — apply the squircle clip-path directly to any element without a wrapper:

\`\`\`vue
<script setup>
import { squircleDirective as vSquircle } from "@squircle-js/vue";
</script>

<template>
  <button
    v-squircle="{ cornerRadius: 12, cornerSmoothing: 0.6 }"
    class="bg-blue-600 px-4 py-2 text-white"
  >
    Click me
  </button>
</template>
\`\`\`

See [The Directive Pattern](/docs/vue-directive) for the full story.

## Global registration (optional)

For larger apps, register the components and directives globally:

\`\`\`ts
// main.ts
import { createApp } from "vue";
import { SquirclePlugin } from "@squircle-js/vue";
import App from "./App.vue";

createApp(App).use(SquirclePlugin).mount("#app");
\`\`\`

After `app.use(SquirclePlugin)`, `<Squircle>`, `<StaticSquircle>`, `<SquircleNoScript>`, `v-squircle`, and `v-static-squircle` are available in every template with no imports.

## Composable API

For programmatic use — especially when options need to react to other state:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
useSquircle(el, { cornerRadius: 16 });
</script>

<template>
  <div ref="el" class="bg-emerald-500 p-6">Content</div>
</template>
\`\`\`

See [The Composable API](/docs/vue-composable).

## Nuxt SSR

Everything works with Nuxt 3 SSR and static generation. The composable and directive only run on the client, so the initial server-rendered HTML omits the `clip-path` unless you pass `defaultWidth` / `defaultHeight` (or use `StaticSquircle` for fixed-size elements).

See [No-JavaScript Fallback](/docs/vue-no-javascript-fallback) for progressive enhancement details.

## Coming from React, Solid, or Svelte?

The component API is nearly identical across frameworks:

- `Squircle`, `StaticSquircle`, `SquircleNoScript` — same names, same props
- `cornerRadius`, `cornerSmoothing`, `width`, `height`, `defaultWidth`, `defaultHeight` — same semantics
- `asChild` → replaced by `v-squircle` directive (idiomatic Vue)

The one deviation: Vue uses kebab-case attributes in templates (`:corner-radius`), and props are passed with the `:` prefix for reactive bindings.
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-getting-started.mdx
git commit -m "docs(web): add vue-getting-started page"
```

---

## Task 18: Docs page — `<Squircle>` component

**Files:**
- Create: `apps/web/content/docs/vue-squircle-component.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-squircle-component.mdx`**

```mdx
---
title: "The Squircle Component"
description: "<Squircle> auto-sizes itself via ResizeObserver and applies a smooth-corner SVG clip-path in Vue 3."
keywords: ["vue squircle component", "vue squircle props", "vue dynamic squircle"]
slug: "vue-squircle-component"
order: 2
group: "vue"
---

## Overview

`<Squircle>` is a dynamic component — it measures its own rendered size with `ResizeObserver` and re-applies the clip-path whenever the element resizes. Use it for responsive elements whose dimensions aren't known at authoring time.

\`\`\`vue
<script setup>
import { Squircle } from "@squircle-js/vue";
</script>

<template>
  <Squircle :corner-radius="24" :corner-smoothing="0.6" class="bg-violet-500 p-6">
    <p class="text-white">Hello, squircle</p>
  </Squircle>
</template>
\`\`\`

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `cornerRadius` | `number` | `undefined` | Corner radius in pixels. Also written to `data-squircle` for the noscript fallback. |
| `cornerSmoothing` | `number` | `0.6` | Squircle smoothing from `0` (CSS border-radius) to `1` (maximum superellipse). |
| `width` | `number` | `undefined` | Explicit width override. When both `width` and `height` are provided, the component skips the `ResizeObserver`. |
| `height` | `number` | `undefined` | Explicit height override. |
| `defaultWidth` | `number` | `undefined` | Fallback width used before first measurement — useful to avoid pop-in on first render. |
| `defaultHeight` | `number` | `undefined` | Fallback height used before first measurement. |

All other attributes (`class`, `style`, event handlers, ARIA attributes) are forwarded to the underlying `<div>`.

## Reactive props

Props can be driven by refs — the component re-applies the clip-path without re-rendering:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { Squircle } from "@squircle-js/vue";

const radius = ref(16);
</script>

<template>
  <input type="range" min="0" max="64" v-model.number="radius" />
  <Squircle :corner-radius="radius" class="w-32 h-32 bg-rose-500" />
</template>
\`\`\`

## When not to use `<Squircle>`

- **Fixed dimensions:** prefer [`<StaticSquircle>`](/docs/vue-static-squircle) — no observer, lower overhead.
- **Clip arbitrary elements without a wrapper:** use [`v-squircle`](/docs/vue-directive) — skips the extra `<div>`.
- **Compose with other reactive logic:** prefer [`useSquircle`](/docs/vue-composable).

## Slot

The default slot is rendered inside the clipped `<div>`. There are no named slots.

\`\`\`vue
<template>
  <Squircle :corner-radius="16">
    <img src="..." />
    <p>Caption</p>
  </Squircle>
</template>
\`\`\`

## Underlying DOM

`<Squircle>` renders exactly one element:

\`\`\`html
<div
  data-squircle="16"
  style="border-radius: 16px; clip-path: path('...');"
>
  <!-- slot content -->
</div>
\`\`\`

No extra wrappers, no shadow DOM.
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-squircle-component.mdx
git commit -m "docs(web): add vue-squircle-component page"
```

---

## Task 19: Docs page — `<StaticSquircle>` component

**Files:**
- Create: `apps/web/content/docs/vue-static-squircle.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-static-squircle.mdx`**

```mdx
---
title: "The StaticSquircle Component"
description: "<StaticSquircle> is the fixed-dimension variant — no ResizeObserver, lower runtime cost, best for elements with known sizes in Vue 3."
keywords: ["vue static squircle", "vue squircle fixed size", "vue performant squircle"]
slug: "vue-static-squircle"
order: 3
group: "vue"
---

## When to use

Use `<StaticSquircle>` when the element's width and height are fixed at authoring time — avatars, app icons, fixed-size buttons, thumbnails. It skips the `ResizeObserver` that `<Squircle>` uses, reducing runtime cost to a single path computation at mount.

\`\`\`vue
<script setup>
import { StaticSquircle } from "@squircle-js/vue";
</script>

<template>
  <StaticSquircle
    :width="48"
    :height="48"
    :corner-radius="12"
    :corner-smoothing="0.6"
  >
    <img src="/avatar.jpg" alt="Avatar" class="object-cover" />
  </StaticSquircle>
</template>
\`\`\`

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `width` | `number` | ✅ | Element width in pixels. |
| `height` | `number` | ✅ | Element height in pixels. |
| `cornerRadius` | `number` | ✅ | Corner radius in pixels. |
| `cornerSmoothing` | `number` | — | Squircle smoothing from `0` to `1`. Defaults to `0.6`. |

All four size and shape props are required except `cornerSmoothing`. If you don't know the dimensions, use `<Squircle>` instead.

## Behavior

- Computes the path once on mount and applies `clip-path`, `border-radius`, `width`, `height`, and `data-squircle` as inline styles.
- Re-applies if any of the four props change.
- Never attaches a `ResizeObserver`.

## Performance note

On a page with hundreds of small squircles (e.g. a grid of app icons), `<StaticSquircle>` is noticeably cheaper than `<Squircle>` because each observer costs memory and adds work on layout changes. A list of 200 avatars is the classic use case.

## Static vs dynamic at a glance

| | `<Squircle>` | `<StaticSquircle>` |
|---|---|---|
| Measures element | Yes (`ResizeObserver`) | No — trusts the provided `width`/`height` |
| Re-applies on resize | Yes | No |
| Cost per instance | Observer + listener | Single path computation |
| When to use | Responsive, fluid layouts | Fixed-size elements |

## The directive alternative

For applying static clipping directly to an existing element (e.g. an `<img>`), skip the wrapper:

\`\`\`vue
<script setup>
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";
</script>

<template>
  <img
    src="/avatar.jpg"
    alt=""
    v-static-squircle="{
      width: 48,
      height: 48,
      cornerRadius: 12,
      cornerSmoothing: 0.6,
    }"
    class="object-cover"
  />
</template>
\`\`\`

See [The Directive Pattern](/docs/vue-directive).
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-static-squircle.mdx
git commit -m "docs(web): add vue-static-squircle page"
```

---

## Task 20: Docs page — Directive pattern

**Files:**
- Create: `apps/web/content/docs/vue-directive.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-directive.mdx`**

```mdx
---
title: "The Directive Pattern"
description: "v-squircle and v-static-squircle attach squircle clipping directly to any element — the idiomatic Vue equivalent of React's asChild."
keywords: ["vue squircle directive", "v-squircle", "vue ios squircle button"]
slug: "vue-directive"
order: 4
group: "vue"
---

## What is a directive?

A Vue **directive** is a lightweight primitive for attaching low-level DOM behavior to an element. Directives get direct access to the element and lifecycle hooks (`mounted`, `updated`, `beforeUnmount`) — they don't render new DOM, they augment an existing element.

`@squircle-js/vue` ships two directives:

- `v-squircle` — dynamic, observes element size
- `v-static-squircle` — synchronous, takes explicit `width` / `height`

## Why directives instead of `asChild`?

React and Solid's `asChild` pattern works because JSX children can be cloned and augmented with extra props. Vue's slot system can't clone a slot child and inject styles into it — there's no equivalent of `cloneElement`.

Vue's answer is the directive system — a primitive specifically for attaching behavior to any element. It's lighter than wrapping, works for any intrinsic element (`<button>`, `<img>`, `<a>`, `<section>`), composes with Vue transitions and third-party directives, and reads naturally in templates.

## Registering the directives

Two options — local registration per component, or global via the plugin.

**Local (tree-shakable):**

\`\`\`vue
<script setup>
import { squircleDirective as vSquircle } from "@squircle-js/vue";
</script>

<template>
  <div v-squircle="{ cornerRadius: 16 }">...</div>
</template>
\`\`\`

Vue's `<script setup>` automatically registers any variable starting with `v` followed by an uppercase letter as a directive.

**Global:**

\`\`\`ts
// main.ts
import { createApp } from "vue";
import { SquirclePlugin } from "@squircle-js/vue";
import App from "./App.vue";

createApp(App).use(SquirclePlugin).mount("#app");
\`\`\`

After `app.use(SquirclePlugin)`, `v-squircle` and `v-static-squircle` work in every template.

## `v-squircle`

\`\`\`vue
<script setup>
import { squircleDirective as vSquircle } from "@squircle-js/vue";
</script>

<template>
  <button
    v-squircle="{ cornerRadius: 12, cornerSmoothing: 0.6 }"
    class="bg-indigo-600 px-5 py-2.5 text-white font-semibold"
  >
    Click me
  </button>
</template>
\`\`\`

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

## `v-static-squircle`

Synchronous variant. No observer. All four size/shape options are required.

\`\`\`vue
<script setup>
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";
</script>

<template>
  <img
    src="/avatar.jpg"
    alt="Avatar"
    v-static-squircle="{
      width: 48,
      height: 48,
      cornerRadius: 12,
      cornerSmoothing: 0.6,
    }"
    class="object-cover"
  />
</template>
\`\`\`

## Reactive bindings

The binding value is reactive — Vue calls the directive's `updated` hook whenever the bound object changes, and the clip-path re-applies:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { squircleDirective as vSquircle } from "@squircle-js/vue";

const radius = ref(16);
</script>

<template>
  <input type="range" min="0" max="64" v-model.number="radius" />
  <div
    v-squircle="{ cornerRadius: radius, cornerSmoothing: 0.6 }"
    class="w-40 h-40 bg-rose-500"
  />
</template>
\`\`\`

No component re-render — only the `clip-path` recomputes.

## Comparison: component vs directive

| | `<Squircle>` component | `v-squircle` directive |
|---|---|---|
| DOM nodes | 1 extra `<div>` wrapper | 0 (clip-path on the element itself) |
| Target element | Always `<div>` | Any element |
| Needs `overflow-hidden` | Often yes | No — clip-path clips contents |
| When to use | Wrapping arbitrary content | Clipping a specific `<button>`, `<img>`, `<a>`, etc. |
| SSR preview | Supports `defaultWidth`/`defaultHeight` | Client-side only |

## Fallback behavior

If the browser doesn't support `ResizeObserver`, the directive applies a one-time measurement on mount (using `offsetWidth` / `offsetHeight` or `defaultWidth` / `defaultHeight`) and skips the observer. The clip-path won't update on resize, but the initial shape is still applied.
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-directive.mdx
git commit -m "docs(web): add vue-directive page"
```

---

## Task 21: Docs page — Composable API

**Files:**
- Create: `apps/web/content/docs/vue-composable.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-composable.mdx`**

```mdx
---
title: "The Composable API"
description: "useSquircle and useStaticSquircle attach squircle clipping to a template ref in Vue 3 — the Composition API primitive."
keywords: ["vue squircle composable", "useSquircle", "vue squircle template ref"]
slug: "vue-composable"
order: 5
group: "vue"
---

## What is a composable?

A Vue **composable** is a function that encapsulates reusable Composition API logic. It runs inside `setup()` (or `<script setup>`) and returns reactive state or side effects. Composables are Vue's idiomatic primitive for stateful logic that isn't tied to a specific component shape.

`@squircle-js/vue` ships two composables:

- `useSquircle(elRef, options)` — dynamic, observes element size
- `useStaticSquircle(elRef, options)` — synchronous, takes explicit `width` / `height`

## When to reach for the composable

- You already have a template ref for reasons unrelated to squircling (focus management, animation, measurement).
- You want options to derive from other reactive state via `computed()`.
- You're composing squircle behavior alongside other composables (e.g. VueUse's `useElementSize`, `useFocus`).

For plain template-level usage, prefer the component or the directive.

## `useSquircle`

\`\`\`vue
<script setup>
import { ref } from "vue";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
useSquircle(el, { cornerRadius: 16, cornerSmoothing: 0.6 });
</script>

<template>
  <div ref="el" class="bg-indigo-500 p-6 w-64">Hello</div>
</template>
\`\`\`

**Signature:**

\`\`\`ts
useSquircle(
  elRef: Ref<HTMLElement | null | undefined>,
  options?: UseSquircleOptions | Ref<UseSquircleOptions> | (() => UseSquircleOptions),
): void
\`\`\`

Options can be a plain object, a `ref`, a `computed`, or a getter function. When reactive, the composable re-applies the clip-path whenever the options change.

## Reactive options

### Pass a getter

\`\`\`vue
<script setup>
import { ref } from "vue";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
const radius = ref(16);

useSquircle(el, () => ({ cornerRadius: radius.value, cornerSmoothing: 0.6 }));
</script>

<template>
  <input type="range" min="0" max="64" v-model.number="radius" />
  <div ref="el" class="w-40 h-40 bg-rose-500" />
</template>
\`\`\`

### Pass a `computed`

\`\`\`vue
<script setup>
import { computed, ref } from "vue";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
const size = ref(40);

const options = computed(() => ({
  cornerRadius: size.value / 2.5,
  cornerSmoothing: 0.6,
}));

useSquircle(el, options);
</script>

<template>
  <div ref="el" :style="{ width: size + 'px', height: size + 'px' }" class="bg-teal-500" />
</template>
\`\`\`

## `useStaticSquircle`

\`\`\`vue
<script setup>
import { ref } from "vue";
import { useStaticSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
useStaticSquircle(el, {
  width: 48,
  height: 48,
  cornerRadius: 12,
  cornerSmoothing: 0.6,
});
</script>

<template>
  <img ref="el" src="/avatar.jpg" alt="" class="object-cover" />
</template>
\`\`\`

No `ResizeObserver`. All four options (`width`, `height`, `cornerRadius`, `cornerSmoothing`) are required — if you don't know the dimensions, use `useSquircle` instead.

## Composition with other composables

Because composables are just functions, you can combine them freely:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
const { width, height } = useElementSize(el);

useSquircle(el, () => ({
  cornerRadius: Math.min(width.value, height.value) * 0.15,
  cornerSmoothing: 0.6,
}));
</script>

<template>
  <div ref="el" class="bg-purple-500 aspect-video w-full">Adaptive</div>
</template>
\`\`\`

Here the corner radius scales with the element's measured size — something that's awkward to express with the component or directive alone.

## Composable vs directive

| | `useSquircle` composable | `v-squircle` directive |
|---|---|---|
| Where it lives | `<script setup>` | Template attribute |
| Options source | Plain, ref, computed, or getter | Template expression |
| Requires template ref | Yes | No |
| Fits Options API | Via `setup()` function | Native |
| Best for | Complex logic, composition | Simple template-level use |

Both wrap the same core computation. Pick whichever reads more clearly in context.
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-composable.mdx
git commit -m "docs(web): add vue-composable page"
```

---

## Task 22: Docs page — Corner smoothing

**Files:**
- Create: `apps/web/content/docs/vue-corner-smoothing.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-corner-smoothing.mdx`**

```mdx
---
title: "Corner Smoothing Explained"
description: "Understand what cornerSmoothing values mean in @squircle-js/vue, from 0 (standard border-radius) to 0.6 (iOS-like) to 1 (maximum smoothing)."
keywords: ["vue corner smoothing", "vue squircle smoothing", "cornerSmoothing vue"]
slug: "vue-corner-smoothing"
order: 6
group: "vue"
---

## What is corner smoothing?

The `cornerSmoothing` prop controls how much the corner curve extends beyond the strict arc that CSS `border-radius` would produce. It ranges from `0` to `1`.

At `0`, the squircle path is mathematically equivalent to `border-radius` — circular arcs that meet the straight edges at a tangent point. At `1`, the curve flows smoothly from the corner all the way to the midpoint of each side, producing the continuous superellipse shape used in iOS app icons.

The values are identical across all `@squircle-js/*` packages — this is a property of the underlying `figma-squircle` path algorithm, not of the framework bindings.

## Values explained

### 0 — Standard border-radius

\`\`\`vue
<Squircle :corner-radius="24" :corner-smoothing="0" class="w-32 h-32 bg-gray-800" />
\`\`\`

Equivalent to `border-radius: 24px`. The transition from the straight edge to the corner arc is abrupt at the tangent point. Use this if you want the squircle path API but no visible difference from plain CSS.

### 0.6 — iOS style (default)

\`\`\`vue
<Squircle :corner-radius="24" :corner-smoothing="0.6" class="w-32 h-32 bg-gray-800" />
\`\`\`

The default. Matches the smoothing Apple uses for iOS app icons and system UI. The curve begins extending onto the straight edge, creating a softer, more refined look. Most visible at larger `cornerRadius` values.

### 1 — Maximum smoothing

\`\`\`vue
<Squircle :corner-radius="24" :corner-smoothing="1" class="w-32 h-32 bg-gray-800" />
\`\`\`

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

\`\`\`vue
<!-- Small element — smoothing differences are subtle -->
<Squircle :corner-radius="8" :corner-smoothing="1" class="w-10 h-10 bg-slate-600" />

<!-- Large element — smoothing differences are very visible -->
<Squircle :corner-radius="32" :corner-smoothing="1" class="w-64 h-64 bg-slate-600" />
\`\`\`

## Fractional values

Any value between `0` and `1` is valid:

\`\`\`vue
<Squircle :corner-radius="20" :corner-smoothing="0.8" class="w-32 h-32 bg-violet-500" />
\`\`\`

The interpolation is smooth and continuous — tune to match your design system exactly.

## Binding to reactive state

Vue's `ref` lets you drive `cornerSmoothing` from state:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { Squircle } from "@squircle-js/vue";

const smoothing = ref(0.6);
</script>

<template>
  <div class="flex flex-col gap-4">
    <input type="range" min="0" max="1" step="0.05" v-model.number="smoothing" />
    <Squircle
      :corner-radius="32"
      :corner-smoothing="smoothing"
      class="w-48 h-48 bg-violet-500"
    />
  </div>
</template>
\`\`\`

Only the `clip-path` style recomputes — no component re-render.
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-corner-smoothing.mdx
git commit -m "docs(web): add vue-corner-smoothing page"
```

---

## Task 23: Docs page — No-JavaScript fallback

**Files:**
- Create: `apps/web/content/docs/vue-no-javascript-fallback.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-no-javascript-fallback.mdx`**

```mdx
---
title: "No-JavaScript Fallback"
description: "How SquircleNoScript provides graceful degradation in @squircle-js/vue when JavaScript is disabled, using CSS border-radius as a fallback."
keywords: ["vue squircle noscript", "vue squircle ssr", "nuxt squircle", "vue squircle fallback"]
slug: "vue-no-javascript-fallback"
order: 7
group: "vue"
---

## The problem

`@squircle-js/vue` relies on JavaScript to measure element dimensions (via `ResizeObserver`) and compute the SVG clip-path. When JavaScript is disabled or hasn't loaded yet, the element will have no `clip-path` applied, leaving it unstyled.

To handle this gracefully, the package ships `SquircleNoScript`.

## How SquircleNoScript works

`SquircleNoScript` renders a `<noscript>` block into the document `<head>` containing a CSS rule:

\`\`\`css
[data-squircle] {
  clip-path: none !important;
  border-radius: attr(data-squircle) !important;
}
\`\`\`

Every `Squircle` (or element with `v-squircle`) writes the `cornerRadius` value to a `data-squircle` attribute. When JavaScript is disabled, the browser applies the noscript CSS, which:

1. Removes the (non-functional) clip-path
2. Falls back to standard `border-radius` using the radius stored in `data-squircle`

The result is a rounded element that looks correct even without JavaScript — not a perfect squircle, but a clean, rounded shape that matches the intended `cornerRadius`.

## Setup

Add `SquircleNoScript` once — typically in your app's root component:

\`\`\`vue
<!-- App.vue -->
<script setup>
import { SquircleNoScript } from "@squircle-js/vue";
</script>

<template>
  <SquircleNoScript />
  <RouterView />
</template>
\`\`\`

`SquircleNoScript` uses Vue's `<Teleport to="head">` internally, so the `<noscript>` block lands in the document `<head>` where it belongs. It only renders inside a `<noscript>` tag, so it has zero impact on JavaScript-enabled users.

No other configuration is needed. All `Squircle` components and `v-squircle` elements on the page automatically benefit from the fallback.

## Setup in Nuxt 3

Place `SquircleNoScript` in your `app.vue`:

\`\`\`vue
<!-- app.vue -->
<script setup>
import { SquircleNoScript } from "@squircle-js/vue";
</script>

<template>
  <SquircleNoScript />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
\`\`\`

Nuxt's SSR serializes Teleport content into the initial HTML, so the noscript CSS is present in the server response — it works for users who hit your page with JavaScript disabled from the first byte.

## SSR considerations

During server-side rendering, the clip-path is not yet computed — composables and directives only run on the client in Vue 3. This means there is a brief window on first paint where a `Squircle` element may appear without a clip-path, particularly when neither `defaultWidth` / `defaultHeight` nor explicit `width` / `height` are provided.

To minimise this:

- **Prefer `StaticSquircle`** for elements with fixed dimensions. Once the client hydrates, the clip-path applies immediately and stably.
- **Provide `defaultWidth` and `defaultHeight`** to dynamic `Squircle` instances when you know a reasonable starting size.

## What users see

| Scenario | Visual result |
|---|---|
| JavaScript enabled | Full squircle clip-path |
| JavaScript disabled, `SquircleNoScript` present | Rounded corners via `border-radius` |
| JavaScript disabled, no `SquircleNoScript` | Square element (no rounding) |
| SSR, before hydration | Square element; clip-path applies on mount |

## Progressive enhancement checklist

- Include `<SquircleNoScript />` once in your `App.vue` (or `app.vue` for Nuxt)
- Prefer `StaticSquircle` for any element whose size is known at authoring time
- Pass `defaultWidth` / `defaultHeight` to dynamic `Squircle` instances when possible
- Treat the squircle shape as a visual polish, not a structural guarantee — content should remain readable without it
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-no-javascript-fallback.mdx
git commit -m "docs(web): add vue-no-javascript-fallback page"
```

---

## Task 24: Docs page — Examples & recipes

**Files:**
- Create: `apps/web/content/docs/vue-examples.mdx`

- [ ] **Step 1: Write `apps/web/content/docs/vue-examples.mdx`**

```mdx
---
title: "Examples & Recipes"
description: "Common patterns for @squircle-js/vue: buttons, cards, avatars, image containers, and more."
keywords: ["vue squircle examples", "vue squircle button", "vue squircle card", "vue squircle avatar"]
slug: "vue-examples"
order: 8
group: "vue"
---

## Button

Use the `v-squircle` directive to render a button with no wrapper element:

\`\`\`vue
<script setup lang="ts">
import { squircleDirective as vSquircle } from "@squircle-js/vue";

defineProps<{ onClick?: () => void }>();
</script>

<template>
  <button
    type="button"
    v-squircle="{ cornerRadius: 12, cornerSmoothing: 0.6 }"
    class="bg-indigo-600 px-5 py-2.5 text-white font-semibold text-sm"
    @click="onClick"
  >
    <slot />
  </button>
</template>
\`\`\`

## Card

A card with responsive width — the `Squircle` component measures itself:

\`\`\`vue
<script setup lang="ts">
import { Squircle } from "@squircle-js/vue";

defineProps<{ title: string; body: string }>();
</script>

<template>
  <Squircle
    :corner-radius="20"
    :corner-smoothing="0.6"
    class="bg-white shadow-md p-6 space-y-2"
  >
    <h3 class="font-semibold text-lg">{{ title }}</h3>
    <p class="text-gray-600 text-sm">{{ body }}</p>
  </Squircle>
</template>
\`\`\`

## Avatar

Fixed-size avatars are a perfect use case for `v-static-squircle`:

\`\`\`vue
<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

const props = withDefaults(
  defineProps<{ src: string; alt: string; size?: number }>(),
  { size: 48 },
);
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    v-static-squircle="{
      width: props.size,
      height: props.size,
      cornerRadius: Math.round(props.size * 0.25),
      cornerSmoothing: 0.6,
    }"
    class="object-cover shrink-0"
  />
</template>
\`\`\`

## Image container

Clip a hero image with a large squircle radius:

\`\`\`vue
<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ src: string; alt: string }>();
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    v-static-squircle="{
      width: 600,
      height: 400,
      cornerRadius: 32,
      cornerSmoothing: 0.8,
    }"
    class="object-cover"
  />
</template>
\`\`\`

## App icon

Replicate the iOS app icon shape exactly:

\`\`\`vue
<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ src: string; name: string }>();
</script>

<template>
  <div class="flex flex-col items-center gap-1.5">
    <img
      :src="src"
      :alt="name"
      v-static-squircle="{
        width: 60,
        height: 60,
        cornerRadius: 13,
        cornerSmoothing: 0.6,
      }"
    />
    <span class="text-xs text-gray-700">{{ name }}</span>
  </div>
</template>
\`\`\`

## Notification badge

Small squircle badges with dynamic content:

\`\`\`vue
<script setup lang="ts">
import { Squircle } from "@squircle-js/vue";

defineProps<{ count: number }>();
</script>

<template>
  <Squircle
    :corner-radius="6"
    :corner-smoothing="0.6"
    class="bg-red-500 px-1.5 py-0.5 text-white text-xs font-bold min-w-[20px] text-center"
  >
    {{ count }}
  </Squircle>
</template>
\`\`\`

## Icon button

Equal-width-and-height buttons benefit from `v-static-squircle`:

\`\`\`vue
<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ label: string; onClick?: () => void }>();
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    v-static-squircle="{
      width: 40,
      height: 40,
      cornerRadius: 10,
      cornerSmoothing: 0.6,
    }"
    class="bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
    @click="onClick"
  >
    <slot />
  </button>
</template>
\`\`\`

## Reactive squircle

Driving `cornerRadius` from a `ref` — Vue's fine-grained reactivity only recomputes the `clip-path`:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { Squircle } from "@squircle-js/vue";

const radius = ref(16);
</script>

<template>
  <div class="flex items-center gap-4">
    <input type="range" min="0" max="64" v-model.number="radius" />
    <Squircle :corner-radius="radius" class="w-32 h-32 bg-emerald-500" />
  </div>
</template>
\`\`\`

## List of squircles

Vue's `v-for` pairs naturally with keyed squircles:

\`\`\`vue
<script setup lang="ts">
import { staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";

defineProps<{ tags: Array<{ id: string; label: string }> }>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <div
      v-for="tag in tags"
      :key="tag.id"
      v-static-squircle="{
        width: 80,
        height: 28,
        cornerRadius: 8,
        cornerSmoothing: 0.6,
      }"
      class="bg-sky-100 text-sky-800 text-xs font-medium flex items-center justify-center"
    >
      {{ tag.label }}
    </div>
  </div>
</template>
\`\`\`

## Composition with transitions

Directives compose with Vue's `<Transition>` element — you can add a fade-in without affecting the squircle:

\`\`\`vue
<script setup>
import { ref } from "vue";
import { squircleDirective as vSquircle } from "@squircle-js/vue";

const visible = ref(true);
</script>

<template>
  <Transition name="fade">
    <div
      v-if="visible"
      v-squircle="{ cornerRadius: 20, cornerSmoothing: 0.6 }"
      class="bg-gradient-to-br from-violet-500 to-indigo-600 p-6 w-64 h-32"
    >
      Animated squircle card
    </div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
\`\`\`
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/content/docs/vue-examples.mdx
git commit -m "docs(web): add vue-examples page"
```

---

## Task 25: Update docs sidebar grouping

**Files:**
- Modify: `apps/web/components/docs-sidebar.tsx`

- [ ] **Step 1: Edit `GROUP_ORDER` and `GROUP_LABELS`**

Change lines 8–13 from:

```tsx
const GROUP_ORDER = ["react", "solid", "svelte"];
const GROUP_LABELS: Record<string, string> = {
  react: "React",
  solid: "Solid",
  svelte: "Svelte",
};
```

to:

```tsx
const GROUP_ORDER = ["react", "solid", "svelte", "vue"];
const GROUP_LABELS: Record<string, string> = {
  react: "React",
  solid: "Solid",
  svelte: "Svelte",
  vue: "Vue",
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/components/docs-sidebar.tsx
git commit -m "docs(web): add vue group to sidebar ordering"
```

---

## Task 26: Full validation sweep + push

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: all packages build successfully. The `@squircle-js/vue:build` task produces `packages/vue/dist/index.mjs`, `packages/vue/dist/index.js`, and `packages/vue/dist/index.d.ts`. The `web:build` task succeeds and lists 8 new `/docs/vue-*` routes.

- [ ] **Step 2: Clean up orphaned Next.js workers**

Run: `pkill -9 -f "jest-worker/processChild" || true`
Expected: silent.

- [ ] **Step 3: Run typecheck**

Run: `pnpm typecheck`
Expected: `@squircle-js/vue:typecheck` passes with 0 errors. (The pre-existing `web:typecheck` error in `lib/mdx.ts` about `EvaluateOptions.Fragment` is out of scope for this plan.)

- [ ] **Step 4: Run tests**

Run: `pnpm --filter @squircle-js/vue test`
Expected: 4 tests passing.

- [ ] **Step 5: Run lint check**

Run: `pnpm check`
Expected: exits 0, no errors.

- [ ] **Step 6: Review commits**

Run: `git log --oneline origin/main..HEAD`
Expected: ~26 commits for the Vue package.

- [ ] **Step 7: Rebase on origin/main (in case of upstream changes)**

Run: `git fetch origin main && git rebase origin/main`
Expected: fast-forward or clean rebase. If conflicts surface, resolve them (most likely candidates: `.changeset/` consumed by a Version Packages PR, or another framework's docs).

- [ ] **Step 8: Re-run check after rebase**

Run: `pnpm check`
Expected: exits 0.

- [ ] **Step 9: Push**

Run: `git push origin main`
Expected: pushes all commits. Changesets CI opens a Version Packages PR for `@squircle-js/vue@0.1.0`.

---

## Verification at rest

After all tasks, verify the final state:

- `packages/vue/dist/index.d.ts` exists with all public type exports.
- `apps/web` dev server lists `/docs/vue-getting-started` through `/docs/vue-examples` in the sidebar under a "Vue" group.
- `pnpm -r run test` runs all package tests without failure.
- `git status` is clean.
