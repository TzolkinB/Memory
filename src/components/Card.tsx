import React from 'react';
import { MDBCard, MDBCardBody, MDBCol } from 'mdb-react-ui-kit';
import { getDragonById, type DeckId } from '../decks';
import { type GameCard } from './Main.types';

interface CardProps {
  shuffledCards: GameCard[];
  handleFlip: (card: GameCard, index: number) => void;
  selectedDeck: DeckId;
}

const Card: React.FC<CardProps> = ({
  shuffledCards,
  handleFlip,
  selectedDeck,
}) => {
  const getImageSrc = (card: GameCard): string => {
    if (selectedDeck === 'dragons') {
      const dragon = getDragonById(card.id);
      return dragon?.imageUrl || `https://robohash.org/${card.id}`;
    }
    return `https://robohash.org/${card.id}`;
  };

  const getImageAlt = (card: GameCard): string => {
    if (selectedDeck === 'dragons') {
      const dragon = getDragonById(card.id);
      return dragon?.name || `Dragon ${card.id}`;
    }
    return `Robot ${card.id}`;
  };

  return (
    <React.Fragment>
      {shuffledCards.map((card, i) => {
        return (
          <MDBCol sm="4" lg="3" size={4} key={card.instanceId} className="px-0">
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
                  loading="lazy"
                  referrerPolicy="no-referrer"
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
