import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp, expectFaceUpCount } from '../../utils';

test.describe('Game Completion Outcomes', () => {
  test('Red player wins after the final pair', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('card');

    // 1. Have Blue match the pairs at positions 0 and 9, then 1 and 10.
    await clickCardAndVerifyFaceUp(cards.nth(0));
    await clickCardAndVerifyFaceUp(cards.nth(9));
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await clickCardAndVerifyFaceUp(cards.nth(1));
    await clickCardAndVerifyFaceUp(cards.nth(10));
    await expect(page.getByTestId('score-blue')).toHaveText('2');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // 2. Click cards 2 and 3 to miss and pass the turn.
    await clickCardAndVerifyFaceUp(cards.nth(2));
    await clickCardAndVerifyFaceUp(cards.nth(3));
    await expect(page.getByText("Red Player's Turn")).toBeVisible();
    await expect(cards.nth(2)).toHaveAttribute('data-face-up', 'false');
    await expect(cards.nth(3)).toHaveAttribute('data-face-up', 'false');

    // 3. Have Red match the remaining pairs and verify the red-win outcome.
    const redPairs = [
      [2, 5],
      [3, 4],
      [6, 7],
      [8, 11],
    ];
    for (const [pairIndex, pair] of redPairs.entries()) {
      const [first, second] = pair;
      await clickCardAndVerifyFaceUp(cards.nth(first));
      await clickCardAndVerifyFaceUp(cards.nth(second));
      await expect(page.getByTestId('score-red')).toHaveText(
        String(pairIndex + 1)
      );
    }

    await expect(page.getByTestId('score-blue')).toHaveText('2');
    await expect(page.getByTestId('score-red')).toHaveText('4');
    await expectFaceUpCount(page, 12);
    await expect(page.getByText('Red Player Wins!')).toBeVisible();

    await cards.nth(0).click();
    await expect(page.getByTestId('score-blue')).toHaveText('2');
    await expect(page.getByTestId('score-red')).toHaveText('4');
  });
});
