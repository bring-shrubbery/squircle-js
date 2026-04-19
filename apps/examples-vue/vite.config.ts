import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const examples = [
  "button",
  "card",
  "avatar",
  "image-container",
  "app-icon",
  "notification-badge",
  "icon-button",
  "reactive-squircle",
  "list-of-squircles",
  "transitions",
];

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries([
        ["index", resolve(import.meta.dirname, "index.html")],
        ...examples.map((name) => [
          name,
          resolve(import.meta.dirname, `${name}.html`),
        ]),
      ]),
    },
  },
});
