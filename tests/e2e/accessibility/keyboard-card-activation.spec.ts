import { test, expect } from '@playwright/test';
import { expectFaceUpCount } from '../../utils';

test.describe('Accessibility and Responsive Layout', () => {
  test('Flip cards with keyboard controls', async ({ page }) => {
    await page.goto('/');
    const cards = page.getByTestId('card');

    // 1. Use Tab navigation to focus the first face-down card.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(cards.first()).toBeFocused();
    await expect(
      page.getByRole('button', { name: 'Face-down card with robots 3' })
    ).toBeVisible();

    // 2. Activate the first card with Enter and the next with Space.
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await expect(cards.nth(1)).toBeFocused();
    await page.keyboard.press('Space');
    await expectFaceUpCount(page, 2);
    await expect(page.getByText("Red Player's Turn")).toBeVisible();
    await expect(cards.nth(0)).toHaveAttribute('data-face-up', 'false');
    await expect(cards.nth(1)).toHaveAttribute('data-face-up', 'false');
  });
});
