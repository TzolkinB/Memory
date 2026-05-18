import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ["percy.config.ts", "vite.config.ts", "scripts/*.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.ts"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // percySnapshot() is the assertion in visual tests — treat it as one
      "playwright/expect-expect": [
        "warn",
        { assertFunctionNames: ["expect", "percySnapshot", "expectCardFaceUp", "expectFaceUpCount", "clickCardAndVerifyFaceUp"] },
      ],
    },
  },
  {
    // networkidle is intentional here: Percy needs animations to settle before snapshotting
    files: ["tests/visual/**/*.ts"],
    rules: {
      "playwright/no-networkidle": "off",
    },
  },
  prettierConfig,
  {
    // Enforce readable chained locator calls in test files.
    // ignoreChainWithDepth: 3 allows up to 3 links on one line (covers most simple locators);
    // longer chains must break onto separate lines. This block must come after prettierConfig
    // because prettier-config disables this rule — re-enabling it here overrides that.
    files: ["tests/**/*.ts"],
    rules: {
      "newline-per-chained-call": ["warn", { ignoreChainWithDepth: 3 }],
    },
  },
);
