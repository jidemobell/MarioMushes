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
      marioPostion: this.playerSquare(boardHeight),
      enemyPositions: this.randomSprite(Array(boardHeight * boardHeight).fill(null)),
    };
  }

  componentDidMount() {
    setTimeout(this.interval.bind(this), 4000);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setMarioPostion(step) {
    this.setState({
      marioPostion: step,
    });
  }

  setEnemyPostions(array) {
    this.setState({
      enemyPositions: array,
    });
  }

  interval() {
    setInterval(this.moveMario(), 3000);
  }


  playerSquare(x) {
    return ((Math.round(x / 2) * x) - Math.round(x / 2));
  }

  randomSprite(stateArray) {
    const ranPositions = [];
    const playerPostion = this.playerSquare(boardHeight); // this.playerSquare(boardHeight);
    const length = stateArray.length;
    for (let i = 0; i < boardHeight; i++) {
      const value = Math.floor((Math.random() * length) + 1);
      if (ranPositions.includes(value)) continue;
      if (value === playerPostion) continue;
      ranPositions.push(value);
    }
    return ranPositions;
  }

  /** positions algorithsm */
  generateTopHorEdgeArrays(val) {
    const array = [];
    let j = val;
    while (array.length < val) {
      array.push(j);
      j--;
    }
    return array;
  }

  generateBotHorEdgeArrays(val) {
    const array = [];
    let j = val * val;
    while (array.length < val) {
      array.push(j);
      j -= 1;
    }
    return array;
  }

  generateLefHorEdgeArrays(val) {
    const array = [];
    let j = 1;
    while (array.length < val) {
      array.push(j);
      j += val;
    }
    return array;
  }

  generateRigHorEdgeArrays(val) {
    const array = [];
    let j = val;
    while (array.length < val) {
      array.push(j);
      j += val;
    }
    return array;
  }
  /**
   * @param  {int} val player or enemy position
   * @param  {int} square board width
   */

  arrayVertFromPostion(val, square) {
    const bottomArray = this.generateBotHorEdgeArrays(square);
    const array = [];
    let j = val;
    while (array.length < square) {
      array.push(j);
      if (bottomArray.includes(j)) {
        let p = val;
        while (array.length < square) {
          p -= square;
          array.push(p);
        }
      }
      j += square;
    }
    return array;
  }

  arrayHorFromPosition(val, square) {
    const rightArray = this.generateRigHorEdgeArrays(square);
    const array = [];
    let j = val;
    while (array.length < square) {
      array.push(j);
      if (rightArray.includes(j)) {
        let p = val;
        while (array.length < square) {
          p -= 1;
          array.push(p);
        }
      }
      j += 1;
    }
    return array.sort((a, b) => a - b);
  }

  returnIntersect(x, y) {
    const array = x.filter(i => -1 !== y.indexOf(i));
    return array;
  }
  /** ******** */


  /** AI */
  marioSteps(array) {
    let { marioPostion } = this.state;
    const { enemyPositions } = this.state;
    const destination = array[0];
    while (marioPostion < destination) {
      marioPostion++;
      this.setMarioPostion(marioPostion);
    }
    enemyPositions.splice(enemyPositions.indexOf(destination, 1));
    this.setEnemyPostions(enemyPositions);
  }

  moveMario() {
    const { marioPostion, enemyPositions } = this.state;
    const marioHorGrid = this.arrayHorFromPosition(marioPostion, boardHeight);

    for (let i = 0; i < enemyPositions.length; i++) {
      const element = enemyPositions[i];
      const enemyVertGrid = this.arrayVertFromPostion(element, boardWidth);

      const nextMoveArray = this.returnIntersect(marioHorGrid, enemyVertGrid);
      this.marioSteps(nextMoveArray);
    }
  }

  /** **** */

  renderSquare(i, k, p, q) {
    return (
      <Square
        value={i}
        key={k}
        keyProp={`${p}${q}`}
      />
    );
  }


  renderBoard(stateArray) {
    const imageStyle = { width: '35px', height: '35px' };
    const { marioPostion, enemyPositions } = this.state;
    const board = [];
    let p = 1;
    let q = 1;
    stateArray.forEach((element, i) => {
      /** place player at center */
      if (i + 1 === marioPostion) {
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
          if (enemyPositions.includes(i + 1)) {
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
          if (enemyPositions.includes(i + 1) && (i + 1) !== marioPostion) {
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
