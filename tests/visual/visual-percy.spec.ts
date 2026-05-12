import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import { clickCardAndVerifyFaceUp } from '../utils';

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
];

for (const vp of viewports) {
  test.describe(`Visual Regression — ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('loaded state', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('card').first().waitFor();
      await percySnapshot(page, `${vp.name} — loaded state`);
    });

    test('grid after one flip', async ({ page }) => {
      await page.goto('/');
      const cards = page.getByTestId('card');
      await clickCardAndVerifyFaceUp(cards.first());
      await percySnapshot(page, `${vp.name} — grid after one flip`);
    });

    test('deck selector modal', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /Change Deck/ }).click();
      await expect(page.getByTestId('deck-selector-modal')).toHaveClass(/show/);
      await percySnapshot(page, `${vp.name} — deck selector modal`);
    });

    test('restart modal', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: 'Restart' }).click();
      await expect(page.getByTestId('restart-modal')).toHaveClass(/show/);
      await percySnapshot(page, `${vp.name} — restart modal`);
    });
  });
}
