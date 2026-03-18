// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Core Game Mechanics', () => {
  test('Game Initialization', async ({ page }) => {
    // Constants declared at beginning of test
    const expectedRobotIds = [3, 1, 12, 5, 5, 12, 13, 13, 2, 3, 1, 2];

    // Helper function for robot ID verification
    async function verifyRobotIdsAtPositions(
      cards: any,
      expectedIds: number[]
    ) {
      for (let i = 0; i < expectedIds.length; i++) {
        await expect(cards.nth(i).locator('img')).toHaveAttribute(
          'src',
          `https://robohash.org/${expectedIds[i]}`
        );
      }
    }
    // 1. Navigate to the game - expect: Game loads successfully, Page title shows 'Memory Game'
    await page.goto('/');
    await expect(page.getByText('Memory Game')).toBeVisible();
    await expect(page).toHaveTitle('Memory Game');

    // 2. Verify initial game state
    const cards = page.getByTestId('card');
    const cardImages = cards.locator('img');

    // expect: 12 cards are visible on the game board
    await expect(cards).toHaveCount(12);

    // expect: All cards are face-down (data-face-up='false')
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute('data-face-up', 'false');
    }

    // expect: Blue player is active (shows 'Blue Player's Turn')
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // expect: Both player scores are 0
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');

    // expect: Card grid container is present
    await expect(page.getByTestId('card-grid')).toBeVisible();

    // expect: Restart button is available
    await expect(page.getByRole('button', { name: 'Restart' })).toBeVisible();

    // 3. Verify deterministic card layout
    // expect: Cards appear in consistent positions due to seeded shuffle
    // expect: Each robot ID appears exactly twice (6 pairs total)
    // expect: Robot IDs are: 3, 1, 12, 5, 13, 2
    await expect(cardImages).toHaveCount(12);

    // Verify specific robot IDs at expected positions due to seeded shuffle
    await verifyRobotIdsAtPositions(cards, expectedRobotIds);
  });
});
