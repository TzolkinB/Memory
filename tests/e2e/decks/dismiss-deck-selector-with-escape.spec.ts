import { test, expect } from '@playwright/test';

test.describe('Deck Selection', () => {
  test('Dismiss deck selection with Escape', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('card');

    // 1. Start from a fresh game and open Change Deck.
    await expect(cards).toHaveCount(12);
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute('data-face-up', 'false');
    }
    await page
      .getByRole('button', { name: 'Change Deck (Classic Robots)' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeVisible();

    // 2. Press Escape and verify the game state is unchanged.
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('deck-selector-modal')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Change Deck (Classic Robots)' })
    ).toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute('data-face-up', 'false');
    }
  });
});
