// spec: specs/memory-game.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { clickCardAndVerifyFaceUp, expectFaceUpCount } from '../utils';

test.describe('Core Game Mechanics', () => {
  test('Card Flipping Behavior', async ({ page }) => {
    await page.goto('/');

    const cards = page.getByTestId('card');

    // 1. Click on the first card
    await clickCardAndVerifyFaceUp(cards.first());
    await expectFaceUpCount(page, 1);

    // 2. Click on the same card again
    // expect: Click is ignored
    // expect: Card remains face-up
    // expect: No state change occurs
    await clickCardAndVerifyFaceUp(cards.first());
    await expectFaceUpCount(page, 1);

    // 3. Click on a second different card
    // expect: Game enters checking state for 500ms
    await clickCardAndVerifyFaceUp(cards.nth(1));
    await expectFaceUpCount(page, 2);

    // Wait for checking period to complete and verify mismatch processing
    // Upon mismatch, turn changes from Blue player to Red Player
    await expect(page.getByText("Red Player's Turn")).toBeVisible();
    await expectFaceUpCount(page, 0);

    // 4. Attempt to click a third card while checking
    await clickCardAndVerifyFaceUp(cards.nth(2));
    await clickCardAndVerifyFaceUp(cards.nth(3));

    // Third click should be ignored during checking
    await cards.nth(4).click();
    await expectFaceUpCount(page, 2);
  });
});
