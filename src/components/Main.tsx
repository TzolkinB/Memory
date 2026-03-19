import React, { useCallback, useEffect, useReducer, useState } from 'react';
import toast from 'react-hot-toast';
import { MDBBtn, MDBRow } from 'mdb-react-ui-kit';
import Modal from './shared/Modal';
import Card from './Card';
import { type Robot } from '../robots';
import { createInitialState, gameReducer } from './Main.reducer';

const App = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState
  );
  const [restartModal, setRestartModal] = useState(false);
  const toggleOpen = (): void => setRestartModal((prev) => !prev);

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

  const handleFlip = useCallback((_robot: Robot, i: number): void => {
    dispatch({ type: 'FLIP_CARD', index: i });
  }, []);

  const reShuffle = useCallback((): void => {
    dispatch({ type: 'RESHUFFLE' });
    setRestartModal(false);
  }, []);

  return (
    <main className="container-fluid">
      <div className="info d-flex justify-content-between mt-4">
        <MDBBtn
          onClick={toggleOpen}
          color="success"
          className="btn-raised"
          size="lg"
        >
          Restart
        </MDBBtn>
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
              <td data-testid="score-blue">{state.blueMatches}</td>
              <td data-testid="score-red">{state.redMatches}</td>
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
      <div className="card-deck" data-testid="card-grid">
        <MDBRow>
          <Card shuffleBots={state.shuffleBots} handleFlip={handleFlip} />
        </MDBRow>
      </div>
      <Modal
        open={restartModal}
        onClose={() => setRestartModal(false)}
        closeText="Cancel"
        confirmText="Yes"
        handleClick={reShuffle}
      >
        <p>Are you sure you want to reshuffle and restart the game?</p>
      </Modal>
    </main>
  );
};

export default App;
