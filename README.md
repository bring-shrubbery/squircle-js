# Squircle Button

This is a project aiming at bringing the iOS-style squircle to your frontend projects.

## Features

- Responsive squircle element that can be used as any intrinsic component.
- Fallback solution for No-JavaScript.
- CommonJS and ES6 (tree-shakeable).
- Available for React (with `react@18` support), with other frameworks coming later.
- Documented usage examples.

## Usage

### with React

Install

```bash
pnpm add @squircle-js/react
```

Add to your project

```tsx
import { Squircle } from "@squircle-js/react";

const YourComponent = () => {
  return (
    <Squircle
      cornerRadius={10}
      cornerSmoothing={1}
      className="p-4 bg-black text-white"
    >
      Squircle!
    </Squircle>
  );
};

// Also add a global component to make sure it still works when JavaScript is disabled.
// _app.tsx, or root-level layout.tsx
import { SquircleNoScript } from "@squircle-js/react";

...
<SquircleNoScript />
...
```

## License

This project is licensed under [MIT License](./LICENSE)
