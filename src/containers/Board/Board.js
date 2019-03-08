import React, { Component, Fragment } from 'react';
import Cell from '../../components/Cell/Cell';
import './Board.css';

class Board extends Component {
  // * used to create the board
  createEmptyArray = (height, width) => {
    let data = [];
    for (let i = 0; i < height; i++) {
      // * Creates an empty array for depending on the height. This will represent a row.
      data.push([]);
      for (let j = 0; j < width; j++) {
        // * Creates an empty array for depending on the weight. This will represent a cell inside a row and will also hold information about the cell.
        data[i][j] = {
          // * x and y represent the coordinates of the cell within the board array.
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false
        };
      }
    }

    return data;
  };

  // * plants the mines on the board
  plantMines = (data, height, width, mines) => {
    let randomx,
      randomy,
      minesPlanted = 0;

    // * x and y represent the coordinates of the cell within the board array.
    while (minesPlanted <= mines) {
      // * we create random numbers the will locate one cell.
      randomx = Math.floor(Math.random() * width);
      randomy = Math.floor(Math.random() * height);

      // * we check if that cell is a mine. If it isn't we have a new mine and we increment the number of mines planted.
      if (!data[randomx][randomy].isMine) {
        data[randomx][randomy].isMine = true;
        minesPlanted++;
      }
    }
    return data;
  };

  // * Gets cells that are not mines and locates the the number of mines surrounding it.
  getNeighbours = (data, height, width) => {
    let updatedData = data;
    // * loops through every row
    for (let i = 0; i < height; i++) {
      // * loops through every cell in that row
      for (let j = 0; j < width; j++) {
        // * if its not a mine then it check it's surrounding
        if (data[i][j].isMine !== true) {
          let mine = 0;

          // * calls traverse to return the cells surrounding in an array.
          const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);

          // * loop through the area array and checks if it is a mine
          area.map(value => {
            if (value.isMine) {
              return mine++;
            }
          });

          // * is it has no mines around it then it is empty
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }

          // * we return neighbur to the number of mines around it
          updatedData[i][j].neighbour = mine;
        }
      }
    }
    return updatedData;
  };

  //* looks for neighbouring cells and returns them in an array.
  traverseBoard = (x, y, data) => {
    const el = [];
    //up
    if (x > 0) {
      el.push(data[x - 1][y]);
    }
    //down
    if (x < this.props.height - 1) {
      el.push(data[x + 1][y]);
    }
    //left
    if (y > 0) {
      el.push(data[x][y - 1]);
    }
    //right
    if (y < this.props.width - 1) {
      el.push(data[x][y + 1]);
    }
    // top left
    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }
    // top right
    if (x > 0 && y < this.props.width - 1) {
      el.push(data[x - 1][y + 1]);
    }
    // bottom right
    if (x < this.props.height - 1 && y < this.props.width - 1) {
      el.push(data[x + 1][y + 1]);
    }
    // bottom left
    if (x < this.props.height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }
    return el;
  };

  initBoardData = (height, width, mines) => {
    let data = this.createEmptyArray(height, width);
    data = this.plantMines(data, height, width, mines);
    data = this.getNeighbours(data, height, width);

    return data;
  };

  state = {
    boardData: this.initBoardData(
      this.props.height,
      this.props.width,
      this.props.mines
    ),
    gameStatus: false
  };

  handleCellClick(x, y) {
    // check if revealed. return if true.
    if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged) return null;

    // check if mine. game over if true
    if (this.state.boardData[x][y].isMine) {
      this.setState({ gameStatus: 'You Lost.' });
      this.revealBoard();
      alert('game over');
    }

    let updatedData = this.state.boardData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = this.revealEmpty(x, y, updatedData);
    }
    if (this.getHidden(updatedData).length === this.props.mines) {
      this.setState({ gameStatus: 'You Win.' });
      this.revealBoard();
      alert('You Win');
    }
    this.setState({
      boardData: updatedData,
      mineCount: this.props.mines - this.getFlags(updatedData).length,
      gameWon: 'win'
    });
  }

  revealEmpty(x, y, data) {
    let area = this.traverseBoard(x, y, data);
    area.map(value => {
      if (
        !value.isFlagged &&
        !value.isRevealed &&
        (value.isEmpty || !value.isMine)
      ) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          this.revealEmpty(value.x, value.y, data);
        }
      }
    });
    return data;
  }

  handleContextMenu(event, x, y) {
    event.preventDefault(); // prevents default behaviour (i.e. right click menu on browsers.)
    let updatedData = this.state.boardData;
    let mines = this.state.mineCount;
    let win = false;
    // check if already revealed
    if (updatedData[x][y].isRevealed) return;
    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }
    if (mines === 0) {
      const mineArray = this.getMines(updatedData);
      const FlagArray = this.getFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
        this.revealBoard();
        alert('You Win');
      }
    }
    this.setState({
      boardData: updatedData,
    });
  }
  
  getMines(data) {
    let mineArray = [];

    data.map(datarow => {
      datarow.map((dataitem) => {
        if (dataitem.isMine) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  }

  revealBoard() {
    let updatedData = this.state.boardData;
    updatedData.map(datarow => {
      datarow.map(dataitem => {
        dataitem.isRevealed = true;
      });
    });
    this.setState({
      boardData: updatedData
    });
  }

  // get Hidden cells
  getHidden(data) {
    let mineArray = [];

    data.map(datarow => {
      datarow.map(dataitem => {
        if (!dataitem.isRevealed) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  }

  // get Flags
  getFlags(data) {
    let mineArray = [];

    data.map(datarow => {
      datarow.map(dataitem => {
        if (dataitem.isFlagged) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  }

  renderBoard(data) {
    return data.map((datarow, i) => {
      return (
        <div className='row' key={i}>
          {datarow.map((dataitem, i) => {
            return (
              <Fragment key={dataitem.x * datarow.length + dataitem.y}>
                <Cell
                  value={dataitem}
                  clicked={() => this.handleCellClick(dataitem.x, dataitem.y)}
                  cMenu={(e) => this.handleContextMenu(e, dataitem.x, dataitem.y)}
                />
                {datarow[datarow.length - 1] === dataitem ? (
                  <div className='clear' />
                ) : (
                    ''
                  )}
              </Fragment>
            );
          })}
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderBoard(this.state.boardData)}</div>;
  }
}

export default Board;
