import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  preprocess: vitePreprocess(),
  package: {
    dir: "dist",
    emitTypes: true,
  },
};
