import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import mushroom from './images/mushroom.png';
import mario from './images/mario.png';

const boardHeight = prompt('Enter a board height');
const boardWidth = prompt('Enter a board width');

function Square(props) {
  return (
    <button className="square" type="button">
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(boardHeight * boardHeight).fill(null),
    };
  }

  playerSquare(x) {
    return ((Math.round(x / 2) * x) - Math.round(x / 2));
  }

  randomSprite(stateArray) {
    const ranPositions = [];
    const playerPos = this.playerSquare(boardHeight);
    const length = stateArray.length;
    for (let i = 0; i < boardHeight; i++) {
      const value = Math.floor((Math.random() * length) + 1);
      if (ranPositions.includes(value)) continue;
      if (value === playerPos) continue;
      ranPositions.push(value);
    }
    return ranPositions;
  }

  renderSquare(i, k, p, q) {
    return (
      <Square
        value={i}
        key={k}
        keyProp={`${p}${q}`}
      />
    );
  }

  /** AI here */

  /** ******** */

  renderBoard(stateArray) {
    const imageStyle = { width: '35px', height: '35px' };
    const board = [];
    const playPos = this.playerSquare(boardHeight);
    let p = 1;
    let q = 1;
    const randomArray = this.randomSprite(this.state.squares);
    stateArray.forEach((element, i) => {
      /** place player at center */
      if (i + 1 === playPos) {
        board.push(
          this.renderSquare(<img src={mario} style={imageStyle} alt=" " />, i + 1, p, q),
        );
        q++;
      } else {
        /**
         * render squares with new rows at
         * board edge limit and displaying
         * mushrooms based on generated positions
         */
        if ((i + 1) % boardHeight === 0) {
          if (randomArray.includes(i + 1)) {
            board.push(
              <div className="board-row" key={i + 1}>
                {this.renderSquare(<img src={mushroom} style={imageStyle} alt=" " />, i + 1, p, q)}
              </div>,
            );
            p++;
            q = 1;
          } else {
            board.push(
              <div className="board-row" key={i + 1}>
                {this.renderSquare('', i + 1, p, q)}
              </div>,
            );
            p++;
            q = 1;
          }
        } else {
          if (randomArray.includes(i + 1) && (i + 1) !== playPos) {
            board.push(
              this.renderSquare(<img src={mushroom} style={imageStyle} alt=" " />, i + 1, p, q),
            );
            q++;
          } else {
            board.push(
              this.renderSquare('', i + 1, p, q),
            );
            q++;
          }
        }
      }
    });

    return (
      <div>
        {board}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderBoard(this.state.squares)}
      </div>
    );
  }
}

ReactDOM.render(
  <Board />,
  document.getElementById('root'),
);
