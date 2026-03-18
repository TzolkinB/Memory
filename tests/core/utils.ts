import { expect, Locator, Page } from '@playwright/test';

export const expectCardFaceUp = async (
  card: Locator,
  shouldBeFaceUp = true
) => {
  await expect(card).toHaveAttribute('data-face-up', shouldBeFaceUp.toString());
};

export const clickCardAndVerifyFaceUp = async (card: Locator) => {
  await card.click();
  await expectCardFaceUp(card, true);
};

export const getFaceUpCards = (page: Page) =>
  page.getByTestId('card').and(page.getByRole('button', { expanded: true, name: /Face-up card/ }));

export const expectFaceUpCount = async (page: Page, count: number) => {
  await expect(getFaceUpCards(page)).toHaveCount(count);
};
