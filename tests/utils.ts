import { expect, Locator, Page } from '@playwright/test';

/**
 * Asserts that a card's `data-face-up` attribute matches the expected state.
 * @param shouldBeFaceUp - Pass `false` to assert the card is face-down. Defaults to `true`.
 */
export const expectCardFaceUp = async (
  card: Locator,
  shouldBeFaceUp = true
) => {
  await expect(card).toHaveAttribute('data-face-up', shouldBeFaceUp.toString());
};

/**
 * Clicks a card and immediately asserts it flipped face-up.
 * Use for definitive flip actions — do not use for cards that should remain face-down.
 */
export const clickCardAndVerifyFaceUp = async (card: Locator) => {
  await card.click();
  await expectCardFaceUp(card, true);
};

/**
 * Returns a compound locator for all face-up cards on the board.
 * Combines `data-testid="card"` with the ARIA `expanded` state so both
 * the data attribute and the accessible role are verified simultaneously.
 */
export const getFaceUpCards = (page: Page) =>
  page
    .getByTestId('card')
    .and(page.getByRole('button', { expanded: true, name: /Face-up card/ }));

/**
 * Asserts the exact number of face-up cards currently on the board.
 */
export const expectFaceUpCount = async (page: Page, count: number) => {
  await expect(getFaceUpCards(page)).toHaveCount(count);
};
