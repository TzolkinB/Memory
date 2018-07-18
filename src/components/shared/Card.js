import React from 'react';
import PropTypes from 'prop-types';


const Card = props => {
  const {id} = props;
  return (
    <div className='card'>
      <div className="card-body">
        <img role='presentation' src={`https://robohash.org/${id}`} height="150" width="150" />
      </div>
    </div>
  );
};

Card.propTypes = {
	id: PropTypes.number.isRequired,
};

export default Card;
