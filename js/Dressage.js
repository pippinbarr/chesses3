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
    this.disableInput();

    this.data = {
      turn: 'w',
      w: {
        score: 0,
        startSquares: [`b1`, `g1`],
        currentLength: 1,
        currentStep: 0
      },
      b: {
        score: 0,
        startSquares: [`b8`, `g8`],
        currentLength: 1,
        currentStep: 0
      }
    }
    this.PATTERN_LENGTH = 16;

    this.data.w.pattern = this.generatePattern('w', this.PATTERN_LENGTH);
    this.data.b.pattern = this.generatePattern('b', this.PATTERN_LENGTH);

    this.tone = new Pizzicato.Sound({
      source: 'wave',
      options: {
        frequency: 440
      }
    });
    this.tone.baseFrequency = 300;
    this.tone.stepFrequency = 20;

    this.failTone = new Pizzicato.Sound({
      source: 'wave',
      options: {
        type: 'square',
        frequency: 123,
        volume: 0.2,
      }
    });

    setTimeout(() => {
      this.startTurn('w');
    }, 1000);
  }

  startTurn(color) {
    this.displayScore();

    this.from = null;
    this.data.turn = color
    this.data[color].currentStep = 0;
    this.reset(this.data.turn);

    this.showPatternTimeout = setTimeout(() => {
      this.showPattern(this.data.turn, this.data[this.data.turn].pattern);
    }, 2000);
  }

  generatePattern(color, length) {
    this.reset(color);
    let start = getRandomElement(this.data[color].startSquares);
    let pattern = this.getNextMoves(color, start, start, length);
    return pattern;
  }

  reset(turn) {
    this.clearHighlights();
    this.game.reset();
    this.changeTurnTo(turn);
    this.board.position(this.game.fen(), true);
  }

  getNextMoves(color, start, from, depth) {
    if (depth === 0) return [];
    this.changeTurnTo(color);
    let moves = this.game.moves({
      square: from,
      verbose: true
    }).filter(a => !this.game.get(a.to) && a.to !== start);
    let move = getRandomElement(moves);
    this.game.move(move);
    let result = [move, ...this.getNextMoves(color, start, move.to, depth - 1)];
    return result;
  }

  showPattern(color, pattern) {
    let i = 0;
    this.highlight(pattern[0].from);
    this.playStep(0);
    this.showPatternInterval = setInterval(() => {
      if (i === this.data[color].currentLength) {
        clearInterval(this.showPatternInterval);
        this.clearHighlights();
        this.enableInput();
        return;
      }
      this.clearHighlights();
      this.highlight(pattern[i].to);
      this.playStep(i + 1);
      i++;
    }, 750);
  }

  squareClicked(event) {
    // Find out the notation of the square and also the element representing the piece
    let square = $(event.currentTarget).attr('data-square');
    let piece = this.game.get(square);
    let step = this.data[this.data.turn].currentStep;
    let pattern = this.data[this.data.turn].pattern;
    let nextMove = pattern[step];

    if (square === nextMove.from) {
      // We are selecting the correct knight to begin
      this.from = square;
      this.highlight(this.from);
      this.playStep(0);
    }
    else if (this.from !== null && square === nextMove.to) {
      this.clearHighlights();
      // We chose the correct square to move the piece to!
      this.move(this.from, nextMove.to);
    }
    else {
      // Either chose the wrong square or piece or something! Fail!
      $(`.square-${nextMove.from} img`).effect('shake', {
        distance: 2,
        times: 5,
        duration: 400,
        direction: 'left'
      });
      this.playFail();
      this.highlight(nextMove.to);
      this.highlight(nextMove.from);
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

    this.moveTimeout = setTimeout(() => {
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
    let turn = this.data.turn;
    let pattern = this.data[turn].pattern;
    let step = this.data[turn].currentStep;

    this.playStep(this.data[turn].currentStep + 1);

    this.from = pattern[step].to;
    // Go to the next step in the pattern
    this.data[turn].currentStep++;
    // If they've hit the end of the pattern, very nice!
    if (this.data[turn].currentStep === this.data[turn].currentLength) {
      this.handleTurnEnd(true);
    }
    else {
      // Input is allowed again
      this.enableInput();
    }
  }

  playStep(step) {
    // Play our tone
    let frequency = this.tone.baseFrequency + this.tone.stepFrequency * step;
    this.playTone(frequency);
  }

  playFail() {
    this.failTone.play();
    this.failToneTimeout = setTimeout(() => {
      this.failTone.stop();
    }, 500);
  }

  playTone(frequency, type) {
    this.tone.frequency = frequency;
    this.tone.play();
    this.toneTimeout = setTimeout(() => {
      this.tone.stop();
    }, 500);
  }

  handleTurnEnd(correct) {
    console.log(`handleTurnEnd(${correct})`);
    let resultWord = correct ? 'CORRECT!' : 'INCORRECT!';

    // Whose turn is it?
    let turn = this.game.turn();

    // No more input!
    this.disableInput();

    // If they got it right, update their score and pattern length
    if (correct) {
      this.data[turn].score++;
      this.data[turn].currentLength++; // CHECK for reaching the limit???
    }
    this.displayScore();

    // Check for a winner
    let scoreDifference = this.data.w.score - this.data.b.score;
    if ((turn === 'b' && this.data.w.score === this.PATTERN_LENGTH && !correct) || scoreDifference >= 2) {
      // White wins
      this.showMessage("WHITE WINS!");
    }
    else if ((turn === 'w' && this.data.b.score === this.PATTERN_LENGTH && !correct) || scoreDifference <= -2) {
      // Black wins
      this.showMessage("BLACK WINS!");
    }
    else if (this.data.w.score === this.data.b.score && this.data.w.score === this.PATTERN_LENGTH) {
      // Black wins
      this.showMessage("DRAW!");
    }
    else {
      // Nobody has won yet
      // Switch to the next turn
      this.showMessage(resultWord);
      this.showMessageTimeout = setTimeout(() => {
        this.hideMessage();
        this.hideMessageTimeout = setTimeout(() => {
          // Switch turns
          this.nextTurn();
        }, 1000);
      }, 2000);
    }
  }

  displayScore() {
    this.showVerboseMessage(`WHITE ${this.data.w.score} - ${this.data.b.score} BLACK`);
  }

  nextTurn() {
    // Flip the turn (as it would be with the player who just failed or succeeded)
    this.flipTurn();
    this.data.turn = this.game.turn();
    // console.log(`Next turn is: ${this.data.turn}`);
    // Indicate the turn visually
    this.changeTurn();
    this.disableInput();
    // Generate the next pattern etc.
    this.startTurn(this.data.turn);
  }

  quit() {
    this.tone.stop();
    this.failTone.stop();
    if (this.moveTimeout) clearTimeout(this.moveTimeout);
    if (this.toneTimeout) clearTimeout(this.toneTimeout);
    if (this.failToneTimeout) clearTimeout(this.failToneTimeout);
    if (this.hideMessageTimeout) clearTimeout(this.hideMessageTimeout);
    if (this.showMessageTimeout) clearTimeout(this.showMessageTimeout);
    if (this.showPatternTimeout) clearTimeout(this.showPatternTimeout);
    if (this.showPatternInterval) clearInterval(this.showPatternInterval);
  }
}