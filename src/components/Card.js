import React from 'react';
import PropTypes from 'prop-types';

const Card = props => {
  const {id, i, isFaceUp, handleFlip} = props;
  return (
    <div className='card' key={i} onClick={e => handleFlip(id)}>
      <div className={`card-body ${isFaceUp ? '' : 'card-back'}`}>
        <img role='presentation' src={`https://robohash.org/${id}`} height="150" width="150" />
      </div>
    </div>
  );
};

Card.propTypes = {
	id: PropTypes.number.isRequired,
};

export default Card;
