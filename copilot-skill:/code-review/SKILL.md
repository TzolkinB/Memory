# Code Review Guardrails

Use this skill to prevent behavior-contract drift when addressing code review feedback.

> Repo-wide coding standards (React patterns, TypeScript rules, env vars, testing, file system safety) are defined in `.github/copilot-instructions.md`. This skill covers review-specific process rules and checklist items that build on top of those standards.

---

## Rules

1. Behavior/docs parity check

- If a change modifies runtime defaults, fallback paths, environment branching, or feature flags, verify all user-facing docs still match behavior.
- At minimum, check README sections that describe environment variables and default behavior.

2. Env var fallback rule

- Do not introduce implicit environment-specific defaults (e.g. a DEV-only fallback seed) unless explicitly requested and documented.
- Prefer explicit opt-in: env var set → deterministic behavior; env var unset → existing default behavior.
- See `.github/copilot-instructions.md` → Environment Variables for the full rule.

3. Review-comment workflow

- Validate the concern against current code and docs before proposing a fix.
- Discuss and propose options; implement only after explicit user approval.
- After implementation, add/update a guardrail here or in the companion prompt to prevent recurrence.

4. File system write safety

- Before any `writeFileSync`, ensure the target directory exists with `mkdirSync(dir, { recursive: true })`.
- Applies especially to early-exit/error branches where the output dir may not yet exist.
- See `.github/copilot-instructions.md` → File system / Node scripts for the full rule.

5. React patterns

- Follow idiomatic React patterns — do not deviate without an explicit reason.
- Flag deviations from the patterns defined in `.github/copilot-instructions.md` → React patterns.
- Key pattern to check: `useReducer(reducer, initialArg, init)` — `initialArg` must be an explicit value, not `undefined`.

---

## Checklist (quick)

- Does the change follow React patterns? (see `.github/copilot-instructions.md`)
- Did this change alter behavior when config/env var is unset?
- Did this change alter behavior across DEV/PROD/TEST environments?
- Are docs still accurate (README + any setup docs)?
- Are TypeScript types as narrow as possible? No unnecessary `as` casts or `| string` widening?
- Are file system writes preceded by directory creation?
- Are tests aligned with the intended behavior?
