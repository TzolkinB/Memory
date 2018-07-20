import React     from 'react';
import PropTypes from 'prop-types';
//import Card      from './Card';

const CardDeck = props => {
  const {robots, isFaceUp, handleFlip} = props;


  return (
          </div>
        );
      })}
    </div>
  );
};

CardDeck.propTypes = {
  robots: PropTypes.array.isRequired
};

export default CardDeck;
