import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.tsx"],
    format: ["cjs", "esm"],
    dts: true,
    external: ["react"],
    outExtension({ format }) {
        return {
            js: format === "esm" ? ".mjs" : ".js",
        }
    },
})