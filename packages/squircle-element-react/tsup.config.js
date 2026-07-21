import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx", "src/base.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react"],
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".cjs",
    };
  },
});
