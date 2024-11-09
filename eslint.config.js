import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import libramPlugin from "eslint-plugin-libram";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    ignores: ["node_modules/", "build/", "types/"],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: { ...globals.browser },
    },
    plugins: {
      "react-hooks": fixupPluginRules(reactHooksPlugin),
      libram: libramPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      "block-scoped-var": "error",
      curly: ["error", "multi-line"],
      "eol-last": "error",
      eqeqeq: "error",
      "import/default": "off", // performance in editor
      "import/namespace": "off", // performance in editor
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          named: true,
          "newlines-between": "always",
        },
      ],
      "no-trailing-spaces": "error",
      "no-var": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-template": "error",
      "spaced-comment": ["error", "always", { markers: ["/"] }],
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/exhaustive-deps": [
        "error",
        {
          additionalHooks: "(useNag)",
        },
      ],
      "libram/verify-constants": "error",
    },
  },
  {
    files: ["KoLmafia/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.commonjs,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
