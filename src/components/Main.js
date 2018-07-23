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
    const {shuffleBots, firstCard, secondCard, selected} = this.state;
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
      console.log('flip');
      let id = robot.id;
      shuffleBots[index].isFaceUp = true;
      if(selected && selected.length < 2) {
        console.log('index', index, robot.id, selected.length);
        this.setState(
          (prevState) => ({
            selected: [...prevState.selected, id]
          })
        );
      }
        if(selected.length === 2) {
          console.log('checkMatch', selected, selected.length),
          handleMatch()
        }
     return;
    }

    const handleMatch = () => {
      const {shuffleBots, selected} = this.state;
        if(selected[0] === selected[1]) {
          console.log('they match!'),
          this.setState({ selected: [] })
        }
        if(selected[0] != selected[1]) {
          this.setState({ selected: [] }),
          shuffleBots.forEach(bot => bot.isFaceUp = false)
        }
    }

    //  const {shuffleBots, firstCard, secondCard} = this.state;
    //  console.log('a', firstCard, secondCard);
    //  if(shuffleBots[firstCard].id === shuffleBots[secondCard].id) {
    //    console.log('matched');
    //  }
    //  return(
    //    shuffleBots[firstCard].isFaceUp = false,
    //    shuffleBots[secondCard].isFaceUp = false,
    //    this.setState({ firstCard: null, secondCard: null }),
    //    console.log('reset', firstCard, secondCard)
    //  );
    //  console.log('b', firstCard, secondCard);
    //}

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
