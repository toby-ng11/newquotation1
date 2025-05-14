import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import pluginTailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // JavaScript config
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
    },
  },
  // TypeScript config
  {
    files: ["**/*.{ts,cts,mts}"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2022,
        project: "./tsconfig.json", // remove if no TS project references
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
    },
  },
  ...pluginVue.configs["flat/recommended"],
  // Vue + TypeScript (.vue files with TS support)
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: require("vue-eslint-parser"),
      parserOptions: {
        parser: parserTs,
        ecmaVersion: 2022,
        sourceType: "module",
        extraFileExtensions: [".vue"],
        project: "./tsconfig.json",
      },
    },
    plugins: {
      vue: pluginVue,
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...pluginVue.configs["flat/recommended"][0].rules,
      ...pluginTs.configs.recommended.rules,
    },
  },
  // Tailwind class sorting & validation
  {
    files: ["**/*.{vue,js,ts,jsx,tsx}"],
    plugins: {
      tailwindcss: pluginTailwind,
    },
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off", // change to "warn" if needed
    },
  },
  // Prettier (disable conflicting formatting rules)
  {
    rules: {
      ...prettier.rules,
    },
  },
]);
