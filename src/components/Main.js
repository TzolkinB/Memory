import React      from 'react';
import Alert      from 'react-s-alert';
import Modal      from './shared/Modal';
import Card       from './Card';
import { robots } from './../robots';

const shuffle = (robots) => {
  // use Fisher-Yates for truly random but for code test
  // short code might outweight whether or not results truly random
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
    const {
      shuffleBots, selected, bluePlayer,
      redPlayer
    }= this.state;
    
    this.setState({
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
    });
    $('#modal').modal('hide'),
    shuffleBots.forEach(bot => bot.isFaceUp = false)
  }

  playerInfo() {
    if(this.state.bluePlayer.active) {
      return <p className="player-text text-info">Blue Player's Turn</p>;
    }
    return <p className="player-text text-danger">Red Player's Turn</p>;
  }

  render() {
    const {
      shuffleBots, selected, bluePlayer,
      redPlayer
    }= this.state;

    const handleFlip = (robot, index) => {
      let id = robot.id;
      shuffleBots[index].isFaceUp = true;
      if(selected && selected.length <= 1) {
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
        if(bluePlayer.active === true){
          bluePlayer.matches++
        }
        if(redPlayer.active === true){
          redPlayer.matches++
        }
        checkWinner();
      }
      if(selected[0] != selected[1]) {
        //resets all cards to face down, except ones that match 
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

    const checkWinner = () => {
      const {bluePlayer, redPlayer} = this.state;
      if(bluePlayer.matches === 3 && redPlayer.matches === 3) {
        Alert.warning('It is a tie!')
      }
      if(bluePlayer.matches === 4) {
        Alert.info('Blue Player Wins!')
      }
      if(redPlayer.matches === 4) {
        Alert.error('Red Player Wins!')
      }
      return;
    };

    return (
      <main className="container-fluid">
        <div className="info d-flex justify-content-between mt-4">
          <button
            type="button"
            data-toggle="modal"
            data-target="#modal"
            className="btn btn-raised btn-success">
            Restart
          </button>
          {this.playerInfo()}
          <table>
            <thead>
              <tr>
                <th className="text-info pr-3">Blue Player</th>
                <th className="text-danger">Red Player</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bluePlayer.matches}</td>
                <td>{redPlayer.matches}</td>
              </tr>
            </tbody>
          </table>
          <div className="mobile-stats mt-4 pr-2">
            <p className="text-info d-inline font-weight-bold pr-3">
              Blue Player: {bluePlayer.matches}
            </p>
            <p className="text-danger d-inline font-weight-bold">
              Red Player: {redPlayer.matches}
            </p>
          </div>
        </div>
        <div className="card-deck">
          <Card shuffleBots={shuffleBots} handleFlip={handleFlip} />
        </div>
        <Modal 
          closeText="Cancel"
          confirmText="Yes"
          handleClick={e => this.reShuffle(shuffleBots)}>
          <p>Are you sure you want to reshuffle and restart the game?</p>
        </Modal>
      </main>
    );
  }
}

export default App;
