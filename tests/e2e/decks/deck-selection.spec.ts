import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp } from '../../utils';

test.describe('Deck Selection', () => {
  test('Switch decks after making progress', async ({ page }) => {
    // 1. Start fresh and make the known robot pair at positions 1 and 10.
    await page.goto('/');
    const cards = page.getByTestId('card');
    await clickCardAndVerifyFaceUp(cards.nth(1));
    await clickCardAndVerifyFaceUp(cards.nth(10));
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(cards.nth(1)).toHaveAttribute('data-face-up', 'true');
    await expect(cards.nth(10)).toHaveAttribute('data-face-up', 'true');

    // 2. Select Dragons and verify switching resets the game.
    await page
      .getByRole('button', { name: 'Change Deck (Classic Robots)' })
      .click();
    await page
      .getByRole('button', { name: 'Wings of Fire Dragons Glory' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Change Deck (Wings of Fire Dragons)' })
    ).toBeVisible();
    await expect(cards).toHaveCount(14);
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute('data-face-up', 'false');
    }
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
  });
});
