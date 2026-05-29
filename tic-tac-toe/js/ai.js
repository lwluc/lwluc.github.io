/**
 * AI logic for Tic-Tac-Toe using the Minimax algorithm.
 * Inspired by: https://github.com/Mostafa-Samir/Tic-Tac-Toe-AI/blob/master/scripts/ai.js
 */

import { log } from './logger.js';

/**
 * Represents an AI action (move) with a minimax value.
 */
export class AIAction {
  /**
   * Creates a new AI action.
   * @param {Array<[number, number]>} pos - The position [row, col] to play.
   */
  constructor(pos) {
    this.movePosition = pos;
    this.minimaxVal = 0;
  }

  /**
   * Comparator for sorting AI actions in ascending order.
   * @param {AIAction} firstAction - First action.
   * @param {AIAction} secondAction - Second action.
   * @returns {number} -1, 0, or 1.
   */
  static ASCENDING(firstAction, secondAction) {
    log('Entering into AIAction.ASCENDING');
    if (firstAction.minimaxVal < secondAction.minimaxVal) return -1;
    else if (firstAction.minimaxVal > secondAction.minimaxVal) return 1;
    else return 0;
  }

  /**
   * Comparator for sorting AI actions in descending order.
   * @param {AIAction} firstAction - First action.
   * @param {AIAction} secondAction - Second action.
   * @returns {number} -1, 0, or 1.
   */
  static DESCENDING(firstAction, secondAction) {
    log('Entering into AIAction.DESCENDING');
    if (firstAction.minimaxVal > secondAction.minimaxVal) return -1;
    else if (firstAction.minimaxVal < secondAction.minimaxVal) return 1;
    else return 0;
  }

  /**
   * Shuffles an array of actions in place.
   * @param {Array<AIAction>} actionList - The list of actions to shuffle.
   */
  static shuffleResults(actionList) {
    log('Entering into AIAction.shuffleResults');
    for (let i = actionList.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [actionList[i], actionList[rand]] = [actionList[rand], actionList[i]];
    }
  }
}

/**
 * AI player for Tic-Tac-Toe.
 */
export class AI {
  constructor() {
    this.cnt = 0;
    this.game = null;
  }

  /**
   * Recursively computes the minimax value of a game state.
   * @param {GameState} parGameState - The game state to evaluate.
   * @returns {number} The minimax value.
   */
  minimaxValue(parGameState) {
    log('Entering into minimaxValue = ' + this.cnt++);

    if (parGameState.isGameOver()) {
      return parGameState.score();
    }

    let stateScore;
    if (parGameState.TURN === parGameState.SYMBOL.human) {
      stateScore = -1000;
    } else {
      stateScore = 1000;
    }

    const availableCells = parGameState.emptyCells();
    log('available_cells.length = ' + availableCells.length);

    const availableNextStates = availableCells.map(pos => {
      const nextState = parGameState.clone();
      nextState.markCell(pos[0], pos[1]);
      nextState.transitionTurn();
      return nextState;
    });

    log('available_NextStates.length = ' + availableNextStates.length);

    availableNextStates.forEach(nextState => {
      const nextScore = this.minimaxValue(nextState);

      if (parGameState.TURN === parGameState.SYMBOL.human) {
        if (nextScore > stateScore) {
          stateScore = nextScore;
        }
      } else {
        if (nextScore < stateScore) {
          stateScore = nextScore;
        }
      }
    });

    return stateScore;
  }

  /**
   * Gets the best move for the AI based on the current game state.
   * @param {GameState} parGameState - The current game state.
   * @returns {Array<[number, number]>} The best move [row, col].
   */
  getMoveWrapper(probability) {
    this.game = parGameState;

    // Check for winning move
    let finishMoves = this.game.getFinishMoves(this.game.TURN);
    if (finishMoves) {
      return finishMoves;
    }

    // Check for blocking move
    if (Math.random() * 100 <= probability) {
      finishMoves = this.game.getFinishMoves(
        this.game.TURN === this.game.SYMBOL.human ? this.game.SYMBOL.robot : this.game.SYMBOL.human
      );
      if (finishMoves) {
        return finishMoves;
      }
    }

    const availableCells = this.game.emptyCells();
    log.disableLogging();

    const availableMoves = availableCells.map(pos => {
      const action = new AIAction(pos);
      const newState = this.game.clone();
      newState.markCell(pos[0], pos[1]);
      newState.transitionTurn();
      action.minimaxVal = this.minimaxValue(newState);
      return action;
    });

    log('available_moves.length = ' + availableMoves.length);
    for (let itr = 0; itr < availableMoves.length; itr++) {
      log(
        'itr[' +
          itr +
          '] movePosition[' +
          availableMoves[itr].movePosition +
          '] minimaxVal[' +
          availableMoves[itr].minimaxVal +
          ']'
      );
    }

    AIAction.shuffleResults(availableMoves);

    if (this.game.TURN === this.game.SYMBOL.human) {
      availableMoves.sort(AIAction.DESCENDING);
    } else {
      availableMoves.sort(AIAction.ASCENDING);
    }

    let chosenMove;
    if (Math.random() * 100 <= probability) {
      log('Playing a optimal solution as random <= probability');
      chosenMove = availableMoves[0];
    } else {
      if (availableMoves.length >= 2) {
        chosenMove = availableMoves[1];
      } else {
        chosenMove = availableMoves[0];
      }
    }

    return chosenMove;
  }

  /**
   * Makes an easy move (random).
   * @returns {Array<[number, number]>|null} The move or null.
   */
  takeAEasyMove() {
    log('Entering into takeAEasyMove');

    const finishMoves = this.game.getFinishMoves(this.game.TURN);
    if (finishMoves) {
      return finishMoves;
    }

    const availableCells = this.game.emptyCells();
    const temp = Math.floor(Math.random() * availableCells.length);
    return availableCells[temp];
  }

  /**
   * Makes a medium move (50% optimal, 50% suboptimal).
   * @returns {Array<[number, number]>|AIAction} The move.
   */
  takeAMediumMove() {
    log('Entering into takeAMediumMove');
    return this.getMoveWrapper(50);
  }

  /**
   * Makes a hard move (100% optimal).
   * @returns {Array<[number, number]>|AIAction} The move.
   */
  takeAHardMove() {
    log('Entering into takeAHardMove');
    return this.getMoveWrapper(100);
  }

  /**
   * Gets the best move for the robot.
   * @param {GameState} parGameState - The current game state.
   * @returns {Array<[number, number]>} The best move [row, col].
   */
  getBestRobotMove(parGameState) {
    log('Entering into getBestRobotMove');

    this.game = parGameState.clone();
    let cellToPlay;

    switch (this.game.DIFFICULTY_LEVEL) {
      case 'Easy':
        cellToPlay = this.takeAEasyMove();
        break;
      case 'Medium':
        cellToPlay = this.takeAMediumMove();
        break;
      case 'Hard':
        cellToPlay = this.takeAHardMove();
        break;
      default:
        log('Entered into default case, something is not right');
        cellToPlay = this.takeAHardMove();
    }

    if (cellToPlay.movePosition === undefined) {
      log('Choosen cell is [' + cellToPlay + ']');
      return cellToPlay;
    } else {
      log(
        'Choosen cell is [' +
          cellToPlay.movePosition +
          '] with a score of [' +
          cellToPlay.minimaxVal +
          ']'
      );
      return cellToPlay.movePosition;
    }
  }
}
