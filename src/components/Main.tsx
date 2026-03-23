import React, { useCallback, useEffect, useReducer, useState } from 'react';
import toast from 'react-hot-toast';
import { MDBBtn, MDBRow } from 'mdb-react-ui-kit';
import Modal from './shared/Modal';
import DeckSelectorModal from './shared/DeckSelectorModal';
import Card from './Card';
import { type Robot } from '../robots';
import { getDeckById } from '../decks';
import { createInitialState, gameReducer } from './Main.reducer';

const App = (): React.JSX.Element => {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState
  );
  const [restartModal, setRestartModal] = useState(false);
  const [deckSelectorModal, setDeckSelectorModal] = useState(false);
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
      return (
        <p className="player-text text-info text-align">Blue Player's Turn</p>
      );
    }

    return <p className="player-text text-danger">Red Player's Turn</p>;
  };

  const handleFlip = useCallback((_card: Robot, i: number): void => {
    dispatch({ type: 'FLIP_CARD', index: i });
  }, []);

  const reShuffle = useCallback((): void => {
    dispatch({ type: 'RESHUFFLE' });
    setRestartModal(false);
  }, []);

  const showDeckSelector = useCallback((): void => {
    dispatch({ type: 'SHOW_DECK_SELECTOR' });
    setDeckSelectorModal(true);
  }, []);

  const selectDeck = useCallback((deckId: string): void => {
    dispatch({ type: 'SELECT_DECK', deckId });
    setDeckSelectorModal(false);
  }, []);

  const hideDeckSelector = useCallback((): void => {
    dispatch({ type: 'HIDE_DECK_SELECTOR' });
    setDeckSelectorModal(false);
  }, []);

  return (
    <main className="container-fluid">
      <div className="info d-lg-flex justify-content-between mt-4">
        <div>
          <MDBBtn
            onClick={toggleOpen}
            color="success"
            className="btn-raised me-2"
            size="lg"
          >
            Restart
          </MDBBtn>
          <MDBBtn
            onClick={showDeckSelector}
            color="info"
            className="btn-raised me-2"
            size="lg"
          >
            Change Deck ({getDeckById(state.selectedDeck).name})
          </MDBBtn>
        </div>
        {playerInfo()}
        <div className="mt-4 pr-2">
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
          <Card
            shuffleBots={state.shuffleBots}
            handleFlip={handleFlip}
            selectedDeck={state.selectedDeck}
          />
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
      <DeckSelectorModal
        open={deckSelectorModal}
        selectedDeck={state.selectedDeck}
        onSelectDeck={selectDeck}
        onHide={hideDeckSelector}
      />
    </main>
  );
};

export default App;
