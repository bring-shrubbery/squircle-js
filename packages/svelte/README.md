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

For elements with known dimensions, prefer `StaticSquircle` / `use:staticSquircle`. For dynamic `Squircle`, pass `defaultWidth` and `defaultHeight` when you can.

## Docs

Full documentation: https://squircle.js.org/docs/svelte-getting-started
