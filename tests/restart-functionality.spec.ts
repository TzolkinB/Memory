// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { expectFaceUpCount, clickCardAndVerifyFaceUp } from './utils';

test.describe('Game Controls and Restart', () => {
  test('Restart Functionality', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // 1. Start a game and make some progress
    const cards = page.getByTestId('card');

    // Have Blue Player make a match (cards 1 and 10 are both robot 1)
    await clickCardAndVerifyFaceUp(cards.nth(1));
    await clickCardAndVerifyFaceUp(cards.nth(10));

    // Verify Blue player has scored and is still active (successful match keeps turn)
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // 2. Click the Restart button
    const restartButton = page.getByRole('button', { name: 'Restart' });
    await restartButton.click();

    // Verify restart confirmation modal appears
    await expect(
      page.getByText('Are you sure you want to reshuffle and restart the game?')
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

    // 3. Click Cancel button in modal
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify modal closes without changes
    await expect(
      page.getByText('Are you sure you want to reshuffle and restart the game?')
    ).not.toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expectFaceUpCount(page, 2); // Cards 1 and 10 remain face up

    // 4. Click Restart button again
    await restartButton.click();

    // Verify modal opens again
    await expect(
      page.getByText('Are you sure you want to reshuffle and restart the game?')
    ).toBeVisible();

    // 5. Click close '×' button in modal
    await page.getByRole('button', { name: 'Close' }).click();

    // Verify close '×' button works same as Cancel
    await expect(
      page.getByText('Are you sure you want to reshuffle and restart the game?')
    ).not.toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expectFaceUpCount(page, 2);

    // 6. Click Restart button again and click Yes
    await restartButton.click();
    await page.getByRole('button', { name: 'Yes' }).click();

    // Verify complete reset
    await expect(
      page.getByText('Are you sure you want to reshuffle and restart the game?')
    ).not.toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expectFaceUpCount(page, 0);

    // 7. Verify restart from completed game
    // Complete the game by making all matches with proper synchronization
    const matchPairs = [
      [0, 9], // robot 3
      [1, 10], // robot 1
      [2, 5], // robot 12
      [3, 4], // robot 5
      [6, 7], // robot 13
      [8, 11], // robot 2
    ];

    let expectedBlueScore = 0;
    for (const [first, second] of matchPairs) {
      await cards.nth(first).click();
      await cards.nth(second).click();
      expectedBlueScore += 1;
      // Wait for the match resolution before proceeding to the next pair
      await expect(page.getByTestId('score-blue')).toHaveText(
        String(expectedBlueScore)
      );
    }

    // Verify game is completed (Blue Player wins with 6 matches)
    await expect(page.getByTestId('score-blue')).toHaveText('6');

    // Test restart from completed game
    await restartButton.click();
    await page.getByRole('button', { name: 'Yes' }).click();

    // Verify restart from completed game works
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expectFaceUpCount(page, 0);
  });
});
