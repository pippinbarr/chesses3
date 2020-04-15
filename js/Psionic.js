"use strict";

// PSIONIC
//
// Use your (latent?) psionic powers to make your moves

class Psionic extends BaseChess {

  constructor() {
    super();

    $(SQUARE).off('click');

    setTimeout(() => {
      let color = this.game.turn() === 'w' ? 'WHITE' : 'BLACK';
      let message = `${color}, USE YOUR PSIONIC ABILITIES TO MAKE YOUR MOVE.`;
      this.showVerboseMessage(message);
    }, 1500);
  }

  quit() {

  }
}