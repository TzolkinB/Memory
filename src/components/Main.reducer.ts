import { getDeckById, type DeckId } from '../decks';
import type {
  GameAction,
  GameCard,
  GameOutcome,
  GameState,
} from './Main.types';

/**
 * Linear congruential generator — produces a deterministic sequence for a
 * given seed. Used to make shuffles reproducible in E2E tests.
 */
export const createSeededRandom = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
};

/** Fisher–Yates shuffle. Accepts an optional RNG so tests can pass a seeded one. */
export const shuffle = <T>(
  items: T[],
  random: () => number = Math.random
): T[] => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const buildDeck = (deckId: DeckId = 'robots'): GameCard[] => {
  const deck = getDeckById(deckId);
  const seedStr =
    import.meta.env.VITE_SHUFFLE_SEED ??
    (import.meta.env.DEV ? '42' : undefined);
  const seed = Number(seedStr);
  const random = Number.isFinite(seed) ? createSeededRandom(seed) : Math.random;
  return shuffle([...deck.cards], random).map((card, index) => ({
    ...card,
    instanceId: `${deckId}-${card.id}-${index}`,
    isFaceUp: false,
  }));
};

export const createInitialState = (deckId: DeckId = 'robots'): GameState => ({
  shuffledCards: buildDeck(deckId),
  selectedIndices: [],
  matchedIndices: new Set(),
  activePlayer: 'blue',
  blueMatches: 0,
  redMatches: 0,
  status: 'idle',
  outcome: null,
  selectedDeck: deckId,
});

const handleFlipCard = (state: GameState, index: number): GameState => {
  if (state.status === 'checking' || state.status === 'finished') {
    return state;
  }

  const clickedCard = state.shuffledCards[index];
  if (!clickedCard || clickedCard.isFaceUp || state.matchedIndices.has(index)) {
    return state;
  }

  if (
    state.selectedIndices.includes(index) ||
    state.selectedIndices.length >= 2
  ) {
    return state;
  }

  const nextSelectedIndices = [...state.selectedIndices, index];
  const nextCards = state.shuffledCards.map((card, i) =>
    i === index ? { ...card, isFaceUp: true } : card
  );

  return {
    ...state,
    shuffledCards: nextCards,
    selectedIndices: nextSelectedIndices,
    status: nextSelectedIndices.length === 2 ? 'checking' : 'idle',
  };
};

const getOutcome = (blueMatches: number, redMatches: number): GameOutcome => {
  if (blueMatches > redMatches) {
    return 'blue-win';
  }

  if (redMatches > blueMatches) {
    return 'red-win';
  }

  return 'tie';
};

const handleMatch = (
  state: GameState,
  indexA: number,
  indexB: number
): GameState => {
  const nextMatchedIndices = new Set(state.matchedIndices);
  nextMatchedIndices.add(indexA);
  nextMatchedIndices.add(indexB);

  const blueMatches =
    state.activePlayer === 'blue' ? state.blueMatches + 1 : state.blueMatches;
  const redMatches =
    state.activePlayer === 'red' ? state.redMatches + 1 : state.redMatches;
  const totalPairs = state.shuffledCards.length / 2;
  const allPairsMatched = nextMatchedIndices.size / 2 === totalPairs;

  return {
    ...state,
    matchedIndices: nextMatchedIndices,
    selectedIndices: [],
    blueMatches,
    redMatches,
    status: allPairsMatched ? 'finished' : 'idle',
    outcome: allPairsMatched ? getOutcome(blueMatches, redMatches) : null,
  };
};

const handleMismatch = (
  state: GameState,
  indexA: number,
  indexB: number
): GameState => {
  const nextCards = state.shuffledCards.map((card, i) =>
    i === indexA || i === indexB ? { ...card, isFaceUp: false } : card
  );

  return {
    ...state,
    shuffledCards: nextCards,
    selectedIndices: [],
    activePlayer: state.activePlayer === 'blue' ? 'red' : 'blue',
    status: 'idle',
  };
};

const resolveSelection = (state: GameState): GameState => {
  if (state.selectedIndices.length !== 2 || state.status !== 'checking') {
    return state;
  }

  const [indexA, indexB] = state.selectedIndices;
  const cardA = state.shuffledCards[indexA];
  const cardB = state.shuffledCards[indexB];

  if (!cardA || !cardB) {
    return {
      ...state,
      selectedIndices: [],
      status: 'idle',
    };
  }

  return cardA.id === cardB.id
    ? handleMatch(state, indexA, indexB)
    : handleMismatch(state, indexA, indexB);
};

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case 'FLIP_CARD':
      return handleFlipCard(state, action.index);

    case 'RESOLVE_SELECTION':
      return resolveSelection(state);

    case 'RESHUFFLE':
      return createInitialState(state.selectedDeck);

    case 'SELECT_DECK':
      return createInitialState(action.deckId);

    default:
      return state;
  }
};
