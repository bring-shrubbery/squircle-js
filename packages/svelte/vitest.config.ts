import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte({ hot: false })],
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["node_modules", "dist", ".svelte-kit"],
  },
  resolve: {
    conditions: ["browser"],
  },
});
