import { type Robot } from '../robots';

export type ActivePlayer = 'blue' | 'red';
export type GameStatus = 'idle' | 'checking' | 'finished';
export type GameOutcome = 'blue-win' | 'red-win' | 'tie' | null;

export interface GameState {
  shuffleBots: Robot[];
  selectedIndices: number[];
  matchedIndices: Set<number>;
  activePlayer: ActivePlayer;
  blueMatches: number;
  redMatches: number;
  status: GameStatus;
  outcome: GameOutcome;
  selectedDeck: string;
  showDeckSelector: boolean;
}

export type GameAction =
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'RESOLVE_SELECTION' }
  | { type: 'RESHUFFLE' }
  | { type: 'SELECT_DECK'; deckId: string }
  | { type: 'SHOW_DECK_SELECTOR' }
  | { type: 'HIDE_DECK_SELECTOR' };

export interface JQueryModal {
  modal: (action: string) => void;
}

export type JQueryLike = (selector: string) => JQueryModal;
