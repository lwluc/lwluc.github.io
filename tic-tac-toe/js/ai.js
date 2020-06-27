// most of this code is straight out of https://github.com/Mostafa-Samir/Tic-Tac-Toe-AI/blob/master/scripts/ai.js
// he wrote the code so well that i ended up using the same names too

const AIAction = function(pos) {
  /**
   * The position on the board that the action would put the letter on.
   * @public
   */
  this.movePosition = pos; // this is going to contain the array as {row, col}

  /**
   * The minimax value of the state that the action leads to when applied.
   * @public
   */
  this.minimaxVal = 0;
};

/**
 * Defines a rule for sorting AIActions in ascending manner.
 * @public @static
 * @param {AIAction} firstAction: The first action in a pairwise sort.
 * @param {AIAction} secondAction: The second action in a pairwise sort.
 * @return {Number}: -1, 1, or 0
 */
AIAction.ASCENDING = function(firstAction, secondAction) {
  logger.log('Entering into AIAction.ASCENDING');
  if (firstAction.minimaxVal < secondAction.minimaxVal) return -1;
  // indicates that firstAction goes before secondAction
  else if (firstAction.minimaxVal > secondAction.minimaxVal) return 1;
  // indicates that secondAction goes before firstAction
  else return 0; // indicates a tie
};

/**
 * Defines a rule for sorting AIActions in descending manner.
 * @public @static
 * @param {AIAction} firstAction The first action in a pairwise sort.
 * @param {AIAction} secondAction The second action in a pairwise sort.
 * @return {Number} -1, 1, or 0
 */
AIAction.DESCENDING = function(firstAction, secondAction) {
  logger.log('Entering into AIAction.DESCENDING');
  if (firstAction.minimaxVal > secondAction.minimaxVal) return -1;
  // indicates that firstAction goes before secondAction
  else if (firstAction.minimaxVal < secondAction.minimaxVal) return 1;
  // indicates that secondAction goes before firstAction
  else return 0; // indicates a tie
};

// In a state where multiple steps have the score, we end up taking the 1st move everytime.
// This makes the game predictable. Hence, randomily sorting all the same values will provide us
// with a new move everytime.
AIAction.shuffleResults = function(actionList) {
  logger.log('Entering into AIAction.shuffleResults');

  // shuffles the array in place
  for (let i = actionList.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [actionList[i], actionList[rand]] = [actionList[rand], actionList[i]];
  }
};

/**
 * Constructs an AI player with a specific level of intelligence.
 */
