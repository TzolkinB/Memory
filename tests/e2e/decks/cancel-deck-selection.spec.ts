import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp } from '../../utils';

test.describe('Deck Selection', () => {
  test('Cancel deck selection without changing the current game', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('card');

    // 1. Make a matching pair and open Change Deck.
    await clickCardAndVerifyFaceUp(cards.nth(1));
    await clickCardAndVerifyFaceUp(cards.nth(10));
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await page
      .getByRole('button', { name: 'Change Deck (Classic Robots)' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeVisible();

    // 2. Cancel, reopen the selector, and close it with the Close control.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('deck-selector-modal')).toBeHidden();
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(cards.nth(1)).toHaveAttribute('data-face-up', 'true');
    await expect(cards.nth(10)).toHaveAttribute('data-face-up', 'true');
    await page
      .getByRole('button', { name: 'Change Deck (Classic Robots)' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();

    // Verify both dismissals preserve the selected deck and game progress.
    await expect(page.getByTestId('deck-selector-modal')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Change Deck (Classic Robots)' })
    ).toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(cards.nth(1)).toHaveAttribute('data-face-up', 'true');
    await expect(cards.nth(10)).toHaveAttribute('data-face-up', 'true');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
  });
});
