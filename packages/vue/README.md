# @squircle-js/vue

iOS-style squircle (smooth corners) for Vue 3.

## Install

```bash
pnpm add @squircle-js/vue
# or
npm install @squircle-js/vue
```

Requires Vue 3.3 or later.

## Component usage

```vue
<script setup>
import { Squircle } from "@squircle-js/vue";
</script>

<template>
  <Squircle :corner-radius="24" :corner-smoothing="0.6" class="card">
    <h2>Hello, squircle</h2>
  </Squircle>
</template>
```

## Directive usage (no wrapper element)

Apply the squircle clip-path directly to any element — no extra DOM node:

```vue
<script setup>
import { squircleDirective as vSquircle } from "@squircle-js/vue";
</script>

<template>
  <button
    v-squircle="{ cornerRadius: 12, cornerSmoothing: 0.6 }"
    class="bg-indigo-600 px-4 py-2 text-white"
  >
    Click me
  </button>
</template>
```

Or install globally via the plugin:

```ts
// main.ts
import { createApp } from "vue";
import { SquirclePlugin } from "@squircle-js/vue";
import App from "./App.vue";

createApp(App).use(SquirclePlugin).mount("#app");
```

Then `v-squircle` and `v-static-squircle` are available in every template.

## Composable usage

```vue
<script setup>
import { ref } from "vue";
import { useSquircle } from "@squircle-js/vue";

const el = ref<HTMLElement | null>(null);
useSquircle(el, { cornerRadius: 16, cornerSmoothing: 0.6 });
</script>

<template>
  <div ref="el" class="bg-indigo-500 p-6">Content</div>
</template>
```

## Static (fixed-dimension) variant

For elements whose size is known at authoring time, skip the `ResizeObserver`:

```vue
<script setup>
import { StaticSquircle, staticSquircleDirective as vStaticSquircle } from "@squircle-js/vue";
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
```

## SSR / Nuxt

Add `<SquircleNoScript />` once in your root layout for a `border-radius` fallback when JavaScript is disabled. For elements with known dimensions, prefer `StaticSquircle` / `v-static-squircle`. For dynamic `Squircle`, pass `defaultWidth` and `defaultHeight` when you can.

## Docs

Full documentation: https://squircle.js.org/docs/vue-getting-started
