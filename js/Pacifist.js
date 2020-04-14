"use strict";

// Pacifist
//
// No captures.

class Pacifist extends BaseChess {

  constructor() {
    super();
  }

  getMoves(square) {
    return super.getMoves(square).filter(a => !a.flags.match(/c|e/));
  }

  quit() {

  }
}