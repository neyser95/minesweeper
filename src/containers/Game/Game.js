import React, { Component, Fragment } from 'react';
import GameHeader from '../../components/GameHeader/GameHeader';
import Modal from '../../components/Modal/Modal';
import Board from '../Board/Board';
import './Game.css';

class Game extends Component {
  state = {
    difficultyObj: {
      easy: {
        height: 9,
        width: 9,
        mines: 10
      },
      medium: {
        height: 16,
        width: 16,
        mines: 40
      },
      hard: {
        height: 16,
        width: 30,
        mines: 99
      }
    },
    timer: 0,
    flags: 10,
    difficulty: 'easy',
    changingDifficulty: false
  };

  changingDifficultyHandler = () => {
    this.setState({ changingDifficulty: true });
  };

  closeChangingDifficultyHandler = () => {
    this.setState({ changingDifficulty: false });
  };

  changeDifficultyHandler = (e) => {
    let element = e.target;
    if(element.classList.contains('modal__choice--active')) return;
    let prevChoice = document.getElementsByClassName('modal__choice--active')[0];
    prevChoice.classList.remove('modal__choice--active');
    element.classList.add('modal__choice--active');
    let difficulty = e.target.getAttribute('data-value');
    let flags = this.state.difficultyObj[difficulty].mines;
    this.closeChangingDifficultyHandler();
    this.setState({difficulty, flags});
  };

  render() {
    const {
      difficulty,
      difficultyObj,
      timer,
      flags,
      changingDifficulty
    } = this.state;

    return (
      <Fragment>
        <button onClick={this.changingDifficultyHandler}>Difficulty</button>
        <Modal show={changingDifficulty}>
          <header className='modal__header'>
            <p>Pick a difficulty: </p>
            <i
              className='fas fa-times'
              onClick={this.closeChangingDifficultyHandler}
            />
          </header>
          <div
            className='modal__choice modal__choice--active'
            data-value='easy'
            onClick={(e) => this.changeDifficultyHandler(e)}
          >Easy</div>
          <div
            className='modal__choice'
            data-value='medium'
            onClick={(e) => this.changeDifficultyHandler(e)}
            >Medium</div>
          <div
            className='modal__choice'
            data-value='hard'
            onClick={(e) => this.changeDifficultyHandler(e)}
            >Hard</div>
        </Modal>
        <div className='game'>
          <GameHeader flags={flags} timer={timer} />
          <Board
            height={difficultyObj[difficulty].height}
            width={difficultyObj[difficulty].width}
            mines={difficultyObj[difficulty].mines}
          />
        </div>
      </Fragment>
    );
  }
}

export default Game;
