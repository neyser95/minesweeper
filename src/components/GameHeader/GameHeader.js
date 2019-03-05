import React from 'react';
import './GameHeader.css';

const gameHeader = props => (
  <div className='game-header'>
    <div>{props.flags}</div>
    <button>
      <i className='fas fa-smile' />
    </button>
    <div>{props.timer}</div>
  </div>
);

export default gameHeader;
