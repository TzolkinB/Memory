import React, { useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import Modal from './shared/Modal';
import Card from './Card';
import { robots, type Robot } from '../robots';

type ActivePlayer = 'blue' | 'red';
type GameStatus = 'idle' | 'checking' | 'finished';
type GameOutcome = 'blue-win' | 'red-win' | 'tie' | null;

interface GameState {
  shuffleBots: Robot[];
  selectedIndices: number[];
  matchedIndices: Set<number>;
  activePlayer: ActivePlayer;
  blueMatches: number;
  redMatches: number;
  status: GameStatus;
  outcome: GameOutcome;
}

type GameAction =
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'RESOLVE_SELECTION' }
  | { type: 'RESHUFFLE' };

interface JQueryModal {
  modal: (action: string) => void;
}

type JQueryLike = (selector: string) => JQueryModal;

const TOTAL_PAIRS = robots.length / 2;

const shuffle = (robots: Robot[]): Robot[] => {
  // use Fisher-Yates for truly random but for simple game it's fine
  robots.sort(() => {
    return 0.5 - Math.random();
  });
  return robots;
};

const buildDeck = (): Robot[] =>
  shuffle([...robots]).map((bot) => ({ ...bot, isFaceUp: false }));

const initialState = (): GameState => ({
  shuffleBots: buildDeck(),
  selectedIndices: [],
  matchedIndices: new Set(),
  activePlayer: 'blue',
  blueMatches: 0,
  redMatches: 0,
  status: 'idle',
  outcome: null,
});

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'FLIP_CARD': {
      const { index } = action;

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
    }

    case 'RESOLVE_SELECTION': {
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

      if (cardA.id === cardB.id) {
        const nextMatchedIndices = new Set(state.matchedIndices);
        nextMatchedIndices.add(indexA);
        nextMatchedIndices.add(indexB);

        const blueMatches =
          state.activePlayer === 'blue' ? state.blueMatches + 1 : state.blueMatches;
        const redMatches =
          state.activePlayer === 'red' ? state.redMatches + 1 : state.redMatches;

        const allPairsMatched = nextMatchedIndices.size / 2 === TOTAL_PAIRS;
        const outcome: GameOutcome = allPairsMatched
          ? blueMatches > redMatches
            ? 'blue-win'
            : redMatches > blueMatches
              ? 'red-win'
              : 'tie'
          : null;

        return {
          ...state,
          matchedIndices: nextMatchedIndices,
          selectedIndices: [],
          blueMatches,
          redMatches,
          status: allPairsMatched ? 'finished' : 'idle',
          outcome,
        };
      }

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
    }

    case 'RESHUFFLE':
      return initialState();

    default:
      return state;
  }
};

const getJQuery = (): JQueryLike | undefined => {
  const windowWithJQuery = window as Window & { $?: JQueryLike };
  return windowWithJQuery.$;
};

const App = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(gameReducer, undefined, initialState);

  useEffect(() => {
    if (state.status !== 'checking') {
      return;
    }

    const timeout = setTimeout(() => {
      dispatch({ type: 'RESOLVE_SELECTION' });
    }, 500);

    return () => clearTimeout(timeout);
  }, [state.status]);

  useEffect(() => {
    if (!state.outcome) {
      return;
    }

    if (state.outcome === 'blue-win') {
      toast.success('Blue Player Wins!', { icon: '💙' });
      return;
    }

    if (state.outcome === 'red-win') {
      toast.error('Red Player Wins!', { icon: '❤️' });
      return;
    }

    toast('It is a tie!', { icon: '🤝' });
  }, [state.outcome]);

  const playerInfo = (): React.JSX.Element => {
    if (state.activePlayer === 'blue') {
      return <p className="player-text text-info">Blue Player's Turn</p>;
    }

    return <p className="player-text text-danger">Red Player's Turn</p>;
  };

  const handleFlip = useCallback(
    (_robot: Robot, i: number): void => {
      dispatch({ type: 'FLIP_CARD', index: i });
    },
    []
  );

  const reShuffle = useCallback((): void => {
    dispatch({ type: 'RESHUFFLE' });
    getJQuery()?.('#modal').modal('hide');
  }, []);

  return (
    <main className="container-fluid">
      <div className="info d-flex justify-content-between mt-4">
        <button
          type="button"
          data-toggle="modal"
          data-target="#modal"
          className="btn btn-raised btn-success"
        >
          Restart
        </button>
        {playerInfo()}
        <table>
          <thead>
            <tr>
              <th className="text-info pr-3">Blue Player</th>
              <th className="text-danger">Red Player</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{state.blueMatches}</td>
              <td>{state.redMatches}</td>
            </tr>
          </tbody>
        </table>
        <div className="mobile-stats mt-4 pr-2">
          <p className="text-info d-inline font-weight-bold pr-3">
            Blue Player: {state.blueMatches}
          </p>
          <p className="text-danger d-inline font-weight-bold">
            Red Player: {state.redMatches}
          </p>
        </div>
      </div>
      <div className="card-deck">
        <Card shuffleBots={state.shuffleBots} handleFlip={handleFlip} />
      </div>
      <Modal
        closeText="Cancel"
        confirmText="Yes"
        handleClick={() => reShuffle()}
      >
        <p>Are you sure you want to reshuffle and restart the game?</p>
      </Modal>
    </main>
  );
};

export default App;
