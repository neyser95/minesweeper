import React from 'react';
import './Cell.css'

const Cell = props => {
  const getValue = () => {
    const { value } = props;
    if (!value.isRevealed) {
      return props.value.isFlagged ? <i className="fas fa-flag"></i> : null;
    }
    if (value.isMine) {
      return <i className="fas fa-bomb"></i>;
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  let className = 'cell';

  if(props.value.isRevealed){
    className += ' cell-revealed'
  }

  return (
    <div
      className={className}
      onClick={props.clicked}
      onContextMenu={props.cMenu}
    >
      {getValue()}
    </div>
  );
}

export default Cell;