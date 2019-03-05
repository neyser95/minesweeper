import React, { Component } from 'react';
import Game from './containers/Game/Game';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Welcome to Minesweeper!</h1>
        <Game />
      </div>
    );
  }
}

export default App;
