/**
 * UI utilities for Tic-Tac-Toe game.
 */

import { log } from './logger.js';

// SVG templates for X and O
const svgX =
  '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128"><path d="M16,16L112,112" style="stroke: rgb(108, 90, 73); "></path><path d="M112,16L16,112" style="stroke: rgb(108, 90, 73); "></path></svg>';
const svgO =
  '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(155, 197, 157);"></path></svg>';
const svgXO =
  '<svg class="crosses" aria-label="X" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M16,16L112,112" style="stroke: rgb(108, 90, 73);"></path><path d="M112,16L16,112" style="stroke: rgb(108, 90, 73);"></path></svg>\n' +
  '<svg class="noughts" aria-label="O" role="img" viewBox="0 0 128 128" style="width: 96px; height: 96px;"><path d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16" style="stroke: rgb(155, 197, 157);"></path></svg>';

/**
 * UI utilities for the Tic-Tac-Toe game.
 */
export const UI = {
  /**
   * Draws the game board.
   */
  drawBoard() {
    log('Entering into drawBoard');

    const gameboardCode =
      '</div>\n' +
      '\t\t\t<table class="table text-center">\n' +
      '\t\t\t\t<tr class="c_row_1">\n' +
      '\t\t\t\t\t<td id="cell-11" class="c_col_1" role="button" tabindex="0" data-row="0" data-col="0"></td>\n' +
      '\t\t\t\t\t<td id="cell-12" class="c_col_2" role="button" tabindex="0" data-row="0" data-col="1"></td>\n' +
      '\t\t\t\t\t<td id="cell-13" class="c_col_3" role="button" tabindex="0" data-row="0" data-col="2"></td>\n' +
      '\t\t\t\t</tr>\n' +
      '\t\t\t\t<tr class="c_row_2">\n' +
      '\t\t\t\t\t<td id="cell-21" class="c_col_1" role="button" tabindex="0" data-row="1" data-col="0"></td>\n' +
      '\t\t\t\t\t<td id="cell-22" class="c_col_2" role="button" tabindex="0" data-row="1" data-col="1"></td>\n' +
      '\t\t\t\t\t<td id="cell-23" class="c_col_3" role="button" tabindex="0" data-row="1" data-col="2"></td>\n' +
      '\t\t\t\t</tr>\n' +
      '\t\t\t\t<tr class="c_row_3">\n' +
      '\t\t\t\t\t<td id="cell-31" class="c_col_1" role="button" tabindex="0" data-row="2" data-col="0"></td>\n' +
      '\t\t\t\t\t<td id="cell-32" class="c_col_2" role="button" tabindex="0" data-row="2" data-col="1"></td>\n' +
      '\t\t\t\t\t<td id="cell-33" class="c_col_3" role="button" tabindex="0" data-row="2" data-col="2"></td>\n' +
      '\t\t\t\t</tr>\n' +
      '\t\t\t</table>';

    document.getElementById('gameboard').innerHTML = gameboardCode;
    document.getElementById('messageboard').innerHTML =
      '<span><br>Play against me to view my page!</span>';
  },

  /**
   * Draws the SVG for a cell.
   * @param {HTMLElement|Object} cell - The cell element or object with an id.
   * @param {GameState} parGameState - The current game state.
   */
  drawSVG(cell, parGameState) {
    log('Entering into paintScreen');
    log(cell, parGameState);

    const cellId = typeof cell === 'object' && cell.id ? cell.id : cell.getAttribute('id');
    const cellElement = document.getElementById(cellId);
    
    if (!cellElement) {
      log('Cell element not found');
      return;
    }

    if (parGameState.TURN === parGameState.SYMBOL.human) {
      cellElement.innerHTML = svgX;
    } else if (parGameState.TURN === parGameState.SYMBOL.robot) {
      cellElement.innerHTML = svgO;
    }
  },

  /**
   * Animates the game-over cells.
   * @param {GameState} parGameState - The current game state.
   */
  animateGameOverCells(parGameState) {
    log('Entering into animateGameOverCells');

    if (parGameState.GAME_RESULT !== 'X' && parGameState.GAME_RESULT !== 'O')
      return;

    const color = parGameState.GAME_RESULT === 'X' ? 'won' : 'lost';

    if (parGameState.SLASH_INFO.row !== 0) {
      document
        .getElementsByClassName(`c_row_${parGameState.SLASH_INFO.row}`)[0]
        .classList.add(color);
    } else if (parGameState.SLASH_INFO.col !== 0) {
      [1, 2, 3].forEach(e =>
        document
          .getElementById(`cell-${e}${parGameState.SLASH_INFO.col}`)
          .classList.add(color)
      );
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
  },

  /**
   * Updates the screen based on the game state.
   * @param {GameState} parGameState - The current game state.
   */
  updateScreen(parGameState) {
    log('Entering into paintScreen');

    switch (parGameState.GAME_RESULT) {
      case parGameState.RESULTS.incomplete:
        {
          if (parGameState.TURN === parGameState.SYMBOL.robot) {
            document.getElementById('messageboard').innerHTML =
              "<br>It's my turn";
          } else if (parGameState.TURN === parGameState.SYMBOL.human) {
            document.getElementById('messageboard').innerHTML =
              "<br>It's your turn";
          }
        }
        break;

      case parGameState.RESULTS.playerXWon:
        {
          document.getElementById('messageboard').innerHTML =
            '<br> You have <b>won</b>!<br> You will be redirected';
          this.animateGameOverCells(parGameState);
        }
        break;

      case parGameState.RESULTS.playerOWon:
        {
          document.getElementById('messageboard').innerHTML =
            '<br> <b>Gameover</b>! <a href="javascript:startGame()">Play again</a> to view my page';
          this.animateGameOverCells(parGameState);
        }
        break;

      case parGameState.RESULTS.tie:
        {
          document.getElementById('messageboard').innerHTML =
            '<br> <b>Tie</b>! <a href="javascript:startGame()">Play again</a> to view my page';
          this.animateGameOverCells(parGameState);
        }
        break;

      default: {
        log('What the hell happened?');
        document.getElementById('messageboard').innerHTML =
          '<br>what the hell just happened? huh?';
      }
    }
  },
};
