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
      secondCard: null,
      selected: []
    };
  }

  reShuffle(bots) {
    const {shuffleBots, firstCard, secondCard} = this.state;
    this.setState({
      shuffleBots: shuffle(bots,
      firstCard: null,
      secondCard: null,
      selected: []
    )});
    shuffleBots.forEach(bot => bot.isFaceUp = false);
  }

  render() {
    const {shuffleBots, selected, firstCard, secondCard}= this.state;

    const handleFlip = (robot, index) => {
      shuffleBots[index].isFaceUp = true;
      console.log('index', index, robot.id);
      //if(selected && selected.length < 2) {
      //  console.log('id', robot.id);
      //  this.setState({ selected: {...selected, robot} });
      //}
      //if(selected.length === 2) {
      //  console.log('match', selected);
      //}
      //return;
      // if(!firstCard) {
      //   console.log('one');
      //  this.setState({ firstCard: index });
      // }
      // if(firstCard && !secondCard) {
      //   this.setState({ secondCard: index }, () => {
      //     handleMatch();
      //   })
      // }
     return;
    }
selectNumber = (numberIndex) => {
  if (this.state.gameStatus !== 'playing') {
    return;
  }
  this.setState(
    (prevState) => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
      gameStatus: this.calcGameStatus([
        ...prevState.selectedIds,
        numberIndex,
      ]),
    }),
    () => {
      if (this.state.gameStatus !== 'playing') {
        clearInterval(this.intervalId);
      }
    }
  );
};

    const handleMatch = () => {
      const {shuffleBots, firstCard, secondCard} = this.state;
      console.log('a', firstCard, secondCard);
      if(shuffleBots[firstCard].id === shuffleBots[secondCard].id) {
        console.log('matched');
      }
      return(
        shuffleBots[firstCard].isFaceUp = false,
        shuffleBots[secondCard].isFaceUp = false,
        this.setState({ firstCard: null, secondCard: null }),
        console.log('reset', firstCard, secondCard)
      );
      console.log('b', firstCard, secondCard);
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
