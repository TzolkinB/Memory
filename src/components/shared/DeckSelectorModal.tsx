import React from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from 'mdb-react-ui-kit';
import { decks, type DeckId } from '../../decks';

interface DeckSelectorModalProps {
  open: boolean;
  selectedDeck: DeckId;
  onSelectDeck: (deckId: DeckId) => void;
  onHide: () => void;
}

const DeckSelectorModal: React.FC<DeckSelectorModalProps> = ({
  open,
  selectedDeck,
  onSelectDeck,
  onHide,
}) => {
  return (
    <MDBModal
      open={open}
      onClose={onHide}
      tabIndex={-1}
      data-testid="deck-selector-modal"
    >
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <h5 className="modal-title">Choose Your Deck</h5>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={onHide}
              aria-label="Close"
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div className="d-flex flex-wrap justify-content-around">
              {Object.values(decks).map((deck) => (
                <div
                  key={deck.id}
                  className={`deck-option ${selectedDeck === deck.id ? 'selected' : ''}`}
                  onClick={() => onSelectDeck(deck.id)}
                  style={{
                    cursor: 'pointer',
                    margin: '10px',
                    padding: '20px',
                    border: '2px solid #ccc',
                    borderRadius: '8px',
                  }}
                >
                  <h6>{deck.name}</h6>
                  <div className="deck-preview">
                    {deck.type === 'robots' ? (
                      <img
                        src="https://robohash.org/1"
                        alt="Robot preview"
                        width="60"
                        height="60"
                      />
                    ) : (
                      <img
                        src={deck.metadata?.characters?.[0]?.imageUrl || ''}
                        alt={`${deck.metadata?.characters?.[0]?.name || 'Dragon'} preview`}
                        width="60"
                        height="60"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onHide}>
              Cancel
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default DeckSelectorModal;
