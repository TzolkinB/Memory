// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp, expectCardFaceUp } from '../../utils';

test.describe('Core Game Mechanics — Match Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Match Detection and Scoring', async ({ page }) => {
    const cards = page.getByTestId('card');

    // Wait for initial state
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expect(page.getByTestId('score-blue'), 'blue score should start at 0').toHaveText('0');
    await expect(page.getByTestId('score-red'), 'red score should start at 0').toHaveText('0');

    // 1. Click card at index 0 (Robot ID 3)
    await clickCardAndVerifyFaceUp(cards.nth(0));

    // 2. Click card at index 9 (Robot ID 3 - matching pair)
    // expect: Cards remain face-up after checking period
    // expect: Blue player score increments to 1
    // expect: Turn remains with blue player (successful match)
    await clickCardAndVerifyFaceUp(cards.nth(9));

    // Verify match was successful - cards should remain face-up and score should increment
    await expectCardFaceUp(cards.nth(0));
    await expectCardFaceUp(cards.nth(9));
    await expect(page.getByTestId('score-blue'), 'blue score should increment to 1 after matching Robot ID 3').toHaveText('1');
    await expect(page.getByTestId('score-red'), 'red score should remain 0 — no match yet').toHaveText('0');

    // Turn should remain with blue player after successful match
    await expect(page.getByText("Blue Player's Turn"), 'turn should remain with blue after a successful match').toBeVisible();

    // 3. Click card at index 1 (Robot ID 1)
    await clickCardAndVerifyFaceUp(cards.nth(1));

    // 4. Click card at index 2 (Robot ID 12 - non-matching)
    // expect: Matched cards from previous turn remain face-up
    await clickCardAndVerifyFaceUp(cards.nth(2));

    // Wait for mismatch processing - turn should switch to red player
    await expect(page.getByText("Red Player's Turn"), 'turn should switch to red after a mismatch').toBeVisible();

    // Verify mismatched cards are now face-down
    await expect(cards.nth(1), 'mismatched card at index 1 should flip back face-down').toHaveAttribute('data-face-up', 'false');
    await expect(cards.nth(2), 'mismatched card at index 2 should flip back face-down').toHaveAttribute('data-face-up', 'false');

    // Verify previously matched cards remain face-up
    await expectCardFaceUp(cards.nth(0));
    await expectCardFaceUp(cards.nth(9));

    // Verify scores remain unchanged after mismatch
    await expect(page.getByTestId('score-blue'), 'blue score should not change after a mismatch').toHaveText('1');
    await expect(page.getByTestId('score-red'), 'red score should remain 0 after a mismatch').toHaveText('0');
  });
});
