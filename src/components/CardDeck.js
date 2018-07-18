import React     from 'react';
import PropTypes from 'prop-types';
import Card      from './shared/Card';

const CardDeck = props => {
  const {robots} = props;

  return (
    <div className="card-deck">
      {robots.map((robot, i) => {
        return(
          <Card
            key={i}
            id={robot.id} />
        );
      })}
    </div>
  );
};

CardDeck.propTypes = {
  robots: PropTypes.array.isRequired
};

export default CardDeck;
