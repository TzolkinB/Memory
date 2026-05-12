// spec: Visual Regression Smoke
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Smoke', () => {
  test('Visual Smoke Baseline', async ({ page }) => {
    const screenshotOptions = {
      animations: 'disabled' as const,
      caret: 'hide' as const,
      maxDiffPixelRatio: 0.002,
    };

    const viewports = [
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'tablet', width: 820, height: 1180 },
    ] as const;

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });

      // 1. Open the game at the root URL and verify the initial game state is visible
      await page.goto('/');
      await expect(page.getByText("Blue Player's Turn")).toBeVisible();
      await expect(page.getByRole('button', { name: 'Restart' })).toBeVisible();

      // 2. Capture a visual baseline of the loaded page
      await expect(page).toHaveScreenshot(`${viewport.name}-loaded-state.png`, {
        ...screenshotOptions,
        fullPage: true,
      });

      const firstCard = page.getByTestId('card').first();

      // 3. Flip one card and verify the card is face-up
      await firstCard.click();
      await expect(firstCard).toHaveAttribute('data-face-up', 'true');

      // Wait for images to load
      await page.waitForLoadState('networkidle');

      // 4. Capture a visual snapshot of the grid after one card flip
      await expect(page.getByTestId('card-grid')).toHaveScreenshot(
        `${viewport.name}-grid-after-one-flip.png`,
        screenshotOptions
      );

      const restartButton = page.getByRole('button', { name: 'Restart' });

      // 5. Open the restart confirmation modal via the Restart button
      await restartButton.click();

      // 6. Verify restart modal content is visible
      const restartModal = page.getByTestId('restart-modal');
      await expect(restartModal).toBeVisible();

      // 7. Capture a visual snapshot of the restart modal
      await expect(restartModal).toHaveScreenshot(
        `${viewport.name}-restart-modal.png`,
        screenshotOptions
      );

      // 8. Close the restart modal with Cancel
      await page.getByRole('button', { name: 'Cancel' }).click();

      const changeDeckButton = page.getByRole('button', {
        name: /Change Deck/,
      });

      // 9. Open the deck selector modal via the Change Deck button
      await changeDeckButton.click();

      // 10. Verify deck selector modal content is visible
      const deckSelectorModal = page.getByTestId('deck-selector-modal');

      await expect(deckSelectorModal).toBeVisible();

      // 11. Capture a visual snapshot of the deck selector modal
      await expect(deckSelectorModal).toHaveScreenshot(
        `${viewport.name}-deck-selector-modal.png`,
        screenshotOptions
      );

      // 12. Close the deck selector modal with Cancel
      await page.getByRole('button', { name: 'Cancel' }).click();
    }
  });
});
