import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp, expectFaceUpCount } from '../../utils';

test.describe('Game Completion Outcomes', () => {
  test('The game reports a tie', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('card');

    // 1. Have Blue match three pairs and reach a score of 3.
    const bluePairs = [
      [0, 9],
      [1, 10],
      [2, 5],
    ];
    for (const [pairIndex, [first, second]] of bluePairs.entries()) {
      await clickCardAndVerifyFaceUp(cards.nth(first));
      await clickCardAndVerifyFaceUp(cards.nth(second));
      await expect(page.getByTestId('score-blue')).toHaveText(
        String(pairIndex + 1)
      );
    }
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // 2. Have Blue miss with cards 3 and 6 to pass the turn to Red.
    await clickCardAndVerifyFaceUp(cards.nth(3));
    await clickCardAndVerifyFaceUp(cards.nth(6));
    await expect(page.getByText("Red Player's Turn")).toBeVisible();
    await expect(cards.nth(3)).toHaveAttribute('data-face-up', 'false');
    await expect(cards.nth(6)).toHaveAttribute('data-face-up', 'false');

    // 3. Have Red match the remaining pairs and verify the tie outcome.
    const redPairs = [
      [3, 4],
      [6, 7],
      [8, 11],
    ];
    for (const [pairIndex, [first, second]] of redPairs.entries()) {
      await clickCardAndVerifyFaceUp(cards.nth(first));
      await clickCardAndVerifyFaceUp(cards.nth(second));
      await expect(page.getByTestId('score-red')).toHaveText(
        String(pairIndex + 1)
      );
    }

    await expect(page.getByTestId('score-blue')).toHaveText('3');
    await expect(page.getByTestId('score-red')).toHaveText('3');
    await expectFaceUpCount(page, 12);
    await expect(page.getByText('It is a tie!')).toBeVisible();

    await cards.nth(0).click();
    await expect(page.getByTestId('score-blue')).toHaveText('3');
    await expect(page.getByTestId('score-red')).toHaveText('3');
  });
});
