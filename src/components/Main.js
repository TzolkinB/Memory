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
      shuffleBots: shuffle(bots),
      selected: []
    });
    shuffleBots.forEach(bot => bot.isFaceUp = false);
  }

  render() {
    const {shuffleBots, selected}= this.state;

    const handleFlip = (robot, index) => {
      console.log('flip');
      let id = robot.id;
      shuffleBots[index].isFaceUp = true;
      if(selected && selected.length <= 1) {
        console.log('index', index, robot.id, selected.length);
        this.setState(
          (prevState) => ({
            selected: [...prevState.selected, id]
          })
        );
      }
      if(selected.length === 1) {
          console.log('checkMatch', selected, selected.length),
      setTimeout(() => {
          handleMatch()
      }, 500);
        }
     return;
    }

    const handleMatch = () => {
      const {shuffleBots, selected} = this.state;
      console.log('selected', selected);
      const i = 0;
      setTimeout(() => {
        if(selected[0] === selected[1]) {
          console.log('they match!')
          this.setState({ selected: [] })
        }
        //if(selected[0] != selected[1]) {
        // //resets all cards to face down, need to exclude the ones that match 
        //  shuffleBots.forEach(bot => bot.isFaceUp = false),
        //  this.setState({ selected: [] })
        //}
        let a = selected[0];
        let b = selected[1];
        shuffleBots.map(bot => {
          if(shuffleBots.id === a) {
            return(
              bot.isFaceUp = false
            );
          }
          this.setState({ selected: [] })
        });
      }, 500);
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
