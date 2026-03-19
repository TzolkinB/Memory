import React from 'react';
import { MDBCard, MDBCardBody, MDBCol } from 'mdb-react-ui-kit';
import { type Robot } from '../robots';

interface CardProps {
  shuffleBots: Robot[];
  handleFlip: (robot: Robot, index: number) => void;
}

const Card: React.FC<CardProps> = ({ shuffleBots, handleFlip }) => {
  return (
    <React.Fragment>
      {shuffleBots.map((robot, i) => {
        return (
          <MDBCol sm="4">
            <MDBCard
              key={i}
              data-testid="card"
              data-face-up={robot.isFaceUp}
              role="button"
              aria-expanded={robot.isFaceUp}
              aria-label={`${robot.isFaceUp ? 'Face-up' : 'Face-down'} card with robot ${robot.id}`}
              tabIndex={0}
              onClick={() => handleFlip(robot, i)}
            >
              <MDBCardBody className={robot.isFaceUp ? '' : 'card-back'}>
                <img
                  role="presentation"
                  src={`https://robohash.org/${robot.id}`}
                  height="150"
                  width="150"
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
