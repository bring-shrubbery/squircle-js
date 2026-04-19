# `@squircle-js/vue` Package Design

**Date:** 2026-04-19
**Author:** brainstorm (Antoni + Claude)
**Status:** Proposed

## Goal

Ship a new `@squircle-js/vue` package that brings the squircle primitive to Vue 3 apps with the same depth of coverage as the existing `@squircle-js/react`, `@squircle-js/solid`, and `@squircle-js/svelte` packages — including a component API, a directive API (the `asChild` replacement), a composable API, full documentation on the web app, tests, README, and auto-publishing via the existing Changesets workflow.

## Scope

**In scope**
- `packages/vue/` workspace package targeting Vue 3 only (^3.3).
- Three components: `<Squircle>`, `<StaticSquircle>`, `<SquircleNoScript>`.
- Two custom directives: `v-squircle`, `v-static-squircle`.
- Two composables: `useSquircle`, `useStaticSquircle`.
- A Vue plugin for global registration (`app.use(SquirclePlugin)`).
- Eight MDX documentation pages under `apps/web/content/docs/` (`vue-*`).
- Sidebar integration: append `vue` to `GROUP_ORDER`.
- Root `README.md` framework table row + short usage snippet.
- Smoke tests for component, composable, directive.
- Changeset entry for `@squircle-js/vue@0.1.0`.
- Biome config: exclude `**/*.vue` (alongside the existing `.svelte` exclusion).

**Out of scope**
- Vue 2 / Vue 2.7 compatibility.
- A bespoke Nuxt 3 module (plain Vue 3 library works in Nuxt with user-side config; a Nuxt module can be added later).
- Homepage `UsageSection` integration (the tabs section is already stale for Solid/Svelte; separate follow-up).
- Per-framework live demos inside Next.js docs pages (no framework has these).

## Architecture

Three-layer design with a shared core:

1. **Core** — `src/computePath.ts`: a pure wrapper around `figma-squircle.getSvgPath()`. Shared by every surface. Zero Vue imports.
2. **Primitives** — two surfaces sit directly on the core:
   - **Directives** (`squircleDirective.ts`, `staticSquircleDirective.ts`) — implement `{ mounted, updated, beforeUnmount }` directive hooks; attach ResizeObserver (dynamic) or compute once synchronously (static).
   - **Composables** (`useSquircle.ts`, `useStaticSquircle.ts`) — accept a template ref + reactive options; use `onMounted` / `watchEffect` / `onBeforeUnmount` for lifecycle.
3. **Components** — `Squircle.vue`, `StaticSquircle.vue`, `SquircleNoScript.vue` are thin `<script setup>` wrappers that call the composables internally. This prevents the component and composable from drifting apart.

**Layering rule:** `Component → composable → core`. `Directive → core` (directives don't run inside `setup()`, so they can't consume composables; they implement the same client-side sizing logic against the raw core).

Both primitives are tested independently.

## API Surface

### Components

```vue
<Squircle
  :corner-radius="16"
  :corner-smoothing="0.6"
  :width="200"            <!-- optional: force size -->
  :height="100"           <!-- optional: force size -->
  :default-width="200"    <!-- optional: SSR preview size -->
  :default-height="100"   <!-- optional: SSR preview size -->
>
  <slot />
</Squircle>

<StaticSquircle
  :width="200"
  :height="100"
  :corner-radius="16"
  :corner-smoothing="0.6"
>
  <slot />
</StaticSquircle>

<SquircleNoScript />
```

- `Squircle`: measures its rendered size via `ResizeObserver`; re-applies clip-path on resize.
- `StaticSquircle`: takes explicit `width` / `height`; no observer; best for known-size elements.
- `SquircleNoScript`: teleports a `<noscript><style>…</style></noscript>` into `<head>`. Targets `[data-squircle]` and falls back to `border-radius: attr(data-squircle)`. Same content as the Svelte/Solid/React equivalents.
- All components forward attributes (`class`, `style`, event listeners) to the root `<div>`.

### Directives

