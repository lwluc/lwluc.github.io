// Wrapper for all UI activities and screen draws.
// This was required as we are invoking low of internal functions as part of minimax algo
// which in turn is impacting the results due to false positive screen rendering.
// Hence we will be calling this seperately to the functional logic.

const svg_x =
  '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" ><path d="M16,16L112,112" style="stroke: rgb(108, 90, 73); "></path><path d="M112,16L16,112" style="stroke: rgb(108, 90, 73); "></path></svg>';
const svg_o =
  '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" ><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(155, 197, 157);"></path></svg>';
const svg_xo =
  '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M16,16L112,112" style="stroke: rgb(108, 90, 73);"></path><path d="M112,16L16,112" style="stroke: rgb(108, 90, 73);"></path></svg>\
	<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(155, 197, 157);"></path></svg>';

const svg_horizontal =
  '<svg class="crosses" aria-label="H" role="img" viewBox="0 0 128 128" ><path d="M0,64L128,64" style="stroke: rgb(0, 0, 0); stroke-width: 2.5px; "></path></svg>';
const svg_vertical =
  '<svg class="crosses" aria-label="V" role="img" viewBox="0 0 128 128" ><path d="M64,0L64,128" style="stroke: rgb(0, 0, 0); stroke-width: 2.5px; "></path></svg>';
const svg_diag =
  '<svg class="crosses" aria-label="D1" role="img" viewBox="0 0 128 128" ><path d="M16,16L128,128" style="stroke: rgb(0, 0, 0); stroke-width: 4px;"></path></svg>';

const UI = {};

UI.drawBoard = () => {
  logger.log('Entering into drawBoard');

  const gameboard_code =
    '\
			<div id="strike_row" class="container">' +
    svg_horizontal +
    '</div>\
			<div id="strike_col" class="container">' +
    svg_vertical +
    '</div>\
			<div id="strike_diag" class="container">' +
    svg_diag +
    '</div>\
			<table class="table text-center">\
				<tr class="c_row_1">\
					<td id="cell-11" class="c_col_1" role="button" tabindex="0" data-row="0" data-col="0"></td>\
					<td id="cell-12" class="c_col_2" role="button" tabindex="0" data-row="0" data-col="1"></td>\
					<td id="cell-13" class="c_col_3" role="button" tabindex="0" data-row="0" data-col="2"></td>\
				</tr>\
				<tr class="c_row_2">\
					<td id="cell-21" class="c_col_1" role="button" tabindex="0" data-row="1" data-col="0"></td>\
					<td id="cell-22" class="c_col_2" role="button" tabindex="0" data-row="1" data-col="1"></td>\
					<td id="cell-23" class="c_col_3" role="button" tabindex="0" data-row="1" data-col="2"></td>\
				</tr>\
				<tr class="c_row_3">\
					<td id="cell-31" class="c_col_1" role="button" tabindex="0" data-row="2" data-col="0"></td>\
					<td id="cell-32" class="c_col_2" role="button" tabindex="0" data-row="2" data-col="1"></td>\
					<td id="cell-33" class="c_col_3" role="button" tabindex="0" data-row="2" data-col="2"></td>\
				</tr>\
			</table>';

  document.getElementById('gameboard').innerHTML = gameboard_code;
  document.getElementById('messageboard').innerHTML =
    '<span><br>Play against me to view my page!</span>';
};

UI.drawSVG = (cell, parGameState) => {
  logger.log('Entering into paintScreen');
  logger.log(cell, parGameState);

  if (parGameState.TURN === parGameState.SYMBOL.human) {
    document.getElementById(cell.id).innerHTML = svg_x;
  } else if (parGameState.TURN === parGameState.SYMBOL.robot) {
    document.getElementById(cell.id).innerHTML = svg_o;
  }
};

UI.animateGameOverCells = parGameState => {
  logger.log('Entering into animateGameOverCells');

  const pos = parGameState.WINNING_LINE;
  const timeout = 500;

  if (pos !== undefined) {
    if (parGameState.SLASH_INFO.match(/strike_row/g)) {
      setTimeout(() => {
        document
          .getElementById('strike_row')
          .classList.add(parGameState.SLASH_INFO);
        const div = document.getElementById('strike_row');
        div.style.display = 'block';
      }, timeout);
    } else if (parGameState.SLASH_INFO.match(/strike_col/g)) {
      setTimeout(() => {
        document
          .getElementById('strike_col')
          .classList.add(parGameState.SLASH_INFO);
        const div = document.getElementById('strike_col');
        div.style.display = 'block';
      }, timeout);
    } else if (parGameState.SLASH_INFO.match(/strike_diag/g)) {
      setTimeout(() => {
        document
          .getElementById('strike_diag')
          .classList.add(parGameState.SLASH_INFO);
        const div = document.getElementById('strike_diag');
        div.style.display = 'block';
      }, timeout);
    }
  }

  // this is too bad logic, n^3
  for (let row = 0; row < 3; row++) {
    logger.log('	row=' + row);
    for (let col = 0; col < 3; col++) {
      logger.log('		col=' + col);
      if (
        pos != undefined &&
        ((row === pos[0][0] && col === pos[0][1]) ||
          (row === pos[1][0] && col === pos[1][1]) ||
          (row === pos[2][0] && col === pos[2][1]))
      ) {
        logger.log('		pos=[' + row + '][' + col + ']');
        continue;
      }
      logger.log('		adding class for cell-' + (row + 1) + (col + 1));
      document
        .getElementById('cell-' + (row + 1) + (col + 1))
        .classList.add('lost-cells-gameover');
    }
  }
};

UI.updateScreen = parGameState => {
  logger.log('Entering into paintScreen');

  switch (parGameState.GAME_RESULT) {
    case parGameState.RESULTS.incomplete:
      {
        if (parGameState.TURN === parGameState.SYMBOL.robot) {
          // When current marker is 'X', then the next step will be by 'O', hence the below logic
          document.getElementById('messageboard').innerHTML = "<br>O's turn";
        } else if (parGameState.TURN === parGameState.SYMBOL.human) {
          document.getElementById('messageboard').innerHTML = "<br>X's turn";
        }
      }
      break;

    case parGameState.RESULTS.playerXWon:
      {
        document.getElementById('messageboard').innerHTML = '<br> Gameover';
        UI.animateGameOverCells(parGameState);
      }
      break;

    case parGameState.RESULTS.playerOWon:
      {
        document.getElementById('messageboard').innerHTML = '<br> Gameover';
        UI.animateGameOverCells(parGameState);
      }
      break;

    case parGameState.RESULTS.tie:
      {
        document.getElementById('messageboard').innerHTML = '<br> Gameover';
        UI.animateGameOverCells(parGameState);
      }
      break;

    default: {
      logger.log('What the hell happened?');
      document.getElementById('messageboard').innerHTML =
        '<br>what the hell just happened? huh?';
    }
  }
};
