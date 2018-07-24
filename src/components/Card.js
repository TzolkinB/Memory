import React from 'react';
import PropTypes from 'prop-types';

const Card = props => {
  const {shuffleBots, handleFlip} = props;
  return (
    <React.Fragment>
      {shuffleBots.map((robot, i) => {
        return(
          <div className='card' key={i} onClick={()=> handleFlip(robot, i)}>
            <div className={`card-body ${robot.isFaceUp ? '' : 'card-back'}`}>
              <img role='presentation' src={`https://robohash.org/${robot.id}`} height="150" width="150" />
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

Card.propTypes = {
	shuffleBots: PropTypes.array.isRequired,
  handleFlip: PropTypes.func.isRequired
};

export default Card;
