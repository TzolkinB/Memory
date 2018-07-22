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

    const handleFlip = (id, index) => {
      const {shuffleBots, firstCard, secondCard} = this.state;
      if(!firstCard) {
        return(
          this.setState({ firstCard: index }),
          shuffleBots[index].isFaceUp = true
        );
      }
      if(firstCard && !secondCard) {
        return( 
          this.setState({ secondCard: index }),
          shuffleBots[index].isFaceUp = true
        );
        if(firstCard && secondCard) {
          handleMatch()
        };
      }
      console.log('aready faceup');
      console.log(firstCard, secondCard);
      return;
    }

    const handleMatch = () => {
      const {shuffleBots, firstCard, secondCard} = this.state;
      console.log('a', firstCard, secondCard);
      if(firstCard != secondCard) {
        return(
          shuffleBots[firstCard].isFaceUp = false,
          shuffleBots[secondCard].isFaceUp = false,
          this.setState({ firstCard: null, secondCard: null })
        );
        console.log('reset', firstCard, secondCard);
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
          <Card shuffleBots={shuffleBots} handleFlip={handleFlip} />
        </div>
      </main>
    );
  }
}

export default App;
