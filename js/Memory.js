"use strict";

// Memory
//
// Memory chess! With UI! Or something. Not an original concept obviously.

class Memory extends BaseChess {

  constructor() {
    super();

    $(SQUARE).each(function() {
      let classes = $(this).attr("class");
      let $clone = $(`<div class="${classes}"></div>`);
      $clone.addClass('flipper');
      $(this).append($clone);
    });

    setTimeout(() => {
      this.flipAll();
    }, 1000);

    this.disableInput();
  }

  flip(square, callback) {
    if (!square) {
      if (callback) callback();
      return;
    }

    let speed = 3;
    let el = $(`.square-${square}`);
    let rotation = 0;
    let startRotation = 0;
    let interval = setInterval(() => {
      rotation += speed;
      el.css({
        transform: `rotateY(${rotation}deg)`
      });
      if (rotation === 90) {
        el.children('.flipper').toggle();
        speed = -speed;
      }
      else if (rotation === 0) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 10);
  }

  flipAll() {
    let context = this;
    for (let f = 0; f < FILES.length; f++) {
      for (let r = 0; r < 8; r++) {
        setTimeout(() => {
          this.flip(`${FILES[f]}${RANKS[r]}`);
          if (r === RANKS.length - 1 && f === FILES.length - 1) {
            // Input enabled
            this.changeTurn();
          }
        }, 100 * (f + r));
      }
    }
  }

  squareClicked(event) {
    this.disableInput();

    // Find out the notation of the square and also the element representing the piece
    let square = $(event.currentTarget).attr('data-square');

    this.flip(square, () => {
      this.handleClick(event);
    });
  }

  handleClick(event) {
    // Find out the notation of the square and also the element representing the piece
    let square = $(event.currentTarget).attr('data-square');
    let piece = $(event.currentTarget).find(PIECE);
    let validPiece = (piece.length !== 0 && piece.attr('data-piece').indexOf(this.game.turn()) !== -1);

    if (this.from === null && validPiece) {
      console.log("Valid piece.");
      // We haven't selected a move yet + a piece of the correct colour was selected
      this.from = square;
      let moves = this.getMoves(square);
      console.log(moves);
      if (moves.length === 0) {
        $(`.square-${square} ${PIECE}`).effect('shake', {
          times: 5,
          distance: 2
        }, 50, () => {
          setTimeout(() => {
            this.flip(this.from, () => {
              if (this.game.in_check()) {
                // CHECKMATE
                this.flipAll();
                this.showResult(true, this.getTurn(false));
              }
              else {
                this.flipTurn();
                this.changeTurn();
                this.enableInput();
                this.hideMessage();
              }
            });
          }, 1000);
        });
        return;
      }
      this.highlightMoves(moves);
      this.enableInput();
    }
    else if (this.from !== null) {
      console.log("Selected destination.");
      this.to = $(event.currentTarget).attr('data-square');
      // We have already selected a square to move from (and thus a piece)
      if ($(event.currentTarget).hasClass('invisible-highlighter')) {
        // console.log(this.from, to)
        this.move(this.from, this.to);
      }
      else {
        $(`.square-${this.from} ${PIECE}`).effect('shake', {
          times: 5,
          distance: 2
        }, 50, () => {
          setTimeout(() => {
            this.flip(this.to);
            this.flip(this.from, () => {
              this.flipTurn();
              this.changeTurn();
              this.enableInput();
              this.hideMessage();
            });
          }, 1000);
        });
      }
    }
    else {
      this.from = square;
      console.log("Selected an invalid square");
      setTimeout(() => {
        this.flip(this.to);
        this.flip(this.from, () => {
          this.flipTurn();
          this.changeTurn();
          this.enableInput();
          this.hideMessage();
        });
      }, 1000);
    }
  }

  move(from, to) {
    console.log(`move(${from},${to})`);
    super.move(from, to);
  }

  moveCompleted() {
    this.flip(this.from, () => {
      this.flip(this.to, () => {
        this.moveCompletedPartTwo();
      });
    });
  }

  moveCompletedPartTwo() {
    this.from = null;
    this.to = null;
    let moves = this.getMoves();
    if (moves.length === 0) {
      this.flipAll();
      if (this.game.in_check()) {
        // CHECKMATE
        this.showResult(true, this.getTurn(false));
      }
      else {
        // STALEMATE
        this.showResult(false);
      }
    }
    else {
      if (this.gameOver) return;

      this.changeTurn();
      this.enableInput();
      this.hideMessage();
    }
  }


  clearHighlights() {
    $(SQUARE).removeClass(`invisible-highlighter`);
  }

  clearHighlight(element) {
    $(element).removeClass(`invisible-highlighter`);
  }

  // Highlight the specified square
  highlight(square) {
    $('.square-' + square).addClass(`invisible-highlighter`);
  }

  quit() {

  }
}