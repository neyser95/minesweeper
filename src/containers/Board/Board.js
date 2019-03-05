import React, { Component } from 'react';
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
              mine++;
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

  renderBoard(data) {
    return data.map(datarow => {
      return datarow.map(dataitem => {
        return (
          <span key={dataitem.x * datarow.length + dataitem.y}> 
            <Cell
              onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
              cMenu={e => this.handleContextMenu(e, dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className='clear' />
            ) : (
              ''
            )}
          </span>
        );
      });
    });
  }

  render() {
    return <div>{this.renderBoard(this.state.boardData)}</div>;
  }
}

export default Board;
