import React      from 'react';
import CardDeck   from './CardDeck';
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
      shuffledBots: shuffle(robots)
    }
  }

  reShuffle(bots) {
    this.setState({ shuffledBots: shuffle(bots)});
  }

  render() {
    const {shuffledBots} = this.state;

    return (
      <main className="container-fluid">
        <button
          type="button"
          onClick={e => this.reShuffle(shuffledBots)}
          className="btn btn-raised btn-success">
          Shuffle
        </button>
        <CardDeck robots={shuffledBots}/>
      </main>
    );
  }
}

export default App;
