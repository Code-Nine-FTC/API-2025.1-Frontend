// eslint.config.js
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    plugins: { react: pluginReact },
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [js.configs.recommended],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: pluginReact,
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      // Outras regras específicas do TS podem ser adicionadas aqui
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    extends: [
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
    ],
  },
]);

function exemplo(valor) { /* ... */ }
// const _err = null; // ou remova se não usar
