/**
 * Game state management for Tic-Tac-Toe.
 */

import { log } from './logger.js';

/**
 * Represents the game state for a Tic-Tac-Toe game.
 */
export class GameState {
  /**
   * Creates a new game state.
   * @param {string} level - Difficulty level ('Easy', 'Medium', 'Hard').
   */
  constructor(level = 'Hard') {
    this.SYMBOL = {
      human: 'X',
      robot: 'O',
    };

    this.RESULTS = {
      incomplete: 0,
      playerXWon: this.SYMBOL.human,
      playerOWon: this.SYMBOL.robot,
      tie: 3,
    };

    this.BOARD = [['', '', ''], ['', '', ''], ['', '', '']];
    this.TOTAL_MOVES = 0;
    this.O_MOVES_COUNT = 0;
    this.WINNING_LINE = null;
    this.DIFFICULTY_LEVEL = level;
    this.GAME_RESULT = this.RESULTS.incomplete;
    this.SLASH_INFO = null;
    this.TURN = this.SYMBOL.human;
  }

  /**
   * Creates a deep clone of the game state.
   * @returns {GameState} A new GameState instance with the same values.
   */
  clone() {
    log('Entering into clone');
    const cloneGameState = new GameState();

    cloneGameState.TOTAL_MOVES = this.TOTAL_MOVES;
    cloneGameState.O_MOVES_COUNT = this.O_MOVES_COUNT;
    cloneGameState.WINNING_LINE = this.WINNING_LINE ? [...this.WINNING_LINE] : null;
    cloneGameState.DIFFICULTY_LEVEL = this.DIFFICULTY_LEVEL;
    cloneGameState.GAME_RESULT = this.GAME_RESULT;
    cloneGameState.TURN = this.TURN;
    cloneGameState.SLASH_INFO = this.SLASH_INFO ? { ...this.SLASH_INFO } : null;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        cloneGameState.BOARD[row][col] = this.BOARD[row][col];
      }
    }

    log('Original object ', this);
    log('Clone    object ', cloneGameState);

    return cloneGameState;
  }

  /**
   * Returns an array of empty cell positions.
   * @returns {Array<[number, number]>} Array of [row, col] pairs.
   */
  emptyCells() {
    log('Entering into emptyCells');
    const availableList = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.BOARD[row][col] === '') {
          availableList.push([row, col]);
        }
      }
    }
    log(availableList);
    return availableList;
  }

  /**
   * Checks if a cell is marked.
   * @param {number} row - Row index (0-2).
   * @param {number} col - Column index (0-2).
   * @returns {boolean} True if the cell is marked.
   */
  isCellMarked(row, col) {
    const status = this.BOARD[row][col] !== '';
    log('isCellMarked[' + status + ']');
    return status;
  }

  /**
   * Marks a cell with the current player's symbol.
   * @param {number} row - Row index (0-2).
   * @param {number} col - Column index (0-2).
   * @returns {boolean} True if the cell was marked successfully.
   */
  markCell(row, col) {
    if (this.isCellMarked(row, col)) {
      log('Cell is already marked');
      return false;
    }

    this.BOARD[row][col] = this.TURN;
    this.TOTAL_MOVES++;

    if (this.TURN === this.SYMBOL.robot) this.O_MOVES_COUNT++;

    log(this);
    return true;
  }

  /**
   * Transitions the turn to the other player.
   */
  transitionTurn() {
    log('Entering into transitionTurn');
    this.TURN = this.TURN === this.SYMBOL.human ? this.SYMBOL.robot : this.SYMBOL.human;
  }

  /**
   * Calculates the score for the current game state.
   * @returns {number} The score (positive for human win, negative for robot win, 0 for tie).
   */
  score() {
    log('Entering into score');
    let score = 0;

    if (this.GAME_RESULT === this.RESULTS.playerXWon) {
      score = 10 - this.O_MOVES_COUNT;
    } else if (this.GAME_RESULT === this.RESULTS.playerOWon) {
      score = -10 + this.O_MOVES_COUNT;
    } else {
      score = 0;
    }

    log('Score = [' + score + ']');
    return score;
  }

  /**
   * Checks if the game is over.
   * @returns {boolean} True if the game is over.
   */
  isGameOver() {
    log('Entered into isGameOver : ' + this.TOTAL_MOVES);

    let line;
    let pos;
    let gameStatus = false;

    if (this.GAME_RESULT !== this.RESULTS.incomplete) {
      log('Well, a result is already reached, lets save cpu cycles and do nothing');
      return true;
    }

    if (this.TOTAL_MOVES < 5) {
      log('Too few moves, game cannot be over yet');
      this.GAME_RESULT = this.RESULTS.incomplete;
      return false;
    }

    do {
      // Check for row success
      for (let itr = 0; itr < 3; ++itr) {
        line = this.BOARD[itr].join('');

        if (line === this.TURN.repeat(3)) {
          pos = [[itr, 0], [itr, 1], [itr, 2]];
          gameStatus = true;
          this.SLASH_INFO = { row: itr + 1, col: 0, diag: 0 };
          break;
        }
      }

      if (gameStatus) break;

      // Check for column success
      for (let itr = 0; itr < 3; ++itr) {
        line = [this.BOARD[0][itr], this.BOARD[1][itr], this.BOARD[2][itr]];
        line = line.join('');

        if (line === this.TURN.repeat(3)) {
          pos = [[0, itr], [1, itr], [2, itr]];
          gameStatus = true;
          this.SLASH_INFO = { row: 0, col: itr + 1, diag: 0 };
          break;
        }
      }

      if (gameStatus) break;

      // Check for diagonal success (top-left to bottom-right)
      line = [this.BOARD[0][0], this.BOARD[1][1], this.BOARD[2][2]];
      line = line.join('');

      if (line === this.TURN.repeat(3)) {
        pos = [[0, 0], [1, 1], [2, 2]];
        gameStatus = true;
        this.SLASH_INFO = { row: 0, col: 0, diag: 1 };
        break;
      }

      // Check for diagonal success (top-right to bottom-left)
      line = [this.BOARD[0][2], this.BOARD[1][1], this.BOARD[2][0]];
      line = line.join('');

      if (line === this.TURN.repeat(3)) {
        pos = [[0, 2], [1, 1], [2, 0]];
        gameStatus = true;
        this.SLASH_INFO = { row: 0, col: 0, diag: 2 };
        break;
      }
    } while (0);

    if (gameStatus) {
      log('WINNER OF THE GAME IS ' + this.TURN);

      this.WINNING_LINE = pos;

      if (this.TURN === this.SYMBOL.human) {
        this.GAME_RESULT = this.RESULTS.playerXWon;
      } else {
        this.GAME_RESULT = this.RESULTS.playerOWon;
      }
    } else if (this.TOTAL_MOVES >= 9) {
      log('All the steps are exhausted, its a TIE');
      this.GAME_RESULT = this.RESULTS.tie;
      gameStatus = true;
    }

    return gameStatus;
  }

  /**
   * Gets the finishing move for a player (winning or blocking).
   * @param {string} player - The player symbol ('X' or 'O').
   * @returns {Array<[number, number]>|null} The finishing move or null if none exists.
   */
  getFinishMoves(player) {
    log('Entered into getFinishMoves : ' + player + ' -> ' + this.TOTAL_MOVES);

    const finishMoves = [];

    if (this.TOTAL_MOVES < 3) {
      log('Too few moves, there are no finish moves yet');
      return null;
    }

    do {
      // Check for row success
      for (let row = 0; row < 3; ++row) {
        const line = this.BOARD[row].join('');

        if (line === player.repeat(2)) {
          for (let col = 0; col < 3; ++col) {
            if (this.BOARD[row][col] === '') {
              finishMoves.push([row, col]);
              break;
            }
          }
          break;
        }
      }

      if (finishMoves.length > 0) {
        break;
      }

      // Check for column success
      for (let col = 0; col < 3; ++col) {
        const line = [this.BOARD[0][col], this.BOARD[1][col], this.BOARD[2][col]];
        const lineStr = line.join('');

        if (lineStr === player.repeat(2)) {
          for (let row = 0; row < 3; ++row) {
            if (this.BOARD[row][col] === '') {
              finishMoves.push([row, col]);
              break;
            }
          }
          break;
        }
      }

      if (finishMoves.length > 0) {
        break;
      }

      // Check for diagonal success (top-left to bottom-right)
      const diag1 = [this.BOARD[0][0], this.BOARD[1][1], this.BOARD[2][2]];
      const diag1Str = diag1.join('');

      if (diag1Str === player.repeat(2)) {
        if (this.BOARD[0][0] === '') finishMoves.push([0, 0]);
        else if (this.BOARD[1][1] === '') finishMoves.push([1, 1]);
        else if (this.BOARD[2][2] === '') finishMoves.push([2, 2]);
        break;
      }

      // Check for diagonal success (top-right to bottom-left)
      const diag2 = [this.BOARD[0][2], this.BOARD[1][1], this.BOARD[2][0]];
      const diag2Str = diag2.join('');

      if (diag2Str === player.repeat(2)) {
        if (this.BOARD[0][2] === '') finishMoves.push([0, 2]);
        else if (this.BOARD[1][1] === '') finishMoves.push([1, 1]);
        else if (this.BOARD[2][0] === '') finishMoves.push([2, 0]);
        break;
      }
    } while (0);

    log(finishMoves);
    log(finishMoves[0]);

    return finishMoves.length > 0 ? finishMoves[0] : null;
  }
}

// Export for backward compatibility
export const cGameState = GameState;
