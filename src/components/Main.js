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
      selected: [],
      bluePlayer: {
        active: true,
        matches: 0
      },
      redPlayer: {
        active: false,
        matches: 0
      }
    };
  }

  reShuffle(bots) {
    const {shuffleBots, selected, bluePlayer} = this.state;
    //set defaultState/ initial state instead of repeating
    this.setState({
      shuffleBots: shuffle(bots),
      selected: [],
    });
    shuffleBots.forEach(bot => bot.isFaceUp = false);
  }

  render() {
    const {shuffleBots, selected, bluePlayer, redPlayer}= this.state;

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
        setTimeout(() => {
          handleMatch()
        }, 500);
      }
     return;
    }

    const handleMatch = () => {
      const {shuffleBots, selected, bluePlayer, redPlayer} = this.state;
      if(selected[0] === selected[1]) {
        console.log('they match!')
        if(bluePlayer.active === true){
          bluePlayer.matches++
        }
        if(redPlayer.active === true){
          redPlayer.matches++
        }
      }
      if(selected[0] != selected[1]) {
       //resets all cards to face down, need to exclude the ones that match 
        let a = selected[0];
        let b = selected[1];
        shuffleBots.forEach(bot => {
          if(a === bot.id && bot.isFaceUp == true) {
            return bot.isFaceUp = false;
          }
          if(b === bot.id && bot.isFaceUp == true) {
            return bot.isFaceUp = false;
          }
        })
      }
      bluePlayer.active = !bluePlayer.active,
      redPlayer.active = !bluePlayer.active,
      this.setState({ selected: [], bluePlayer, redPlayer })
    }

    return (
      <main className="container-fluid">
        <div className=" d-flex justify-content-between">
          <button
            type="button"
            onClick={e => this.reShuffle(shuffleBots)}
            className="btn btn-raised btn-success mt-3">
            Shuffle
          </button>
          <table>
            <thead>
              <tr>
                <th>Blue Player</th>
                <th>Red Player</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bluePlayer.matches}</td>
                <td>{redPlayer.matches}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-deck">
          <Card shuffleBots={shuffleBots} handleFlip={handleFlip} />
        </div>
      </main>
    );
  }
}

export default App;
