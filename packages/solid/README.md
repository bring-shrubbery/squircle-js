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

| Prop              | Type      | Default | Description                                                     |
| ----------------- | --------- | ------- | --------------------------------------------------------------- |
| `cornerRadius`    | `number`  | —       | Corner radius in pixels                                         |
| `cornerSmoothing` | `number`  | `0.6`   | Smoothing intensity, `0`–`1`                                    |
| `width`           | `number`  | —       | Override measured width                                         |
| `height`          | `number`  | —       | Override measured height                                        |
| `defaultWidth`    | `number`  | —       | Width used before first measurement / on SSR                    |
| `defaultHeight`   | `number`  | —       | Height used before first measurement / on SSR                   |
| `asChild`         | `boolean` | `false` | Apply styles to the child element instead of a wrapping `<div>` |

Plus any standard `div` HTML attributes.

## License

MIT
