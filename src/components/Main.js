import React      from 'react';
import CardDeck   from './CardDeck';
import { robots } from './../robots';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      robots: robots
    }
  }

  render() {
    const {searchTerm, robots} = this.state;

    return (
      <main className="container-fluid">
        <CardDeck robots={robots}/>
      </main>
    );
  }
}

export default App;