const AI = function() {
  // this tells the number of times the minimaxVal function is called
  let cnt = 0;
  let game; // this is the game state to handle, in other words this is the parGameState variable

  /**
   * Recursively computes the minimax value of a game state.
   * @private
   * @param {State} parGameState The state to calculate its minimax value.
   * @returns {Number} The minimax value of the state.
   */
  function minimaxValue(parGameState) {
    logger.log('Entering into minimaxValue = ' + cnt++);

    if (parGameState.isGameOver()) {
      return parGameState.score();
    } else {
      let stateScore; // this stores the minimax value we'll compute

      if (parGameState.TURN === parGameState.SYMBOL.human) {
        // X wants to maximize --> initialize to a value smaller than any possible score
        stateScore = -1000;
      } else {
        // O wants to minimize --> initialize to a value larger than any possible score
        stateScore = 1000;
      }

      const available_cells = parGameState.emptyCells();
      logger.log('available_cells.length = ' + available_cells.length);

      // enumerate next available_cells states using the info form available_cells positions
      const available_NextStates = available_cells.map(function(pos) {
        const nextState = parGameState.clone();
        nextState.markCell(pos[0], pos[1]);
        nextState.transitionTurn();

        return nextState;
      });

      logger.log(
        'available_NextStates.length = ' + available_NextStates.length
      );

      /*
       * calculate the minimax value for all available_cells next states
       * and evaluate the current state's value
       */
      available_NextStates.forEach(function(nextState) {
        const nextScore = minimaxValue(nextState);

        if (parGameState.TURN === parGameState.SYMBOL.human) {
          // X wants to maximize --> update stateScore iff nextScore is larger
          if (nextScore > stateScore) {
            stateScore = nextScore;
          }
        } else {
          // O wants to minimize --> update stateScore iff nextScore is smaller
          if (nextScore < stateScore) {
            stateScore = nextScore;
          }
        }
      });

      return stateScore;
    }
  }

  function getMoveWrapper(probability) {
    // if we pass out symbol, we get a winning move
    let finish_moves = game.getFinishMoves(game.TURN);

    if (finish_moves !== undefined && finish_moves.length > 0) {
      return finish_moves;
    }

    // without this, medium is also getting a little difficult to win and all of them are going to tie
    if (Math.random() * 100 <= probability) {
      // if we pass opponents move, then we get a blocking move.
      let finish_moves = game.getFinishMoves(
        game.TURN === game.SYMBOL.human ? game.SYMBOL.robot : game.SYMBOL.human
      );

      if (finish_moves !== undefined && finish_moves.length > 0) {
        return finish_moves;
      }
    }

    const available_cells = game.emptyCells();

    logger.disableLogging();

    // enumerate and calculate the score for each available_cells actions to the ai player
    const available_moves = available_cells.map(function(pos) {
      const action = new AIAction(pos); // create the action object
      const new_state = game.clone(); // clone the game state object for more permutations
      new_state.markCell(pos[0], pos[1]);
      new_state.transitionTurn();

      action.minimaxVal = minimaxValue(new_state); // calculate and set the action's minmax value

      return action;
    });

    logger.log('available_moves.length = ' + available_moves.length);
    for (let itr = 0; itr < available_moves.length; itr++) {
      logger.log(
        'itr[' +
          itr +
          '] movePosition[' +
          available_moves[itr].movePosition +
          '] minimaxVal[' +
          available_moves[itr].minimaxVal +
          ']'
      );
    }

    AIAction.shuffleResults(available_moves);

    // sort the enumerated actions list by score
    if (game.TURN === game.SYMBOL.human) {
      // X maximizes --> sort the actions in a descending manner to have the action with maximum minimax at first
      available_moves.sort(AIAction.DESCENDING);
    } else {
      // O minimizes --> sort the actions in an ascending manner to have the action with minimum minimax at first
      available_moves.sort(AIAction.ASCENDING);
    }

    /*
     * take the optimal action 40% of the time, and take the 1st suboptimal action 50% of the time
     */
    let chosenMove;
    if (Math.random() * 100 <= probability) {
      logger.log('Playing a optimal solution as random <= probability');

      chosenMove = available_moves[0];
    } else {
      if (available_moves.length >= 2) {
        // if there is two or more available_cells actions, choose the 1st suboptimal
        chosenMove = available_moves[1];
      } else {
        // choose the only available_cells actions
        chosenMove = available_moves[0];
      }
    }

    return chosenMove;
  }

  /**
   * Make the ai player take a blind move,
   * that is, choose the cell to place its symbol randomly
   * @private
   */
  function takeAEasyMove() {
    logger.log('Entering into takeAEasyMove');

    // if we pass out symbol, we get a winning move
    const finish_moves = game.getFinishMoves(game.TURN);

    if (finish_moves !== undefined && finish_moves.length > 0) {
      return finish_moves;
    }

    const available_cells = game.emptyCells();

    // it isn't called easy for a reason. its just random.
    // will it be better to atleast add a winning position and blocking position guess to it?
    // it should, as this is a easy move, not a dumb move
    const temp = Math.floor(Math.random() * available_cells.length);
    const randomCell = available_cells[temp];
    return randomCell;
  }

  /**
   * Make the ai player take a novice move,
   * that is, mix between choosing the optimal and suboptimal minimax decisions.
   * @private
   */
  function takeAMediumMove() {
    logger.log('Entering into takeAMediumMove');
    return getMoveWrapper(50); // play a good step all the time with 50% probability
  }

  /**
   * Make the ai player take a master move,
   * that is, choose the optimal minimax decision.
   * @private
   */
  function takeAHardMove() {
    logger.log('Entering into takeAHardMove');
    return getMoveWrapper(100); // play a good step all the time with 100% probability
  }

  /**
   * Notify the ai player that it's its turn.
   * @public
   */
  this.getBestRobotMove = function(parGameState) {
    logger.log('Entering into getBestRobotMove');

    game = parGameState.clone();
    let cell_to_play;
    switch (game.DIFFICULTY_LEVEL) {
      // invoke the desired behavior based on the level chosen
      case 'Easy':
        cell_to_play = takeAEasyMove();
        break;
      case 'Medium':
        cell_to_play = takeAMediumMove();
        break;
      case 'Hard':
        cell_to_play = takeAHardMove();
        break;
      default:
        logger.log('Entered into default case, something is not right');
    }

    if (cell_to_play.movePosition === undefined) {
      logger.log('Choosen cell is [' + cell_to_play + ']');
      return cell_to_play;
    } else {
      logger.log(
        'Choosen cell is [' +
          cell_to_play.movePosition +
          '] with a score of [' +
          cell_to_play.minimaxVal +
          ']'
      );
      return cell_to_play.movePosition;
    }
  };
};
