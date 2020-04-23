"use strict";

// Comedy
//
// Chess, ha ha

class Comedy extends BaseChess {

  constructor() {
    super();
  }

  moveCompleted() {
    super.moveCompleted();
    if (Math.random() < 0.25) {
      let laugh = getRandomElement(laughs);
      laugh.currentTime = 0;
      laugh.play();
    }
  }

  quit() {}

}