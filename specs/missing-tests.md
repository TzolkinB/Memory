# Missing Test Plan

## 1. Deck Switching

**File:** `tests/deck-switching.spec.ts`  
**Seed:** `tests/seed.spec.ts`

### 1.1 Switch to Dragons deck

**Steps:**

1. Navigate to `/`
2. Click the "Choose Deck" button in the app bar
3. Verify the deck selector modal is visible
4. Click the "Cancel" button and verify the modal is closed
5. Click the "Choose Deck" button in the app bar again
6. Click the "Close" (X) button and verify the modal is closed
7. Click the "Choose Deck" button in the app bar again
8. Click the "Wings of Fire Dragons" deck option
9. Click the "Select" / confirm button (or click the deck option if it auto-selects)
10. Verify the modal is dismissed

**Verifications:**

- All 12 cards are re-rendered face-down
- Blue player's turn is shown (scores reset to 0)
- Cards render dragon images (not robot images)

### 1.2 Reset is deterministic after deck switch

**Steps:**

1. Navigate to `/`
2. Switch to the Dragons deck (via deck selector modal)
3. Flip 2 cards (mismatch)
4. Click "Restart" and confirm

**Verifications:**

- All 12 cards return to face-down state
- Blue player's turn and 0–0 score displayed
- Card order matches the seeded shuffle for the dragons deck (`VITE_SHUFFLE_SEED=42`)

---

## 2. Win Outcomes

**File:** `tests/core/outcome-variants.spec.ts`  
**Seed:** `tests/seed.spec.ts`

> Note: Uses `VITE_SHUFFLE_SEED=42` (set automatically in Playwright builds). Card positions are deterministic — use the same positions established in `win-conditions.spec.ts`.

### 2.1 Red player wins

**Steps:**

1. Navigate to `/`
2. Have Blue make a mismatch (flip cards at positions 6 and 8 — known mismatch)
3. Have Red match all 6 pairs
4. Have Blue match 0 pairs

> Use the seeded order: force Blue to mismatch each turn while Red matches, to reach Red 6 – Blue 0 (or any Red > Blue distribution totaling 6 matches).

**Verifications:**

- Toast displays "Red Player Wins!"
- `data-testid="score-red"` shows the higher score
- `data-testid="score-blue"` shows the lower score
- All 12 cards are face-up
- Clicking a card after win does not change scores

### 2.2 Tie outcome

**Steps:**

1. Navigate to `/`
2. Have Blue match exactly 3 pairs
3. Have Red match exactly 3 pairs (all 6 pairs total)

> Achieve by: Blue matches 3, then mismatches to hand turn to Red, Red matches remaining 3.

**Verifications:**

- Toast displays "It's a Tie!"
- Both scores show `3`
- All 12 cards are face-up

---

## 3. Mobile Viewport

**File:** `tests/visual-smoke-baseline.spec.ts` (add viewport) or `tests/mobile-viewport.spec.ts`

### 3.1 Game renders correctly at 390×844 (iPhone 14)

**Steps:**

1. Set viewport to `{ width: 390, height: 844 }`
2. Navigate to `/`
3. Verify initial game state

**Verifications:**

- All 12 cards visible (may require scroll)
- "Blue Player's Turn" text visible
- Restart button visible
- Visual snapshot captured: `mobile-loaded-state.png`

---

## 4. Image Validation

**File:** `tests/edge-cases/card-images.spec.ts`  
**Seed:** `tests/seed.spec.ts`

### 4.1 Robot cards render images on flip (Robots deck)

**Steps:**

1. Navigate to `/`
2. Click the first card

**Verifications:**

- An `<img>` element is visible within the flipped card
- The `src` attribute matches the `robohash.org/${id}` pattern
- The image has a non-empty `alt` attribute

### 4.2 Dragon cards render named images on flip (Dragons deck)

**Steps:**

1. Navigate to `/`
2. Switch to the Dragons deck
3. Click the first card

**Verifications:**

- An `<img>` element is visible within the flipped card
- The `src` attribute matches `wikia.nocookie.net` (known dragon image host)
- The `alt` attribute contains the dragon's name (e.g. "Glory")
