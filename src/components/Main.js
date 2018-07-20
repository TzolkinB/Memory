import React      from 'react';
import Card   from './Card';
import { robots } from './../robots';

const shuffle = (robots) => {
  robots.sort(() => {
    return 0.5 - Math.random()
  });
  return robots;
};

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      shuffledBots: shuffle(robots),
      isFaceUp: false
    };
    this.handleFlip = this.handleFlip.bind(this);
  }

  reShuffle(bots) {
    this.setState({ shuffledBots: shuffle(bots)});
  }

  handleFlip(e, id) {
    const {isFaceUp} = this.state;
    e.preventDefault;
    console.log('id', id);
    this.setState({ isFaceUp: !isFaceUp })
  }

  render() {
    const {shuffledBots, isFaceUp} = this.state;


    return (
      <main className="container-fluid">
        <button
          type="button"
          onClick={e => this.reShuffle(shuffledBots)}
          className="btn btn-raised btn-success">
          Shuffle
        </button>
        <div className="card-deck">
          {shuffledBots.map((robot, i) => {
            return(
            <Card id={robot.id} i={i} isFaceUp={isFaceUp} handleFlip={this.handleFlip} />
            );
          })}
        </div>
      </main>
    );
  }
}

export default App;
