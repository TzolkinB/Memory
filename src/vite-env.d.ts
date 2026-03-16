/// <reference types="vite/client" />

/**
 * Extends Vite's built-in ImportMetaEnv to declare custom env variables.
 * Any variable prefixed with VITE_ is statically replaced at build time
 * and accessible via import.meta.env in source code.
 *
 * VITE_SHUFFLE_SEED — optional integer seed for the Fisher–Yates card shuffle.
 * When set, buildDeck() uses a deterministic LCG instead of Math.random,
 * producing the same card layout every run. Used by Playwright E2E tests
 * (set in the webServer build command in playwright.config.ts) so tests
 * can interact with a known, fixed card order without exposing card IDs
 * in the DOM. Omit in production; cards shuffle randomly when undefined.
 */
interface ImportMetaEnv {
  readonly VITE_SHUFFLE_SEED?: string;
}

/**
 * Augments the global ImportMeta interface so TypeScript recognises
 * import.meta.env as the typed ImportMetaEnv above, rather than the
 * default unknown/any type.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
