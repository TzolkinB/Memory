# Copilot Instructions — Memory Game

These instructions apply to all Copilot interactions in this repo: code generation, edits, completions, and code review.

---

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Vite 6** — dev server and build tool
- **MDB React UI Kit** — component library (Bootstrap Material Design)
- **React Hot Toast** — notifications
- **React Router v7** — routing
- **Playwright** — E2E tests only (no unit test framework)
- **ESLint + Prettier** — linting and formatting
- **Firebase** — hosting and deploy target

---

## TypeScript

- `strict: true` is enabled — all code must be fully type-safe.
- No `any` unless absolutely unavoidable; use `unknown` and narrow it.
- Prefer closed union types (e.g. `'robots' | 'dragons'`) over `string` when the set of values is known.
- Use `type` imports (`import type { Foo }`) for type-only imports.
- Do not widen types with `| string` or `| undefined` unless the call site genuinely requires it.
- Remove unnecessary type casts (`as X`) when the type is already guaranteed by the signature.

---

## React patterns

Follow idiomatic React patterns. Do not deviate without an explicit reason.

- **`useReducer`**: use the three-argument form `useReducer(reducer, initialArg, init)` where `initialArg` is the explicit starting value — not `undefined`. This makes the default visible at the call site.
- **`useCallback` / `useMemo`**: wrap event handlers and callbacks passed as props; do not wrap values that are already stable.
- **`useEffect`**: always return a cleanup function when setting timeouts or subscriptions. Declare all dependencies accurately.
- **State shape**: keep state in the reducer (`Main.reducer.ts`), not scattered across `useState` calls in components. Local UI-only state (modal open/close) is the exception.
- **Dispatch actions**: use descriptive action type strings (`'FLIP_CARD'`, `'RESHUFFLE'`). Do not mutate state directly.
- **Components**: prefer function components returning `React.JSX.Element`. No class components.
- **Default values**: put default values where the logic lives (reducer defaults belong in the reducer), not at the call site.

---

## Code structure

- Game logic lives in `src/components/Main.reducer.ts`. Keep components thin.
- Shared/reusable components go in `src/components/shared/`.
- Types are in `src/components/Main.types.ts` and `src/decks.ts`. Do not duplicate type definitions.
- Data (decks, robots, dragons) lives in `src/decks.ts`, `src/robots.ts`, `src/dragons.ts`.
- Do not add runtime fallbacks for closed union lookups — if the type guarantees the key exists, index directly.

---

## Environment variables

- Declared in `src/vite-env.d.ts`.
- `VITE_SHUFFLE_SEED` — when set, produces a deterministic shuffle. Unset in dev and prod; always set to `42` in Playwright builds via `playwright.config.ts`.
- Do not add implicit env-specific defaults (e.g. a DEV-only fallback seed). Behavior must match documentation.
- README is the source of truth for env var behavior — keep it in sync.

---

## Testing

- All tests are Playwright E2E in `tests/`.
- Test build automatically sets `VITE_SHUFFLE_SEED=42` (see `playwright.config.ts`) — do not rely on random shuffle in tests.
- Use Playwright locators in this priority order:
  1. `getByRole` — preferred; reflects accessible semantics
  2. `getByLabel` — for form inputs with associated labels
  3. `getByText` — for visible text content
  4. `getByPlaceholder` — for inputs identified by placeholder
  5. `getByTestId` — when no semantic locator applies; requires a `data-testid` on the element
  6. CSS selectors — **do not use**; if this is the only option, add a `data-testid` to the element instead and use `getByTestId`
- Shared test utilities live in `tests/utils.ts` — add helpers there, not inline in spec files.
- Tests are organized by concern: `tests/core/` for game mechanics, `tests/edge-cases/` for boundary conditions.
- Run all tests: `npm run test:e2e`. Interactive mode: `npm run test:e2e:ui`.

---

## File system / Node scripts

- Before any `writeFileSync`, ensure the target directory exists with `mkdirSync(dir, { recursive: true })`.
- Scripts in `scripts/` use native Node `node:fs` and `node:path` — no third-party file utilities.

---

## Code review

When reviewing code, apply the rules in `copilot-skill:/code-review/SKILL.md` in addition to the above. Key things to check:

- Does the change follow React patterns (see above)?
- Does behavior still match the README and docs?
- Are env var defaults explicit and documented?
- Are file system writes preceded by directory creation?
- Are TypeScript types as narrow as possible?
