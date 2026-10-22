# Memory Game: Untested Coverage Gaps

## Application Overview

A two-player memory game with 12 cards and two selectable decks (robots and dragons). Existing E2E tests cover initial setup, card flips, matches and mismatches, turn switching, a blue-player win, restart behavior, card interaction edge cases, deterministic shuffle, and Percy snapshots at desktop and tablet sizes. This plan covers remaining deck-selection behavior, red-win and tie outcomes, keyboard accessibility, and mobile layout. All scenarios start from a fresh seeded game; the seed test file is tests/e2e/seed.spec.ts. Browser exploration could not be completed because the configured Playwright Chromium executable is not installed, so this plan is based on existing specs and the application implementation.

## Test Scenarios

### 1. Deck Selection

**Seed:** `tests/e2e/seed.spec.ts`

#### 1.1. Select the dragons deck from a fresh game

**File:** `tests/e2e/decks/deck-selection.spec.ts`

**Steps:**
  1. Start from a fresh game and verify the robots deck is selected, all 12 cards are face-down, both scores are 0, and Blue Player is active.
    - expect: The initial deck is robots and the game is in its initial state.
  2. Open the Change Deck control and select Dragons.
    - expect: The deck selector closes.
    - expect: The control identifies Dragons as the selected deck.
    - expect: All 12 cards remain face-down, both scores are 0, and Blue Player is active.
    - expect: The cards display dragon identities rather than robot identities.
  3. Inspect the card identities on the board.
    - expect: There are six distinct dragon identities, each represented by exactly two cards.

#### 1.2. Switch decks after making progress

**File:** `tests/e2e/decks/deck-selection.spec.ts`

**Steps:**
  1. Start from a fresh seeded game and make a known robot pair using cards at positions 1 and 10.
    - expect: Blue Player's score is 1 and the matched pair remains face-up.
  2. Open Change Deck and select Dragons.
    - expect: The selector closes and Dragons is selected.
    - expect: Both scores reset to 0, Blue Player is active, and all 12 cards are face-down.
    - expect: The board contains dragon cards.

#### 1.3. Cancel deck selection without changing the current game

**File:** `tests/e2e/decks/deck-selection.spec.ts`

**Steps:**
  1. Start from a fresh seeded game, make a known robot pair using cards at positions 1 and 10, and open Change Deck.
    - expect: Blue Player's score is 1 and the selector is visible.
  2. Choose Cancel, reopen the selector, and close it with its Close control.
    - expect: The selector closes after each action.
    - expect: Robots remain selected, the score remains 1, the matched pair remains face-up, and the active player remains Blue.

#### 1.4. Dismiss deck selection with Escape

**File:** `tests/e2e/decks/deck-selection.spec.ts`

**Steps:**
  1. Start from a fresh game and open Change Deck.
    - expect: The deck selector is visible.
  2. Press Escape.
    - expect: The selector closes without changing the selected deck, scores, active player, or card state.

### 2. Game Completion Outcomes

**Seed:** `tests/e2e/seed.spec.ts`

#### 2.1. Red player wins after the final pair

**File:** `tests/e2e/game-outcomes.spec.ts`

**Steps:**
  1. Start fresh. Have Blue match the pairs at positions 0 and 9, then 1 and 10.
    - expect: Blue Player's score is 2 and Blue remains active.
  2. Click cards 2 and 3 to miss and pass the turn.
    - expect: The unmatched cards flip down and Red Player becomes active.
  3. Have Red match pairs at positions 2 and 5, 3 and 4, 6 and 7, and 8 and 11.
    - expect: The game ends with all cards face-up and scores Blue 2, Red 4.
    - expect: A Red Player Wins notification appears.
    - expect: Further card clicks do not change the scores or game state.

#### 2.2. The game reports a tie

**File:** `tests/e2e/game-outcomes.spec.ts`

**Steps:**
  1. Start fresh. Have Blue match pairs at positions 0 and 9, 1 and 10, and 2 and 5.
    - expect: Blue Player's score is 3 and Blue remains active.
  2. Click cards 3 and 6 to miss and pass the turn.
    - expect: The unmatched cards flip down and Red Player becomes active.
  3. Have Red match pairs at positions 3 and 4, 6 and 7, and 8 and 11.
    - expect: The game ends with all cards face-up and scores Blue 3, Red 3.
    - expect: A tie notification appears.
    - expect: Further card clicks do not change the scores or game state.

### 3. Accessibility and Responsive Layout

**Seed:** `tests/e2e/seed.spec.ts`

#### 3.1. Flip cards with keyboard controls

**File:** `tests/e2e/accessibility.spec.ts`

**Steps:**
  1. Start from a fresh game and focus a face-down card using Tab navigation.
    - expect: The card can receive keyboard focus and exposes an accessible name and button semantics.
  2. Activate the card with Enter, then focus another face-down card and activate it with Space.
    - expect: Each activation flips only its focused card.
    - expect: After two activations, the normal match-check flow runs and the page remains keyboard operable.

#### 3.2. Game controls and cards fit a phone viewport

**File:** `tests/e2e/mobile-layout.spec.ts`

**Steps:**
  1. Set the viewport to 375 by 812 pixels and load a fresh game.
    - expect: The game controls, player turn, scores, and all 12 cards are visible and usable.
    - expect: The page has no unintended horizontal overflow and content does not overlap.
  2. Open the deck selector, verify its choices and controls are reachable, then close it. Open the restart confirmation and verify its actions are reachable, then cancel.
    - expect: Both dialogs fit within the viewport and their controls are usable without horizontal scrolling.
    - expect: Canceling restart leaves the game unchanged.
