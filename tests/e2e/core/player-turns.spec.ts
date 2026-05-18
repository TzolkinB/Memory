// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp, expectCardFaceUp } from '../../utils';

test.describe('Core Game Mechanics — Player Turns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Player Turn Switching', async ({ page }) => {
    const cards = page.getByTestId('card');

    // 1. Start game and verify blue player begins
    // Blue player text has blue styling (.text-info)
    await expect(page.getByText("Blue Player's Turn"), 'game should start on blue player turn').toBeVisible();
    await expect(page.locator('.player-text.text-info')).toContainText(
      "Blue Player's Turn"
    );

    // 2. Make a failed match attempt (click two non-matching cards)
    // expect: Turn switches to red player
    // Red player text has red styling (.text-danger)
    await clickCardAndVerifyFaceUp(cards.nth(1)); // Robot ID 1
    await clickCardAndVerifyFaceUp(cards.nth(2)); // Robot ID 12

    await expect(page.getByText("Red Player's Turn"), 'turn should switch to red after blue mismatch').toBeVisible();
    await expect(page.locator('.player-text.text-danger')).toContainText(
      "Red Player's Turn"
    );

    // Verify cards flipped back after mismatch
    await expect(cards.nth(1), 'mismatched card at index 1 should flip back face-down').toHaveAttribute('data-face-up', 'false');
    await expect(cards.nth(2), 'mismatched card at index 2 should flip back face-down').toHaveAttribute('data-face-up', 'false');

    // 3. Have red player make a failed match attempt
    // expect: Turn switches back to blue player
    await clickCardAndVerifyFaceUp(cards.nth(3));
    await clickCardAndVerifyFaceUp(cards.nth(6));

    // Wait for turn switch back to blue player
    await expect(page.getByText("Blue Player's Turn"), 'turn should return to blue after red mismatch').toBeVisible();
    await expect(page.locator('.player-text.text-info')).toContainText(
      "Blue Player's Turn"
    );

    // Verify cards flipped back after mismatch
    await expect(cards.nth(3), 'mismatched card at index 3 should flip back face-down').toHaveAttribute('data-face-up', 'false');
    await expect(cards.nth(6), 'mismatched card at index 6 should flip back face-down').toHaveAttribute('data-face-up', 'false');

    // 4. Verify turn switching logic
    // expect: Turn switching only occurs on mismatches
    // expect: Successful matches keep the turn with the same player
    // expect: Turn alternation is consistent

    // Test successful match keeps turn with same player (Blue)
    await clickCardAndVerifyFaceUp(cards.nth(0));
    await clickCardAndVerifyFaceUp(cards.nth(9));

    // After successful match, turn should remain with blue player
    await expectCardFaceUp(cards.nth(0));
    await expectCardFaceUp(cards.nth(9));
    await expect(page.getByText("Blue Player's Turn"), 'turn should remain with blue after a successful match').toBeVisible();
    await expect(page.getByTestId('score-blue'), 'blue score should be 1 after one match').toHaveText('1');
  });
});
