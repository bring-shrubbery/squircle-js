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
pnpm add @squircle-element/react
```

Add to your project

```tsx
import { SquircleElement } from "@squircle-element/react";

const YourComponent = () => {
  return (
    <SquircleElement
      cornerRadius={10}
      cornerSmoothing={1}
      className="p-4 bg-black text-white"
    >
      Squircle!
    </SquircleElement>
  );
};
```

## License

This project is licensed under [MIT License](./LICENSE)
