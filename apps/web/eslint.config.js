import baseConfig, { restrictEnvAccess } from "@squircle-js/eslint-config/base";
import nextjsConfig from "@squircle-js/eslint-config/nextjs";
import reactConfig from "@squircle-js/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];