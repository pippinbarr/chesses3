"use strict";

// Comedy
//
// Chess, ha ha

class Comedy extends BaseChess {

  constructor() {
    super();
  }

  squareClicked(event) {
    super.squareClicked(event);
    this.laugh();
  }

  moveCompleted() {
    super.moveCompleted();
    this.laugh();
  }

  laugh() {
    if (Math.random() < 0.15) {
      let laugh = getRandomElement(laughs);
      laugh.currentTime = 0;
      laugh.play();
    }
  }

  quit() {}

}