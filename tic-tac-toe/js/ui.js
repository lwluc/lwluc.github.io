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

const UI = {};

UI.drawBoard = () => {
  logger.log('Entering into drawBoard');

  const gameboard_code =
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

  if (parGameState.GAME_RESULT !== 'X' && parGameState.GAME_RESULT !== 'O') return; 

  const color = parGameState.GAME_RESULT  === 'X' ? 'won' : 'lost';

  if (parGameState.SLASH_INFO.row !== 0) {
    document.getElementsByClassName(`c_row_${parGameState.SLASH_INFO.row}`)[0].classList.add(color);
  } else if (parGameState.SLASH_INFO.col !== 0) {
    [1, 2, 3].forEach(e => document.getElementById(`cell-${e}${parGameState.SLASH_INFO.col}`).classList.add(color)); 
  } else if (parGameState.SLASH_INFO.diag !== 0) {
    if (parGameState.SLASH_INFO.diag === 1) {
      document.getElementById('cell-11').classList.add(color);
      document.getElementById('cell-22').classList.add(color);
      document.getElementById('cell-33').classList.add(color);
    } else {
      document.getElementById('cell-13').classList.add(color);
      document.getElementById('cell-22').classList.add(color);
      document.getElementById('cell-31').classList.add(color);
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
          document.getElementById('messageboard').innerHTML = "<br>It's my turn";
        } else if (parGameState.TURN === parGameState.SYMBOL.human) {
          document.getElementById('messageboard').innerHTML = "<br>It's your turn";
        }
      }
      break;

    case parGameState.RESULTS.playerXWon:
      {
        document.getElementById('messageboard').innerHTML = '<br> You have <b>won</b>!<br> You will be redirected';
        UI.animateGameOverCells(parGameState);
      }
      break;

    case parGameState.RESULTS.playerOWon:
      {
        document.getElementById('messageboard').innerHTML = '<br> <b>Gameover</b>! <a href="javascript:starteGame()">Play again</a> to view my page';
        UI.animateGameOverCells(parGameState);
      }
      break;

    case parGameState.RESULTS.tie:
      {
        document.getElementById('messageboard').innerHTML = '<br> <b>Tie</b>! <a href="javascript:starteGame()">Play again</a> to view my page';
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
