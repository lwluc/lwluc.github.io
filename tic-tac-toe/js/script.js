/**
 * Main game script for Tic-Tac-Toe.
 */

import { GameState } from './game_state.js';
import { AI } from './ai.js';
import { UI } from './ui.js';
import { log, disableLogging } from './logger.js';

// Disable logging by default for production
disableLogging();

let GAME_STATE;

/**
 * Prints a welcome message in the console with instructions to skip the game.
 */
function printInfo() {
  const text = [
    'Hello,\n',
    'looks like you are clever enough to open the console.',
    'Maybe with the intuition to bypass the game.',
    'You are the lucky one: Enter "skipGame()" into the console and you will skip the game and be redirected to the page',
    '🤙',
  ].join('\n');
  console.log(text);
}

printInfo();

/**
 * Redirects to the main page with a result code.
 * @param {string} code - The result code ('won', 'hacker', 'again').
 */
function redirect(code) {
  const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
  const redirectToPage = url.replace('tic-tac-toe.html', `index.html?code=${code}`);
  window.location.replace(redirectToPage);
}

/**
 * Skips the game and redirects to the main page.
 */
window.skipGame = function() {
  redirect('hacker');
};

/**
 * Makes the robot's move.
 */
function robotMove() {
  log('Entering into robotMove');

  if (GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.robot) {
    log('It seems the game is over, or its not your turn');
    return false;
  }

  const objAI = new AI();
  const cellToPlay = objAI.getBestRobotMove(GAME_STATE);

  if (GAME_STATE.isCellMarked(cellToPlay[0], cellToPlay[1])) {
    log('As the cell is already marked, do not do anything');
    return true;
  }

  GAME_STATE.markCell(cellToPlay[0], cellToPlay[1]);

  const cell = {
    id: 'cell-' + (cellToPlay[0] + 1) + (cellToPlay[1] + 1),
  };

  UI.drawSVG(cell, GAME_STATE);
  doPostTurnActivities();
  UI.updateScreen(GAME_STATE);
}

/**
 * Handles the player's move.
 */
function playerMove() {
  log('Entering into playerMove');

  if (GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.human) {
    log('It seems the game is over, or its not your turn');
    return false;
  }

  if (
    GAME_STATE.isCellMarked(
      this.getAttribute('data-row'),
      this.getAttribute('data-col')
    )
  ) {
    log('As the cell is already marked, do not do anything');
    return true;
  }

  GAME_STATE.markCell(
    this.getAttribute('data-row'),
    this.getAttribute('data-col')
  );

  UI.drawSVG(this, GAME_STATE);
  doPostTurnActivities();
  UI.updateScreen(GAME_STATE);

  setTimeout(() => robotMove(), 500);
}

/**
 * Handles post-turn activities (check game over, transition turn).
 */
function doPostTurnActivities() {
  log('Entering into doPostTurnActivities');

  if (GAME_STATE.isGameOver()) {
    switch (GAME_STATE.GAME_RESULT) {
      case GAME_STATE.RESULTS.playerXWon:
        setTimeout(() => redirect('won'), 2500);
        break;
      case GAME_STATE.RESULTS.playerOWon:
      case GAME_STATE.RESULTS.tie:
        // No redirect for robot win or tie, just show message
        break;
    }
  } else {
    GAME_STATE.transitionTurn();
  }
}

/**
 * Starts a new game with the specified level.
 * @param {string} level - The difficulty level ('Easy', 'Medium', 'Hard').
 */
function startGame(level) {
  if (!level) {
    const levelSelector = document.getElementById('levelSelector');
    level = levelSelector && levelSelector.checked ? 'Hard' : 'Medium';
  }
  log(`Starting a new Game (level: ${level})`);
  GAME_STATE = new GameState(level);
  log(GAME_STATE);
  UI.drawBoard();
  activateBoard();
}

// Expose startGame globally for backward compatibility
window.startGame = startGame;

/**
 * Activates the game board by adding event listeners.
 */
function activateBoard() {
  log('Entered into activateBoard');

  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
      log('Adding listener for row[' + row + '] col[' + col + ']');
      document
        .getElementById('cell-' + row + col)
        .addEventListener('click', playerMove, false);
    }
  }

  const levelSelector = document.getElementById('levelSelector');
  if (levelSelector) {
    levelSelector.addEventListener(
      'change',
      event => {
        if (event.target.checked) {
          return startGame('Hard');
        }
        return startGame('Medium');
      },
      false
    );
  }
}

/**
 * Shows the back navigation link.
 */
const showBackNav = () => {
  const backNav = document.createElement('div');
  backNav.id = 'backNav';
  backNav.className = 'backNav';
  backNav.innerHTML = 'Go <a href="javascript:redirect(\'again\')">back</a> to the page.';
  document.body.appendChild(backNav);
};

/**
 * Checks if the game is being played again.
 * @returns {boolean} True if the game is being played again.
 */
const isPlayingAgain = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  if (status === 'again') {
    showBackNav();
    return true;
  }
  return false;
};

/**
 * Initializes the Tic-Tac-Toe game.
 */
function init() {
  log('Initializing Tic Tac Toe');
  startGame('Hard');
  isPlayingAgain();
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', init, false);
