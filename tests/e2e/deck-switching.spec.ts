// spec: specs/missing-tests.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Deck Switching', () => {
  test('Switch to Dragons deck', async ({ page }) => {
    await page.goto('/');

    const changeDeckBtn = page.getByRole('button', {
      name: 'Change Deck (Classic Robots)',
    });
    const deckSelectorModal = page.getByTestId('deck-selector-modal');

    // 2. Click the "Change Deck" button in the app bar
    await changeDeckBtn.click();

    // 3. Verify the deck selector modal is visible
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).toBeVisible();

    // 4. Click the "Cancel" button and verify the modal is closed
    await deckSelectorModal.getByRole('button', { name: 'Cancel' }).click();
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).not.toBeVisible();

    // 5. Click the "Change Deck" button again
    await changeDeckBtn.click();
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).toBeVisible();

    // 6. Click the "Close" (X) button and verify the modal is closed
    await deckSelectorModal.getByRole('button', { name: 'Close' }).click();
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).not.toBeVisible();

    // 7. Click the "Change Deck" button again
    await changeDeckBtn.click();
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).toBeVisible();

    // 8. Click the "Wings of Fire Dragons" deck option
    await deckSelectorModal.getByRole('button', { name: 'Wings of Fire Dragons Glory' }).click();

    // 9. Verify the modal is dismissed
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).not.toBeVisible();

    // Verify deck button label updated
    await expect(page.getByRole('button', { name: /Change Deck \(Wings of Fire Dragons\)/ })).toBeVisible();

    // Verify all cards are face-down and render dragon images
    const dragonCards = page.getByRole('button', { name: /Face-down card with dragons/ });
    await expect(dragonCards).toHaveCount(14);

    // Verify Blue player's turn is shown and scores are reset to 0
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');
  });

  test('Reset is deterministic after deck switch', async ({ page }) => {
    await page.goto('/');

    const deckSelectorModal = page.getByTestId('deck-selector-modal');
    const restartModal = page.getByTestId('restart-modal');

    // 2. Switch to the Dragons deck via deck selector modal
    await page.getByRole('button', { name: 'Change Deck (Classic Robots)' }).click();
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).toBeVisible();
    await deckSelectorModal.getByRole('button', { name: 'Wings of Fire Dragons Glory' }).click();
    await expect(deckSelectorModal.getByRole('heading', { name: 'Choose Your Deck', level: 5 })).not.toBeVisible();

    // Seeded dragon card order (VITE_SHUFFLE_SEED=42): 6,6,7,4,3,3,5,5,1,7,2,4,1,2
    const cards = page.getByTestId('card');
    await expect(cards).toHaveCount(14);

    // 3. Flip 2 cards that are a known mismatch (position 2: dragons 7, position 3: dragons 4)
    await cards.nth(2).click();
    await cards.nth(3).click();

    // Wait for mismatch resolution — turn passes to Red
    await expect(page.getByText("Red Player's Turn")).toBeVisible();

    // 4. Click "Restart" and confirm
    await page.getByRole('button', { name: 'Restart' }).click();
    await expect(restartModal.getByText('Are you sure you want to reshuffle and restart the game?')).toBeVisible();
    await restartModal.getByRole('button', { name: 'Yes' }).click();

    // Verify all cards return to face-down state
    await expect(cards).toHaveCount(14);
    await expect(page.getByRole('button', { name: /Face-down card with dragons/ })).toHaveCount(14);

    // Verify Blue player's turn and 0–0 score
    await expect(page.getByText("Blue Player's Turn")).toBeVisible();
    await expect(page.getByTestId('score-blue')).toHaveText('0');
    await expect(page.getByTestId('score-red')).toHaveText('0');

    // Verify card order matches seeded shuffle: 6,6,7,4,3,3,5,5,1,7,2,4,1,2
    const expectedOrder = [6, 6, 7, 4, 3, 3, 5, 5, 1, 7, 2, 4, 1, 2];
    for (const [i, id] of expectedOrder.entries()) {
      await expect(cards.nth(i)).toHaveAccessibleName(new RegExp(`Face-down card with dragons ${id}`));
    }
  });
});
