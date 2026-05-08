![CI/CD workflow](https://github.com/TzolkinB/Memory/actions/workflows/cicd.yml/badge.svg)

# Juego de Memoria

A memory game with robots!

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router v7
- React Hot Toast
- Bootstrap Material Design
- Playwright (E2E testing)

### Features

- 🤖 Two card decks: robots (RoboHash) and dragons — switchable mid-session
- 👥 Two-player turn-based gameplay
- 🎯 Score tracking for both players
- 🔄 Game restart functionality
- 📱 Responsive design with Bootstrap Material Design
- ✨ Toast notifications for game events

## How to Play

1. Blue player goes first
2. Click any card to flip it face-up
3. Click a second card to find a match
4. If cards match, you score a point and continue your turn
5. If cards don't match, they flip back and it's the other player's turn
6. Game ends when all 6 pairs are found
7. Player with the most matches wins!

---

## Prerequisites

- Node.js 18+
- npm or yarn

## Environment Variables

- `VITE_SHUFFLE_SEED` - When set during build, creates deterministic card shuffling for testing (automatically set to `42` in test builds)

## Installation

Install all of the npm dependencies:

    $ npm install

Install the Chromium browser for Playwright:

    $ npx playwright install chromium

## Usage

To start the client in development run (standard Vite script):

    $ npm run dev

This command will open a new window running at a default port of 5173 in your browser at
[http://localhost:5173](http://localhost:5173).

## Testing

E2E tests use [Playwright](https://playwright.dev). The test suite covers game
initialization, card flipping, match detection, win conditions, and player turn
switching.

Run all tests (headless):

    $ npm run test

Run with the Playwright UI (interactive, with time-travel debugging):

    $ npm run test:ui

The test runner automatically builds the app and starts a preview server on
`http://localhost:4173` before running tests. No manual server start needed.

### Visual regression tests

A visual smoke suite (`tests/visual-smoke-baseline.spec.ts`) captures screenshots
at desktop (1280×720) and tablet (820×1180) viewports for: the initial loaded
state, a flipped card, the restart modal, and the deck-selector modal.

Run visual tests:

    $ npm run test:visual

After intentional UI changes (library upgrades, layout changes), update the
baselines:

    $ npm run test:visual:update

Baseline snapshots are committed to the repo under
`tests/visual-smoke-baseline.spec.ts-snapshots/`. Always review the diffs in
the Playwright report before committing updated baselines.

### Deterministic shuffle in tests

`src/vite-env.d.ts` declares a custom Vite env variable `VITE_SHUFFLE_SEED`.
When this variable is set at build time, the card shuffle in
`src/components/Main.reducer.ts` uses a seeded linear congruential generator
instead of `Math.random`, producing the same card layout every run.

The Playwright build command (in `playwright.config.ts`) sets
`VITE_SHUFFLE_SEED=42` so E2E tests always see the same card order. In
development and production builds the variable is not set, so cards shuffle
randomly as normal.

## Build and Deploy

Hosted on Firebase
[https://memory-game1234.firebaseapp.com/](https://memory-game1234.firebaseapp.com/)

    $ npm run deploy or firebase deploy

## Project Structure

```
src/
├── components/
│   ├── Card.tsx              # Individual card component
│   ├── Main.tsx              # Main game container
│   ├── Main.reducer.ts       # Game state management (useReducer)
│   ├── Main.types.ts         # Shared TypeScript types
│   └── shared/
│       ├── AppBar.tsx        # Top navigation bar
│       ├── DeckSelectorModal.tsx  # Deck switcher modal
│       ├── Footer.tsx        # Footer component
│       └── RestartModal.tsx  # Restart confirmation modal
├── css/                      # Global styles
├── decks.ts                  # Deck definitions (robots, dragons)
├── robots.ts                 # Robot card data
├── dragons.ts                # Dragon card data
├── vite-env.d.ts             # Vite env variable declarations
└── app.tsx                   # App entry point
tests/
├── visual-smoke-baseline.spec.ts              # Visual regression smoke suite
├── visual-smoke-baseline.spec.ts-snapshots/   # Committed baseline images
├── restart-functionality.spec.ts
├── seed.spec.ts
├── shuffle.spec.ts
├── utils.ts                                   # Shared test utilities
├── core/
│   ├── card-flipping.spec.ts
│   ├── game-initialization.spec.ts
│   ├── match-detection.spec.ts
│   ├── player-turns.spec.ts
│   └── win-conditions.spec.ts
└── edge-cases/
    └── card-interactions.spec.ts
```
