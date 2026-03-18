// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp, expectCardFaceUp } from '../core/utils';

test.describe('Edge Cases and Error States', () => {
  test('Card Interaction Edge Cases', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('card');

    // 1. Attempt to click already matched cards
    // First create a matched pair by clicking cards 0 and 9 (Robot ID 3)
    await clickCardAndVerifyFaceUp(cards.nth(0));
    await clickCardAndVerifyFaceUp(cards.nth(9));

    // Wait for match to be processed
    await page.waitForTimeout(1000);

    // Verify cards remain matched and face-up
    await expectCardFaceUp(cards.nth(0), true);
    await expectCardFaceUp(cards.nth(9), true);
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // Store initial state before attempting to click matched cards
    const initialBlueScore = await page.getByTestId('score-blue').textContent();
    const initialRedScore = await page.getByTestId('score-red').textContent();

    // expect: Clicks on matched cards are ignored
    // expect: Game state remains unchanged
    // expect: Turn does not switch
    await cards.nth(0).click();
    await cards.nth(9).click();

    // Verify no state change occurred
    await expectCardFaceUp(cards.nth(0), true);
    await expectCardFaceUp(cards.nth(9), true);
    await expect(page.getByTestId('score-blue')).toHaveText(
      initialBlueScore || '1'
    );
    await expect(page.getByTestId('score-red')).toHaveText(
      initialRedScore || '0'
    );
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // 2. Rapid clicking on cards
    // Find an available face-down card
    const availableCard = cards.nth(2);
    await expectCardFaceUp(availableCard, false);

    const initialFaceUpCount = await cards
      .filter({ has: page.locator('[data-face-up="true"]') })
      .count();

    // expect: Only the first valid click registers
    // expect: Subsequent rapid clicks are ignored
    // expect: Game state remains consistent
    await availableCard.click();

    // Rapid additional clicks should be ignored
    for (let i = 0; i < 3; i++) {
      await availableCard.click();
    }

    // Verify game state remained consistent
    const currentFaceUpCount = await cards
      .filter({ has: page.locator('[data-face-up="true"]') })
      .count();
    expect(currentFaceUpCount).toBe(initialFaceUpCount + 1);

    // 3. Click cards during checking state
    // Find two more available face-down cards to test checking state
    const card1 = cards.nth(1);
    const card3 = cards.nth(3);
    const testCard = cards.nth(4);

    await expectCardFaceUp(card1, false);
    await expectCardFaceUp(card3, false);
    await expectCardFaceUp(testCard, false);

    // Click two cards to enter checking state
    await card1.click();
    await card3.click();

    // expect: All card clicks during 500ms checking period are ignored
    // expect: Only two cards are face-up during checking
    // expect: Checking completes normally

    // Immediately try to click third card during checking period
    await testCard.click();

    // Verify only 2 cards are face-up during checking (plus the 2 matched cards from earlier)
    const faceUpCountDuringCheck = await cards
      .filter({ has: page.locator('[data-face-up="true"]') })
      .count();
    expect(faceUpCountDuringCheck).toBeLessThanOrEqual(4); // 2 matched + max 2 checking

    // Verify third card click was ignored
    await expectCardFaceUp(testCard, false);

    // Wait for checking to complete
    await page.waitForTimeout(1000);

    // Verify checking completed normally
    await expect(page.getByText(/Player's Turn/)).toBeVisible();
  });
});
