// This holds all the state variables of the current board game. an instance of this and you will get everything
const cGameState = function (level) {
	// Without the use of 'this', these will be not accessible from outside world.
	// adding 'this' makes them public variables, else they will be considered as private variables.

	this.SYMBOL = {
	  human:'X',
	  robot:'O'
	};

	this.RESULTS = {
	  incomplete: 0,
	  playerXWon: this.SYMBOL.human,
	  playerOWon: this.SYMBOL.robot,
	  tie: 3
	};

	this.BOARD = [
		['', '', ''],
		['', '', ''],
		['', '', '']
	];

	this.TOTAL_MOVES = 0;
	this.O_MOVES_COUNT = 0; // Because this is used for scoring
	this.WINNING_LINE;
	this.DIFFICULTY_LEVEL = level;
	this.GAME_RESULT = this.RESULTS.incomplete;
	this.SLASH_INFO; // this tells if the win is in a row/col/diag and which one. just to save performance

	// Because 'X' always gets to start the game so initialize it with it.
	this.TURN = this.SYMBOL.human;

	this.clone = () => {
		logger.log('Entering into clone');
		const cloneGameState = new cGameState();

		cloneGameState.TOTAL_MOVES = this.TOTAL_MOVES;
		cloneGameState.O_MOVES_COUNT = this.O_MOVES_COUNT;
		cloneGameState.WINNING_LINE = this.WINNING_LINE;  // this is an array too, so will it be a problem?
		cloneGameState.DIFFICULTY_LEVEL = this.DIFFICULTY_LEVEL;
		cloneGameState.GAME_RESULT = this.GAME_RESULT;
		cloneGameState.TURN = this.TURN;

		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				cloneGameState.BOARD[row][col] = this.BOARD[row][col];
			}
		}

		logger.log('Original object ', this);
		logger.log('Clone    object ', cloneGameState);

		return cloneGameState;
	}

	this.emptyCells = () => {
		logger.log('Entering into emptyCells');
		const available_list = [];
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				if( this.BOARD[row][col] === '' ) {
					available_list.push([row, col]);
				}
			}
		}
		logger.log(available_list);
		return available_list;
	};


	this.isCellMarked = (row, col) => {
		const status = this.BOARD[row][col] !== '';
		logger.log('isCellMarked[' + status + ']');
		return status;
	}

	this.markCell = (row, col) => {
		if(this.isCellMarked(row, col)) {
			logger.log('Cell is already marked');
			return false;
		}

		this.BOARD[row][col] = this.TURN ;

		// BOARD[cell.getAttribute('data-row')][cell.getAttribute('data-col')] = marker;
		this.TOTAL_MOVES++;

		if(this.TURN === this.SYMBOL.robot)
			this.O_MOVES_COUNT++ ; // This is used for score calculation

		logger.log(this);

		return true;
	}

	this.transitionTurn = () => {
		logger.log('Entering into transitionTurn');
		this.TURN = this.TURN === this.SYMBOL.human ? this.SYMBOL.robot : this.SYMBOL.human;
	}

	this.score = () => {
		logger.log('Entering into score');
		let score = 0;

	    if(this.GAME_RESULT === this.RESULTS.playerXWon){
	        // the x player won
	        score = 10 - this.O_MOVES_COUNT;
	    }
	    else if(this.GAME_RESULT === this.RESULTS.playerOWon) {
	        // the x player lost
	        score = -10 + this.O_MOVES_COUNT;
	    }
	    else {
	        // it's a draw
	        score = 0;
	    }

	    logger.log('Score = [' + score + ']');
	    return score;
	}

	this.isGameOver = () => {
		logger.log('Entered into isGameOver : ' + this.TOTAL_MOVES);
		
		let line;
		let pos;
		let game_status = false;

		// As we are calling this function multiple times, its better to optimize the calls 
		if( this.GAME_RESULT !== this.RESULTS.incomplete ) {
			logger.log('Well, a result is already reached, lets save cpu cycles and do nothing');
			return true;
		}

		// make sure there is no <= there, elese the gameover is not coming after 5 moves. yuck!
		if(this.TOTAL_MOVES < 5) {
			logger.log('Too few moves, game cannot be over yet');
			this.GAME_STATUS = this.RESULTS.incomplete ; 
			return false;
		}

		do {
			// check for row success
			for(let itr = 0; itr < 3; ++itr) {
				line = this.BOARD[itr].join('');

				if(line === this.TURN.repeat(3)) {
					pos = [ [itr, 0], [itr, 1], [itr, 2] ];
					game_status = true;
					this.SLASH_INFO = 'strike_row_' + (itr+1);
					break;
				}
			}

			// check for col success
			for (let itr = 0; itr < 3; ++itr) {
				line = [this.BOARD[0][itr], this.BOARD[1][itr], this.BOARD[2][itr]];
				line = line.join('');

				if(line === this.TURN.repeat(3)) {
					pos = [ [0, itr], [1, itr], [2, itr] ];
					game_status = true;
					this.SLASH_INFO = 'strike_col_' + (itr+1);
					break;
				}	
			}

			// now check for diagonal success

			line = [this.BOARD[0][0], this.BOARD[1][1], this.BOARD[2][2]];
			line = line.join('');

			if(line === this.TURN.repeat(3)) {
				pos = [ [0, 0], [1, 1], [2, 2] ];
				game_status = true;
				this.SLASH_INFO = 'strike_diag_1';
				break;
			}

			// now the other diagoal check

			line = [this.BOARD[0][2], this.BOARD[1][1], this.BOARD[2][0]];
			line = line.join('');

			if(line === this.TURN.repeat(3)) {
				pos = [ [0, 2], [1, 1], [2, 0] ];
				game_status = true;
				this.SLASH_INFO = 'strike_diag_2';
				break;
			}

		} while(0);

		if(game_status) {
			logger.log('WINNER OF THE GAME IS ' + this.TURN);

			this.WINNING_LINE = pos;

			if(this.TURN === this.SYMBOL.human ) {
				this.GAME_RESULT = this.RESULTS.playerXWon ;
			} else {
				this.GAME_RESULT = this.RESULTS.playerOWon ;
			}

		} else if(this.TOTAL_MOVES >= 9) {
			logger.log('All the steps are exhausted, its a TIE');
			this.GAME_RESULT = this.RESULTS.tie;
			game_status = true;
		}

		return game_status;
	}


	this.getFinishMoves = (player) => {
		logger.log('Entered into getFinishMoves : ' + player + ' -> ' + this.TOTAL_MOVES);
		
		const finish_moves = [];

		// game over could be 5 moves, but not here. In below case, number of steps are 3, but if o do not 
		// make the right move at 4, then the game will be over in 5.
		// 		. . .	x o .
		// 		. . .	x . .
		// 		. . .	. . .

		if(this.TOTAL_MOVES < 3) {
			logger.log('Too few moves, there are no finish moves yet');
			this.GAME_STATUS = this.RESULTS.incomplete ; 
			return false;
		}

		do {
			// check for row success
			for(let row = 0; row < 3; ++row) {
				line = this.BOARD[row].join('');

				if(line === player.repeat(2)) {
					for(let col = 0; col < 3; ++col) {
						if(this.BOARD[row][col] === '' ) {
							finish_moves.push([row, col]);
							break;
						}
					}
					break;
				}
			}

			// we got a winning position, so lets get out
			if(finish_moves.length > 0) {
				break;
			}

			// check for col success
			for (let col = 0; col < 3; ++col) {
				line = [this.BOARD[0][col], this.BOARD[1][col], this.BOARD[2][col]];
				line = line.join('');

				if(line === player.repeat(2)) {
					for(let row = 0; row < 3; ++row) {
						if(this.BOARD[row][col] === '' ) {
							finish_moves.push([row, col]);
							break;
						}
					}
					break;
				}	
			}

			// we got a winning position, so lets get out
			if(finish_moves.length > 0) {
				break;
			}

			// now check for diagonal success

			line = [this.BOARD[0][0], this.BOARD[1][1], this.BOARD[2][2]];
			line = line.join('');

			if(line === player.repeat(2)) {

				if(this.BOARD[0][0] === '' )
					finish_moves.push([0, 0]);
				else if(this.BOARD[1][1] === '' )
					finish_moves.push([1, 1]);
				else if(this.BOARD[2][2] === '' )
					finish_moves.push([2, 2]);

				break;
			}

			// now the other diagoal check

			line = [this.BOARD[0][2], this.BOARD[1][1], this.BOARD[2][0]];
			line = line.join('');

			if(line === player.repeat(2)) {

				if(this.BOARD[0][2] === '' )
					finish_moves.push([0, 2]);
				else if(this.BOARD[1][1] === '' )
					finish_moves.push([1, 1]);
				else if(this.BOARD[2][0] === '' )
					finish_moves.push([2, 0]);

				break;
			}

		} while(0);

		logger.log(finish_moves);
		logger.log(finish_moves[0]);

		if(finish_moves.length > 0)
			return finish_moves[0];
	}
};