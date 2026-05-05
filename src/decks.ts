import { robots } from './robots';
import { dragons, type Dragon } from './dragons';

export type DeckId = 'robots' | 'dragons';

export interface Deck {
  id: DeckId;
  name: string;
  type: 'robots' | 'dragons';
  cards: { id: number; isFaceUp: boolean }[];
  metadata?: {
    imageUrlTemplate?: string;
    characters?: Dragon[];
  };
}

// Dragon character data from Wings of Fire wiki
// Create card pairs for each dragon (6 pairs = 12 cards)
const dragonCards = dragons.flatMap((dragon) => [
  { id: dragon.id, isFaceUp: false },
  { id: dragon.id, isFaceUp: false },
]);

// Available decks
export const decks: Record<DeckId, Deck> = {
  robots: {
    id: 'robots',
    name: 'Classic Robots',
    type: 'robots',
    cards: robots,
    metadata: {
      imageUrlTemplate: 'https://robohash.org/${id}',
    },
  },
  dragons: {
    id: 'dragons',
    name: 'Wings of Fire Dragons',
    type: 'dragons',
    cards: dragonCards,
    metadata: {
      characters: dragons,
    },
  },
};

// Helper function to get dragon by ID
export const getDragonById = (id: number): Dragon | undefined => {
  return dragons.find((dragon) => dragon.id === id);
};

// Helper function to get deck by ID
export const getDeckById = (deckId: DeckId | string): Deck => {
  if (deckId in decks) {
    return decks[deckId as DeckId];
  }

  return decks.robots;
};
