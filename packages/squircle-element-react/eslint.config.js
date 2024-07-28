import baseConfig from "@squircle-js/eslint-config/base";
import reactConfig from "@squircle-js/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];