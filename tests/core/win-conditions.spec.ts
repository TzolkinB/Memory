// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import {
  clickCardAndVerifyFaceUp,
  expectCardFaceUp,
  expectFaceUpCount,
} from '../utils';

test.describe('Core Game Mechanics', () => {
  test('Win Conditions and Game Completion', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('card');

    // Start with initial state verification
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');

    // 1. Complete all 6 matches systematically
    // expect: Each successful match increments the active player's score
    // expect: All cards eventually become face-up and matched
    // expect: Final score reflects the match distribution

    // Blue player gets match 1: Robot ID 3 (positions 0 and 9)
    await clickCardAndVerifyFaceUp(cards.nth(0));
    await clickCardAndVerifyFaceUp(cards.nth(9));
    await expect(page.getByTestId('score-blue')).toHaveText('1');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible(); // Turn remains with blue

    // Blue player gets match 2: Robot ID 1 (positions 1 and 10)
    await expectFaceUpCount(page, 2);
    await clickCardAndVerifyFaceUp(cards.nth(1));
    await clickCardAndVerifyFaceUp(cards.nth(10));
    await expect(page.getByTestId('score-blue')).toHaveText('2');

    // Blue player gets match 3: Robot ID 12 (positions 2 and 5)
    await expectFaceUpCount(page, 4);
    await clickCardAndVerifyFaceUp(cards.nth(2));
    await clickCardAndVerifyFaceUp(cards.nth(5));
    await expect(page.getByTestId('score-blue')).toHaveText('3');

    // Blue player gets match 4: Robot ID 5 (positions 3 and 4)
    await expectFaceUpCount(page, 6);
    await clickCardAndVerifyFaceUp(cards.nth(3));
    await clickCardAndVerifyFaceUp(cards.nth(4));
    await expect(page.getByTestId('score-blue')).toHaveText('4');

    // Blue player mismatch to switch turn to red
    await expectFaceUpCount(page, 8);
    await clickCardAndVerifyFaceUp(cards.nth(6));
    await clickCardAndVerifyFaceUp(cards.nth(8));
    await expect(page.getByText("Red Player's Turn")).toBeVisible();

    // Red player gets match 5: Robot ID 13 (positions 6 and 7)
    await clickCardAndVerifyFaceUp(cards.nth(6));
    await clickCardAndVerifyFaceUp(cards.nth(7));
    await expect(page.getByTestId('score-red')).toHaveText('1');

    // Red player gets final match 6: Robot ID 2 (positions 8 and 11)
    await expectFaceUpCount(page, 10);
    await clickCardAndVerifyFaceUp(cards.nth(8));
    await clickCardAndVerifyFaceUp(cards.nth(11));
    await expect(page.getByTestId('score-red')).toHaveText('2');

    // 2. Verify game end state when blue player wins
    // expect: Toast notification appears with 'Blue Player Wins!' message
    // expect: Toast has blue heart icon
    // expect: Game status becomes finished
    // expect: No further card interactions possible

    // Final score should be Blue: 4, Red: 2 - Blue wins
    await expectFaceUpCount(page, 12);
    await expect(page.getByTestId('score-blue')).toHaveText('4');
    await expect(page.getByTestId('score-red')).toHaveText('2');

    // Verify all cards are face-up
    for (let i = 0; i < 12; i++) {
      await expectCardFaceUp(cards.nth(i));
    }

    // Check for win toast notification - using getByText for toast content
    await expect(page.getByText('Blue Player Wins!')).toBeVisible();

    // Verify card interactions are disabled (clicking should have no effect)
    const initialBlueScore = await page.getByTestId('score-blue').textContent();
    await cards.nth(0).click(); // Try clicking a card
    await expect(page.getByTestId('score-blue')).toHaveText(
      initialBlueScore || '4'
    ); // Score should remain unchanged
  });
});
