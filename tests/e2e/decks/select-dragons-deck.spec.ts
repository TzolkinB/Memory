import { test, expect } from '@playwright/test';

test.describe('Deck Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Select the dragons deck from a fresh game', async ({ page }) => {
    // 1. Start from a fresh game and verify the initial robots state.
    const cards = page.getByTestId('card');
    await expect(
      page.getByRole('button', { name: 'Change Deck (Classic Robots)' })
    ).toBeVisible();
    await expect(cards).toHaveCount(12);
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute('data-face-up', 'false');
    }

    // 2. Open the Change Deck control and select Dragons.
    await page
      .getByRole('button', { name: 'Change Deck (Classic Robots)' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeVisible();
    await page
      .getByRole('button', { name: 'Wings of Fire Dragons Glory' })
      .click();
    await expect(page.getByTestId('deck-selector-modal')).toBeHidden();
    await expect(
      page.getByRole('button', { name: 'Change Deck (Wings of Fire Dragons)' })
    ).toBeVisible();
    await expect(cards).toHaveCount(14);
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute('data-face-up', 'false');
      await expect(card).toHaveAccessibleName(/Face-down card with dragons \d+/);
    }
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();

    // 3. Verify there are seven distinct dragon identities, each represented twice.
    const identities = new Map<string, number>();
    for (const card of await cards.all()) {
      const accessibleName = await card.getAttribute('aria-label');
      if (accessibleName === null) {
        throw new Error('Dragon card is missing its accessible name');
      }
      identities.set(accessibleName, (identities.get(accessibleName) ?? 0) + 1);
    }
    expect(identities.size).toBe(7);
    expect([...identities.values()].every((count) => count === 2)).toBe(true);
  });
});
