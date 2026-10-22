import { test, expect, type Locator } from '@playwright/test';

test.describe('Accessibility and Responsive Layout', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('Game controls and cards fit a phone viewport', async ({ page }) => {
    await page.goto('/');

    // 1. Verify the fresh game fits the phone viewport.
    const viewport = page.viewportSize();
    if (viewport === null) {
      throw new Error('Viewport size is unavailable');
    }

    const cards = page.getByTestId('card');
    await expect(cards).toHaveCount(12);
    await expect(page.getByRole('button', { name: 'Restart' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Change Deck (Classic Robots)' })
    ).toBeVisible();
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');

    const layoutElements: Locator[] = [
      page.getByRole('button', { name: 'Restart' }),
      page.getByRole('button', { name: 'Change Deck (Classic Robots)' }),
      page.getByText("Blue Player's Turn"),
      page.getByTestId('score-blue'),
      page.getByTestId('score-red'),
      ...(await cards.all()),
    ];
    const boxes: Array<{ x: number; y: number; width: number; height: number }> = [];
    for (const element of layoutElements) {
      const box = await element.boundingBox();
      if (box === null) {
        throw new Error('A game control or card has no visible bounds');
      }
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      boxes.push(box);
    }

    for (let firstIndex = 0; firstIndex < boxes.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < boxes.length;
        secondIndex += 1
      ) {
        const first = boxes[firstIndex];
        const second = boxes[secondIndex];
        const overlaps =
          first.x < second.x + second.width &&
          first.x + first.width > second.x &&
          first.y < second.y + second.height &&
          first.y + first.height > second.y;
        expect(overlaps).toBe(false);
      }
    }

    // 2. Check both dialogs and confirm restart can be canceled.
    await page
      .getByRole('button', { name: 'Change Deck (Classic Robots)' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Classic Robots/ })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Wings of Fire Dragons/ })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.getByRole('button', { name: 'Restart' }).click();
    await expect(page.getByTestId('restart-modal')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('restart-modal')).toBeHidden();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
  });
});
