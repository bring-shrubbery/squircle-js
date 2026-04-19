import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const examples = [
  "button",
  "card",
  "avatar",
  "image-container",
  "app-icon",
  "notification-badge",
  "motion-card",
  "icon-button",
  "reactive-squircle",
  "list-of-squircles",
];

export default defineConfig({
  plugins: [solid(), tailwindcss()],
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
