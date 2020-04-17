"use strict";

// Dressage
//
// Compete in a high stakes dressage competition on the chess board

class Dressage extends BaseChess {

  constructor() {
    super();
  }

  setup() {
    super.setup();
    this.startSquares = {
      w: [`b1`, `g1`],
      b: [`b8`, `g8`]
    };
    this.score = {
      w: 0,
      b: 0
    }

    this.patternLength = 3;

    setTimeout(() => {
      this.startTurn();
    }, 1000);
  }

  startTurn() {
    this.displayScore();

    let turn = this.game.turn();
    this.reset(turn);

    this.currentPattern = this.generatePattern();
    this.currentStep = 0;

    this.disableInput();

    setTimeout(() => {
      this.showPattern(this.currentPattern);
    }, 2000);
  }

  generatePattern() {
    let turn = this.game.turn();
    let squares = this.startSquares[this.game.turn()];
    let start = squares[Math.floor(Math.random() * squares.length)];
    let pattern = this.getNextMoves(start, start, this.patternLength);
    this.reset(turn);
    return pattern;
  }

  reset(turn) {
    this.clearHighlights();
    this.game.reset();
    this.changeTurnTo(turn);
    this.board.position(this.game.fen(), true);
  }

  getNextMoves(start, from, depth) {
    if (depth === 0) return [];
    let moves = this.game.moves({
      square: from,
      verbose: true
    }).filter(a => !this.game.get(a.to) && a.to !== start);
    let move = moves[Math.floor(Math.random() * moves.length)];
    this.game.move(move);
    this.flipTurn();
    let result = [move, ...this.getNextMoves(start, move.to, depth - 1)];
    return result;
  }

  showPattern(pattern) {
    let i = 0;
    this.highlight(pattern[0].from);
    let interval = setInterval(() => {
      if (i === pattern.length) {
        clearInterval(interval);
        this.clearHighlights();
        this.enableInput();
        return;
      }
      this.clearHighlights();
      this.highlight(pattern[i].to);
      i++;
    }, 500);
  }

  squareClicked(event) {
    // Find out the notation of the square and also the element representing the piece
    let square = $(event.currentTarget).attr('data-square');
    let piece = this.game.get(square);

    if (square === this.currentPattern[0].from && piece.type === `n`) {
      // We are selecting the correct knight to begin
      this.from = square;
      this.highlight(this.from);
    }
    else if (this.from !== null && square === this.currentPattern[this.currentStep].to) {
      this.clearHighlights();
      // We chose the correct square to move the piece to!
      this.move(this.from, this.currentPattern[this.currentStep].to);
    }
    else {
      // Either chose the wrong square or piece or something! Fail!
      this.handleTurnEnd(false);
    }
  }

  move(from, to, silent) {
    // Make the move in the game representation
    let move = {
      from: from,
      to: to,
    };

    move = this.game.move(move);

    this.disableInput();

    // Update the board based on the new position
    this.board.position(this.game.fen(), true);

    setTimeout(() => {
      if (move && (move.flags.indexOf('c') !== -1 || move.flags.indexOf('e') !== -1)) {
        captureSFX.play();
      }
      else {
        placeSFX.play();
      }
      this.moveCompleted();
    }, this.config.moveSpeed * 1.1);

    return move;
  }

  moveCompleted() {
    // Revert the move to the current player (in case they need to keep going)
    this.flipTurn();
    // Assume they're moving the piece they just moved
    this.from = this.currentPattern[this.currentStep].to;
    // Go to the next step in the pattern
    this.currentStep++;
    // If they've hit the end of the pattern, very nice!
    if (this.currentStep === this.currentPattern.length) {
      this.handleTurnEnd(true);
    }
    else {
      // Input is allowed again
      this.enableInput();
    }
  }

  handleTurnEnd(correct) {
    console.log(`handleTurnEnd(${correct})`);
    // Whose turn is it?
    let turn = this.game.turn();

    // No more input!
    this.disableInput();

    // If they got it right, update their score
    if (correct) {
      this.score[turn]++;
    }
    this.displayScore();

    let scoreDifference = this.score.w - this.score.b;
    console.log(`Score difference: ${scoreDifference}`);
    if (scoreDifference >= 2) {
      // White wins
      this.showMessage("WHITE WINS!");
    }
    else if (scoreDifference <= -2) {
      // Black wins
      this.showMessage("BLACK WINS!");
    }
    else {
      // Switch to the next turn
      setTimeout(() => {
        this.hideMessage();
        setTimeout(() => {
          // Switch turns
          this.nextTurn();
        }, 1000);
      }, 2000);
    }
  }

  displayScore() {
    this.showVerboseMessage(`WHITE ${this.score.w} - ${this.score.b} BLACK`);
  }

  nextTurn() {
    console.log("nextTurn()");
    // Flip the turn (as it would be with the player who just failed or succeeded)
    this.flipTurn();
    // Indicate the turn visually
    this.changeTurn();
    // Generate the next pattern etc.
    this.startTurn();
  }

  quit() {

  }
}