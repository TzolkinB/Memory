import React from 'react';
import { type Robot } from '../robots';

interface CardProps {
  shuffleBots: Robot[];
  handleFlip: (robot: Robot, index: number) => void;
}

const Card: React.FC<CardProps> = ({ shuffleBots, handleFlip }) => {
  return (
    <React.Fragment>
      {shuffleBots.map((robot, i) => {
        return(
          <div
            className='card'
            key={i}
            data-testid="card"
            data-face-up={robot.isFaceUp}
            onClick={()=> handleFlip(robot, i)}
          >
            <div className={`card-body ${robot.isFaceUp ? '' : 'card-back'}`}>
              <img role='presentation' src={`https://robohash.org/${robot.id}`} height="150" width="150" />
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default Card;
