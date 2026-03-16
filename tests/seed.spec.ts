import { test, expect } from '@playwright/test';

/**
 * Seed test — bootstraps the app environment for the Playwright Test Agents.
 *
 * This test is used as the entry point for the 🎭 Planner agent.
 * It navigates to the app and verifies the initial state before any interaction.
 */
test('seed', async ({ page }) => {
  await page.goto('/');

  // App root is present
  await expect(page.locator('#memory-game')).toBeVisible();

  // All 12 cards are rendered (6 pairs, each card starts face-down)
  const cards = page.getByTestId('card');
  await expect(cards).toHaveCount(12);

  // All cards start face-down
  for (const card of await cards.all()) {
    await expect(card).toHaveAttribute('data-face-up', 'false');
  }

  // Blue player goes first
  await expect(page.getByText("Blue Player's Turn")).toBeVisible();

  // Scores start at 0
  await expect(page.getByTestId('score-blue')).toHaveText('0');
  await expect(page.getByTestId('score-red')).toHaveText('0');
});
