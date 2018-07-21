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
      shuffleBots: shuffle(robots),
      firstCard: null,
      secondCard: null
    };
  }

  reShuffle(bots) {
    this.setState({ shuffleBots: shuffle(bots)});
    this.state.shuffleBots.forEach(bot => bot.isFaceUp = false);
  }

  render() {
    const {shuffleBots} = this.state;

    const handleMatch = (id, index) => {
      const {shuffleBots, firstCard, secondCard} = this.state;
      this.setState({ firstCard: index });
      //let card = () =>  {shuffleBots[index].isFaceUp};
      if(!shuffleBots[index].isFaceUp) {
        return shuffleBots[index].isFaceUp = true;
      }
      return;
    }

    return (
      <main className="container-fluid">
        <button
          type="button"
          onClick={e => this.reShuffle(shuffleBots)}
          className="btn btn-raised btn-success">
          Shuffle
        </button>
        <div className="card-deck">
          <Card shuffleBots={shuffleBots} handleFlip={handleMatch} />
        </div>
      </main>
    );
  }
}

export default App;