```vue
<template>
  <div v-squircle="{ cornerRadius: 16, cornerSmoothing: 0.6 }">…</div>

  <div v-static-squircle="{ width: 200, height: 100, cornerRadius: 16 }">…</div>
</template>
```

- `v-squircle`: attaches ResizeObserver; re-runs on binding value change (Vue's `updated()`).
- `v-static-squircle`: computes once on `mounted`, re-computes on `updated`.
- Binding value type: `SquircleDirectiveOptions` / `StaticSquircleDirectiveOptions`.
- On `beforeUnmount`, the directive disconnects its observer and clears inline styles.

### Composables

```ts
import { useTemplateRef } from 'vue'
import { useSquircle, useStaticSquircle } from '@squircle-js/vue'

const el = useTemplateRef<HTMLDivElement>('el')

useSquircle(el, { cornerRadius: 16, cornerSmoothing: 0.6 })

// or pass a computed/ref for reactive options:
import { ref, computed } from 'vue'
const radius = ref(16)
useSquircle(el, computed(() => ({ cornerRadius: radius.value })))
```

- Signature: `useSquircle(elRef, options)` where `options` accepts a plain object, a `Ref<…>`, or a `ComputedRef<…>`.
- Uses `watchEffect` internally so reactive options trigger re-application without manual wiring.
- Runs `onMounted` to attach observer, `onBeforeUnmount` to clean up.
- `useStaticSquircle` is the no-observer variant.

### Plugin

```ts
import { createApp } from 'vue'
import { SquirclePlugin } from '@squircle-js/vue'
import App from './App.vue'

createApp(App).use(SquirclePlugin).mount('#app')
```

- Registers all three components and both directives globally.
- Implemented as a ten-line file; zero options.
- Optional — tree-shakable imports remain the primary path.

### Exported types

- `SquircleProps`, `StaticSquircleProps`
- `SquircleDirectiveOptions`, `StaticSquircleDirectiveOptions`
- `UseSquircleOptions`, `UseStaticSquircleOptions`

## Package Structure

```
packages/vue/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .gitignore
├── README.md
└── src/
    ├── index.ts
    ├── computePath.ts
    ├── useSquircle.ts
    ├── useStaticSquircle.ts
    ├── squircleDirective.ts
    ├── staticSquircleDirective.ts
    ├── Squircle.vue
    ├── StaticSquircle.vue
    ├── SquircleNoScript.vue
    ├── plugin.ts
    └── __tests__/
        ├── Squircle.test.ts
        ├── useSquircle.test.ts
        └── squircleDirective.test.ts
```

## Build

- **Tool:** Vite in library mode (`vite build` with `build.lib` config) + `@vitejs/plugin-vue` + `vite-plugin-dts` for `.d.ts` generation. SFCs compile to `.js` at build time — consumers don't need any Vue SFC tooling.
- **Output formats:** ESM (`dist/index.mjs`) + CJS (`dist/index.js`) + types (`dist/index.d.ts`).
- **Package exports:** `exports` map with `types`, `import`, `require`, plus a top-level `module`, `main`, `types`. Include `files: ["dist"]`.
- **Scripts:**
  - `build`: `vite build`
  - `dev`: `vite build --watch`
  - `typecheck`: `vue-tsc --noEmit`
  - `test`: `vitest run`
  - `clean`: `rm -rf .turbo dist node_modules`
- **Peer deps:** `vue: ^3.3.0`.
- **Dependencies:** `figma-squircle: 1.1.0` (same version as React/Solid/Svelte).
- **Dev deps:** `@vitejs/plugin-vue`, `vite`, `vite-plugin-dts`, `vue-tsc`, `vue`, `vitest`, `jsdom`, `@testing-library/vue`, `@vue/test-utils`, `@squircle-js/tsconfig`.

## Testing

- **Stack:** `vitest` + `jsdom` environment + `@testing-library/vue` (for component/composable) + `@vue/test-utils` (for directive, which RTL doesn't cleanly cover).
- **Coverage floor:** one smoke test per surface — does not exceed the scope of the Svelte/Solid packages.
  - `Squircle.test.ts` — renders, forwards `class`, applies `clip-path` after mount.
  - `useSquircle.test.ts` — mounts, applies styles, unmounts cleanly.
  - `squircleDirective.test.ts` — `mounted` applies, `updated` re-applies, `beforeUnmount` cleans up.
- **Config:** `vitest.config.ts` with `test.environment = "jsdom"`, `test.globals = true`, excludes `node_modules` and `dist`.

## SSR

- Components render markup server-side; clip-path computation runs client-side in `onMounted`. SSR output is unstyled until hydration — consistent behavior with React/Solid/Svelte.
- When `defaultWidth` / `defaultHeight` are provided on `<Squircle>`, the component renders an SSR-visible `clip-path` using those dimensions. Prevents layout pop-in under Nuxt SSR.
- Directive's `mounted` hook only runs client-side in Vue 3 SSR (Vue 3 skips directive hooks on the server), so no server guards needed.
- `SquircleNoScript` uses `<Teleport to="head">`. Vue 3 SSR (and Nuxt) serialize Teleport contents into the server HTML, so the noscript fallback is present in the initial document.

## Release

- Add `.changeset/vue-package.md` with a `minor` bump for `@squircle-js/vue`.
- The existing Changesets GitHub Action picks it up, opens a Version Packages PR, and publishes `@squircle-js/vue@0.1.0` to npm on merge.
- Turbo pipeline picks up the new package automatically (matches `packages/*`).
- No workflow YAML changes required.

## Integration With The Rest Of The Repo

**`README.md` (root)**
- Add a Vue row to the framework support table.
- Add a short Vue usage snippet mirroring the Svelte one.

**`biome.jsonc`**
- Add `**/*.vue` to the `files.includes` exclusion list (current value: `["!**/*.svelte"]` after the tool ruling against `**` catch-all). Final value: `["!**/*.svelte", "!**/*.vue"]`.

**`apps/web/components/docs-sidebar.tsx`**
- Append `"vue"` to `GROUP_ORDER`.
- Add `vue: "Vue"` to `GROUP_LABELS`.

**`apps/web/content/docs/` — 8 new pages**
| # | Slug | Content |
|---|------|---------|
| 1 | `vue-getting-started.mdx` | Install, Vue 3 requirement, plugin vs. tree-shakable imports |
| 2 | `vue-squircle-component.mdx` | `<Squircle>` props, slots, dynamic resize |
| 3 | `vue-static-squircle.mdx` | `<StaticSquircle>` use cases + perf benefit |
| 4 | `vue-directive.mdx` | `v-squircle` / `v-static-squircle` as `asChild` replacement |
| 5 | `vue-composable.mdx` | `useSquircle` / `useStaticSquircle` with template refs + reactive options |
| 6 | `vue-corner-smoothing.mdx` | Smoothing parameter explainer |
| 7 | `vue-no-javascript-fallback.mdx` | `<SquircleNoScript>` + Nuxt SSR note |
| 8 | `vue-examples.mdx` | Cards, buttons, avatars, hero backgrounds |

All pages use frontmatter `group: "vue"` and have sequential `order` values 1–8.

## Known Limitations

- **No `border-width` support** — carries over from React/Solid/Svelte; `clip-path` does not paint borders.
- **Directive has no SSR preview** — `v-squircle` does not support `defaultWidth` / `defaultHeight` the way `<Squircle>` does. Users who need SSR preview should use the component. Documented on the directive page.

## Success Criteria

1. `pnpm build` builds the new package; `dist/index.mjs`, `dist/index.js`, `dist/index.d.ts` exist.
2. `pnpm typecheck` passes (`vue-tsc --noEmit`).
3. `pnpm test` runs three smoke tests, all passing.
4. `pnpm check` stays clean (no new Biome lint errors after the `.vue` exclusion is added).
5. `apps/web` builds; the 8 new docs pages render under `/docs/vue-*`.
6. The Vue sidebar group appears after React and Solid and Svelte.
7. Changeset PR opened by CI after merge; publishable to npm.
