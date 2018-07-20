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
      firstCard: null,
      secondCard: null
    };
    this.handleMatch = this.handleMatch.bind(this);
  }

  reShuffle(bots) {
    this.setState({ shuffledBots: shuffle(bots)});
  }

  handleMatch(id, i, isFaceUp) {
    const {shuffledBots, firstCard, secondCard} = this.state;
    console.log(id, i, isFaceUp);
    //if(shuffledBots.id === id) {
    //    this.setState({ isFaceUp: true });
    //  }
    if(!firstCard) {
      this.setState({ firstCard: i })
    }
  }

  //getCard(id) {
  //  for(let i=0; i < 2*this.NUM_IMAGES; i++) {
  //    if (this.cards[i].id === id) {
  //      return this.cards[i];
  //    }
  //  };
  //}

  render() {
    const {shuffledBots} = this.state;
    let isFaceUp = false;


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
              <Card robot={robot} i={i} isFaceUp={isFaceUp} handleFlip={this.handleMatch} />
            );
          })}
        </div>
      </main>
    );
  }
}

export default App;
              //<div className='card' key={i} onClick={e => handleFlip(id)}>
              //  <div className={`card-body ${isFaceUp ? '' : 'card-back'}`}>
              //    <img role='presentation' src={`https://robohash.org/${id}`} height="150" width="150" />
              //  </div>
              //</div>
