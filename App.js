import React from 'react';
import './App.css';
import { red, black } from 'color-name';
function Square(props) {
  return (
    <button className={"square" + (props.isWinning ? " winning" : " regular")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        style={{backgroundColor: "red"}}
        value={this.props.squares[i]}
        isWinning={this.props.winningSquares.includes(i)}
        crossLine={this.props.crossLine.includes(i)}
        onClick={() => this.props.onClick(i)}
      />
    );
  }


  render() {
    console.log(this.props);
    return (
        <div className="board-row">
        <div className="crossLine"></div>
          <div className="first">{this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      winningSquares:[],
      crossLine:[], //x3
      stepNumber: 0,
      xIsNext: true
    };
    this.lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    this.crossLine = [
      {
        backgroundColor:black
      }
      //...
    ];
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  calculateWinner(squares) {

    for (let i = 0; i < this.lines.length; i++) {
      const [a, b, c] = this.lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        if (this.state.winningSquares !== this.lines[i]) {
          this.setState({
            winningSquares: this.lines[i]
          })
        }
        if(this.state.crossLine !== this.lines[i]){
          this.setState({
          crossLine:this.lines[i]
          })
        }
        return squares[a];
      }
    }
    return null;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);


    const moves = history.map((step, move) => {
      const desc = move ?
        'Перейти к ходу #' + move :
        'К началу игры';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      
      );
    });

    let status;
    
    if (winner) {
      status = "Подедитель: " + winner;
    } else {
      status = "Следующий ход: " + (this.state.xIsNext ? "X" : "O");
    }
    if(winner === null && (this.state.stepNumber === 9)) {
      //check for a draw
      status = "Ничья";
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={this.state.winningSquares}
            crossLine={this.state.crossLine}
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
    }
  }
