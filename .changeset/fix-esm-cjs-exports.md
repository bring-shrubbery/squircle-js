---
"@squircle-js/react": patch
"@squircle-js/vue": patch
"@squircle-js/solid": patch
---

Unify and repair the exports contract across `@squircle-js/react`, `@squircle-js/vue`, and `@squircle-js/solid`.

Both `@squircle-js/react@1.3.0` and `@squircle-js/vue@0.1.0` shipped CJS content in a `dist/index.js` file while declaring `"type": "module"` in their package. Under that declaration Node parses every `.js` file as ESM, so any consumer that reached the package via Node's native loader (Next.js `serverExternalPackages`, `node --input-type=module`, Bun, Node 22+ `require(esm)`) hit `ReferenceError: module is not defined` on `import()` or a silently empty object on `require()`. Bundlers were unaffected because they prefer the non-standard `module` field pointing at `.mjs`.

Fixes:

- `@squircle-js/react`: `tsup` now emits CJS as `.cjs`; `package.json` gains an `exports` field with `import` / `require` conditions each carrying their own `types` (`.d.ts` / `.d.cts`); `main` points at `./dist/index.cjs`; `files: ["dist"]` matches the sibling packages.
- `@squircle-js/vue`: Vite now emits CJS as `index.cjs`; `package.json` `main` and the `exports.require` condition point at `./dist/index.cjs`; the `exports` shape is restructured to the same per-condition form as `@squircle-js/react` and `@squircle-js/solid`.
- `@squircle-js/solid`: no functional change (its CJS output was already `.cjs` and its ESM output is real ESM); adds a top-level `default` fallback in `exports` to match the other packages.

After this change, all three packages resolve consistently via Node native `import()`, Node `require()` (Node 22+ `require(esm)` interop), and every bundler that honors `exports`.
