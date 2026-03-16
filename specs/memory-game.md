# Memory Card Game E2E Test Plan

## Application Overview

A comprehensive test plan for the Memory card game covering core gameplay mechanics, edge cases, and user interactions. The game is a two-player memory/concentration game where players take turns flipping cards to find matching pairs of robot images. The first player to find more matches wins.

## Test Scenarios

### 1. Core Game Mechanics

**Seed:** `tests/seed.spec.ts`

#### 1.1. Game Initialization

**File:** `tests/core/game-initialization.spec.ts`

**Steps:**

1. Navigate to the game
   - expect: Game loads successfully
   - expect: Page title shows 'Memory Game'

2. Verify initial game state
   - expect: 12 cards are visible on the game board
   - expect: All cards are face-down (data-face-up='false')
   - expect: Blue player is active (shows 'Blue Player's Turn')
   - expect: Both player scores are 0
   - expect: Card grid container is present
   - expect: Restart button is available

3. Verify deterministic card layout
   - expect: Cards appear in consistent positions due to seeded shuffle
   - expect: Each robot ID appears exactly twice (6 pairs total)
   - expect: Robot IDs are: 3, 1, 12, 5, 13, 2

#### 1.2. Card Flipping Behavior

**File:** `tests/core/card-flipping.spec.ts`

**Steps:**

1. Click on the first card
   - expect: Card flips face-up (data-face-up='true')
   - expect: Card image becomes visible
   - expect: Only 1 card is face-up
   - expect: Game remains in idle state

2. Click on the same card again
   - expect: Click is ignored
   - expect: Card remains face-up
   - expect: No state change occurs

3. Click on a second different card
   - expect: Second card flips face-up
   - expect: Now 2 cards are face-up
   - expect: Game enters checking state for 500ms

4. Attempt to click a third card while checking
   - expect: Click is ignored during checking state
   - expect: Only 2 cards remain face-up
   - expect: Game continues checking process

#### 1.3. Match Detection and Scoring

**File:** `tests/core/match-detection.spec.ts`

**Steps:**

1. Click card at index 0 (Robot ID 3)
   - expect: Card flips face-up

2. Click card at index 9 (Robot ID 3 - matching pair)
   - expect: Second card flips face-up
   - expect: Cards remain face-up after checking period
   - expect: Blue player score increments to 1
   - expect: Turn remains with blue player (successful match)
   - expect: Game returns to idle state

3. Click card at index 1 (Robot ID 1)
   - expect: Card flips face-up

4. Click card at index 2 (Robot ID 12 - non-matching)
   - expect: Second card flips face-up initially
   - expect: After 500ms delay, both mismatched cards flip back face-down
   - expect: Matched cards from previous turn remain face-up
   - expect: Scores remain unchanged (Blue: 1, Red: 0)
   - expect: Turn switches to red player
   - expect: Game returns to idle state

#### 1.4. Player Turn Switching

**File:** `tests/core/player-turns.spec.ts`

**Steps:**

1. Start game and verify blue player begins
   - expect: 'Blue Player's Turn' text is visible
   - expect: Blue player text has blue styling

2. Make a failed match attempt (click two non-matching cards)
   - expect: After mismatch cards flip back (500ms delay)
   - expect: Turn switches to red player
   - expect: 'Red Player's Turn' text becomes visible
   - expect: Red player text has red styling

3. Have red player make a failed match attempt
   - expect: After second mismatch cards flip back (500ms delay)
   - expect: Turn switches back to blue player
   - expect: 'Blue Player's Turn' text becomes visible
   - expect: Blue player text has blue styling

4. Verify turn switching logic
   - expect: Turn switching only occurs on mismatches
   - expect: Successful matches keep the turn with the same player
   - expect: Turn alternation is consistent

#### 1.5. Win Conditions and Game Completion

**File:** `tests/core/win-conditions.spec.ts`

**Steps:**

1. Complete all 6 matches systematically
   - expect: Each successful match increments the active player's score
   - expect: All cards eventually become face-up and matched
   - expect: Final score reflects the match distribution

2. Verify game end state when blue player wins
   - expect: Toast notification appears with 'Blue Player Wins!' message
   - expect: Toast has blue heart icon
   - expect: Game status becomes finished
   - expect: No further card interactions possible

3. Verify game end state when red player wins
   - expect: Toast notification appears with 'Red Player Wins!' message
   - expect: Toast has red heart icon
   - expect: Game status becomes finished

4. Verify tie game scenario
   - expect: Toast notification appears with 'It is a tie!' message
   - expect: Toast has handshake icon
   - expect: Final scores are equal (3-3)

### 2. Game Controls and Restart

**Seed:** `tests/seed.spec.ts`

#### 2.1. Restart Functionality

**File:** `tests/controls/restart.spec.ts`

**Steps:**

1. Start a game and make some progress
   - expect: Some cards are matched and scores are non-zero
   - expect: Active player might be red

2. Click the Restart button
   - expect: Restart confirmation modal appears
   - expect: Modal has title asking for confirmation
   - expect: Modal shows 'Are you sure you want to reshuffle and restart the game?' text
   - expect: Modal has Cancel and Yes buttons
   - expect: Modal has close '×' button

3. Click Cancel button in modal
   - expect: Modal closes without changes
   - expect: Game state remains unchanged
   - expect: Scores and card states persist

4. Click Restart button again
   - expect: Modal opens again
   - expect: All dismissal options are available

5. Click close '×' button in modal
   - expect: Modal closes without changes
   - expect: Game state remains unchanged
   - expect: Scores and card states persist
   - expect: Close '×' button works same as Cancel

6. Click Restart button again and click Yes
   - expect: Modal closes
   - expect: All cards reset to face-down state
   - expect: Both player scores reset to 0
   - expect: Blue player becomes active again
   - expect: Cards are reshuffled to the same deterministic order
   - expect: Game returns to initial state

7. Verify restart from completed game
   - expect: Game can be restarted even after completion
   - expect: Win toast notifications are cleared
   - expect: Full reset to initial state occurs

### 3. Edge Cases and Error States

**Seed:** `tests/seed.spec.ts`

#### 3.1. Card Interaction Edge Cases

**File:** `tests/edge-cases/card-interactions.spec.ts`

**Steps:**

1. Attempt to click already matched cards
   - expect: Clicks on matched cards are ignored
   - expect: Game state remains unchanged
   - expect: Turn does not switch

2. Rapid clicking on cards
   - expect: Only the first valid click registers
   - expect: Subsequent rapid clicks are ignored
   - expect: Game state remains consistent

3. Click cards during checking state
   - expect: All card clicks during 500ms checking period are ignored
   - expect: Only two cards are face-up during checking
   - expect: Checking completes normally
