import { type Robot } from '../robots';
import { type DeckId } from '../decks';

export interface GameCard extends Robot {
  instanceId: string;
}

export type ActivePlayer = 'blue' | 'red';
export type GameStatus = 'idle' | 'checking' | 'finished';
export type GameOutcome = 'blue-win' | 'red-win' | 'tie' | null;

export interface GameState {
  shuffledCards: GameCard[];
  selectedIndices: number[];
  matchedIndices: Set<number>;
  activePlayer: ActivePlayer;
  blueMatches: number;
  redMatches: number;
  status: GameStatus;
  outcome: GameOutcome;
  selectedDeck: DeckId;
}

export type GameAction =
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'RESOLVE_SELECTION' }
  | { type: 'RESHUFFLE' }
  | { type: 'SELECT_DECK'; deckId: DeckId };

export interface JQueryModal {
  modal: (action: string) => void;
}

export type JQueryLike = (selector: string) => JQueryModal;
