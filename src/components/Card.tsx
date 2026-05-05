import React from 'react';
import { MDBCard, MDBCardBody, MDBCol } from 'mdb-react-ui-kit';
import { type Robot } from '../robots';
import { getDragonById, type DeckId } from '../decks';

interface CardProps {
  shuffleBots: Robot[];
  handleFlip: (card: Robot, index: number) => void;
  selectedDeck: DeckId;
}

const Card: React.FC<CardProps> = ({
  shuffleBots,
  handleFlip,
  selectedDeck,
}) => {
  const getImageSrc = (card: Robot): string => {
    if (selectedDeck === 'dragons') {
      const dragon = getDragonById(card.id);
      return dragon?.imageUrl || `https://robohash.org/${card.id}`;
    }
    return `https://robohash.org/${card.id}`;
  };

  const getImageAlt = (card: Robot): string => {
    if (selectedDeck === 'dragons') {
      const dragon = getDragonById(card.id);
      return dragon?.name || `Dragon ${card.id}`;
    }
    return `Robot ${card.id}`;
  };

  return (
    <React.Fragment>
      {shuffleBots.map((card, i) => {
        return (
          <MDBCol sm="4" lg="3" size={4} key={i} className="px-0">
            <MDBCard
              data-testid="card"
              data-face-up={card.isFaceUp}
              role="button"
              aria-expanded={card.isFaceUp}
              aria-label={`${card.isFaceUp ? 'Face-up' : 'Face-down'} card with ${selectedDeck} ${card.id}`}
              tabIndex={0}
              onClick={() => handleFlip(card, i)}
              className="w-auto"
            >
              <MDBCardBody className={card.isFaceUp ? '' : 'card-back'}>
                <img
                  src={getImageSrc(card)}
                  alt={getImageAlt(card)}
                  // height="150"
                  // width="150"
                  className="img-fluid"
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        );
      })}
    </React.Fragment>
  );
};

export default Card;
