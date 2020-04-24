"use strict";

// Pacifist
//
// No captures.

class Pacifist extends BaseChess {

  constructor() {
    super();
  }

  getMoves(square) {
    let options = {
      verbose: true,
      legal: false,
    }
    if (square !== undefined) options.square = square;
    let moves = this.game.moves(options);
    return moves.filter(a => !a.flags.match(/c|e/));
  }

  moveCompleted() {
    this.from = null;
    this.changeTurn();
    this.enableInput();
    this.hideMessage();
  }


  quit() {

  }
}