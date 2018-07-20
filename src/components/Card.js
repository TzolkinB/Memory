import React from 'react';
import PropTypes from 'prop-types';

const Card = props => {
  const {robot, i, isFaceUp, handleFlip} = props;
  return (
    <div className='card' key={i} onClick={()=> handleFlip(robot, isFaceUp, i)}>
      <div className={`card-body ${isFaceUp ? '' : 'card-back'}`}>
        <img role='presentation' src={`https://robohash.org/${robot.id}`} height="150" width="150" />
      </div>
    </div>
  );
};

Card.propTypes = {
	id: PropTypes.number.isRequired,
};

export default Card;
