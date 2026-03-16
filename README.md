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

    $ npm run test:e2e

Run with the Playwright UI (interactive, with time-travel debugging):

    $ npm run test:e2e:ui

Run in a visible browser window:

    $ npm run test:e2e:headed

The test runner automatically builds the app and starts a preview server on
`http://localhost:4173` before running tests. No manual server start needed.

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
