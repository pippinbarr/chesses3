"use strict";

// Cage
//
// John Cage's 4'33" as a game of chess ha ha

class Cage extends BaseChess {

  constructor() {
    super();
    let minutes = 4;
    let seconds = 33;
    this.disableInput();
    this.interval = setInterval(() => {
      seconds--;
      if (seconds === 0 && minutes === 0) {
        clearInterval(this.interval);
        setTimeout(titleClicked, 1000);
      }
      else if (seconds < 0) {
        minutes--;
        seconds = 59;
      }
      $(`#cage-title`).text(`${minutes}'${seconds < 10 ? '0' : ''}${seconds}"`);
    }, 1000);
  }

  quit() {
    console.log("Quitting.");
    $('#cage-title').text(`4'33"`);
    clearInterval(this.interval);
  }
}