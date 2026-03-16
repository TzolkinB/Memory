import { robots } from '../robots';
import type { GameAction, GameOutcome, GameState } from './Main.types';

const TOTAL_PAIRS = robots.length / 2;

const shuffle = <T>(items: T[]): T[] => {
  items.sort(() => {
    return 0.5 - Math.random();
  });

  return items;
};

const buildDeck = () =>
  shuffle([...robots]).map((bot) => ({ ...bot, isFaceUp: false }));

export const createInitialState = (): GameState => ({
  shuffleBots: buildDeck(),
  selectedIndices: [],
  matchedIndices: new Set(),
  activePlayer: 'blue',
  blueMatches: 0,
  redMatches: 0,
  status: 'idle',
  outcome: null,
});

const handleFlipCard = (state: GameState, index: number): GameState => {
  if (state.status === 'checking' || state.status === 'finished') {
    return state;
  }

  const clickedCard = state.shuffleBots[index];
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
  const nextBots = state.shuffleBots.map((bot, i) =>
    i === index ? { ...bot, isFaceUp: true } : bot
  );

  return {
    ...state,
    shuffleBots: nextBots,
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
  const allPairsMatched = nextMatchedIndices.size / 2 === TOTAL_PAIRS;

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
  const nextBots = state.shuffleBots.map((bot, i) =>
    i === indexA || i === indexB ? { ...bot, isFaceUp: false } : bot
  );

  return {
    ...state,
    shuffleBots: nextBots,
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
  const cardA = state.shuffleBots[indexA];
  const cardB = state.shuffleBots[indexB];

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
      return createInitialState();

    default:
      return state;
  }
};
