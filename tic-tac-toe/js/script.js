let GAME_STATE;
logger.disableLogging();

function printInfo() {
  const text = [
    'Hello,\n',
    'looks like you are clever enough to open the console.',
    'Maybe with the intuition to bypass the game.',
    'You are the lucky one: Enter "skipGame()" into the console and you will skip the game and be redirected to the page\n',
    '🤙',
  ].join('\n');
  console.log(text);
}

printInfo();

function redirect(code) {
  const url = location.protocol + '//' + location.host + location.pathname;
  const redirectToPage = url.replace(
    'tic-tac-toe.html',
    `index.html?code=${code}`
  );
  window.location.replace(redirectToPage);
}

function skipGame() {
  redirect('hacker');
}

function computerMove() {
  logger.log('Entering into computerMove');
  makeEaseMove();
  isGameOver();
}

function robotMove() {
  logger.log('Entering into robotMove');

  logger.log(GAME_STATE.turn !== GAME_STATE.SYMBOL.robot);

  if (GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.robot) {
    logger.log('It seems the game is over, or its not your turn');
    return false;
  }

  const objAI = new AI();
  const cell_to_play = objAI.getBestRobotMove(GAME_STATE);

  if (GAME_STATE.isCellMarked(cell_to_play[0], cell_to_play[1])) {
    logger.log('As the cell is already marked, do not do anything');
    return true;
  }

  GAME_STATE.markCell(cell_to_play[0], cell_to_play[1]);

  const cell = {};
  // because cell_to_play contains array values of 0...to length-1 and
  // for cell-id we have the values from 1 to length
  cell.id = 'cell-' + (cell_to_play[0] + 1) + (cell_to_play[1] + 1);
  // first draw the X/O as per the turn
  UI.drawSVG(cell, GAME_STATE);
  // then check if the game is over
  doPostTurnActivities();
  // when you feel everything is over, then update the screen
  UI.updateScreen(GAME_STATE);
}

function playerMove() {
  logger.log('Entering into playerMove');

  if (GAME_STATE.isGameOver() || GAME_STATE.TURN !== GAME_STATE.SYMBOL.human) {
    logger.log('It seems the game is over, or its not your turn');
    return false;
  }

  if (
    GAME_STATE.isCellMarked(
      this.getAttribute('data-row'),
      this.getAttribute('data-col')
    )
  ) {
    logger.log('As the cell is already marked, do not do anything');
    return true;
  }

  GAME_STATE.markCell(
    this.getAttribute('data-row'),
    this.getAttribute('data-col')
  );

  // first draw the X/O as per the turn
  UI.drawSVG(this, GAME_STATE);

  // then check if the game is over and if really is over, update scores or else change the player turn
  doPostTurnActivities();

  // when you feel everything is over, then update the screen
  UI.updateScreen(GAME_STATE);

  // now, let me make my move. as this is a robot, we need to invoke it after human has played his move
  setTimeout(() => robotMove(), 500);
}

function doPostTurnActivities() {
  logger.log('Entering into doPostTurnActivities');

  if (GAME_STATE.isGameOver()) {
    switch (GAME_STATE.GAME_RESULT) {
      case GAME_STATE.RESULTS.playerXWon:
        setTimeout(() => redirect('won'), 2500);
        break;
    }
  } else {
    // if not, then retransition to the next step/view
    GAME_STATE.transitionTurn();
  }
}

function starteGame(level) {
  if (!level) {
    level = document.getElementById('levelSelector').checked
      ? 'Medium'
      : 'Hard';
  }
  logger.log(`Starting a new Game (level: ${level})`);
  GAME_STATE = new cGameState(level);
  logger.log(GAME_STATE);
  UI.drawBoard();
  activateBoard();
}

function activateBoard() {
  logger.log('Entered into activateBoard');

  for (let row = 1; row <= 3; row++) {
    for (let col = 1; col <= 3; col++) {
      logger.log('Adding listener for row[' + row + '] col[' + col + ']');
      document
        .getElementById('cell-' + row + col)
        .addEventListener('click', playerMove, false);
    }
  }

  document.getElementById('levelSelector').addEventListener(
    'change',
    event => {
      if (event.target.checked) {
        starteGame('Hard');
      }
      starteGame('Medium');
    },
    false
  );
}

const showBackNav = () => {
  const backNav = document.createElement('div');
  backNav.id = 'backNav';
  backNav.className = 'backNav';
  backNav.innerHTML =
    'Go <a href="javascript:redirect(\'again\')">back</a> to the page.';
  document.body.appendChild(backNav);
};

const isPlayingAgain = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  if (status === 'again') {
    showBackNav();
    return true;
  }
  return false;
};

function init() {
  logger.log('Initializing Tic Tac Toe');
  starteGame('Hard');
  isPlayingAgain();
}

window.addEventListener('DOMContentLoaded', init, false);
