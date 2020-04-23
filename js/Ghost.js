"use strict";

// Ghost
//
// Ghost chess is here to help.

const GHOST_DELAY_MIN = 5000;
const GHOST_DELAY_RANGE = 5000;
const GHOST_SPEED = 0.25;

class Ghost extends BaseChess {

  constructor() {
    super();

    this.cursor = $('<img>')
      .attr('src', 'assets/images/ghost-cursor.png')
      .addClass('ghost-cursor')
      .css({
        top: $(window).height() / 2,
        left: -100
      })
      .appendTo('body');

    this.ghostOn();

    setInterval(() => {
      // console.log(this.cursor.offset().left, this.cursor.offset().top);
    }, 100)
  }

  ghostOn() {
    if (this.inputEnabled) {
      setTimeout(() => {
        let moves = this.game.moves({
          verbose: true
        });
        let move = getRandomElement(moves);
        this.ghostMove(move.from, move.to);
      }, GHOST_DELAY_MIN + Math.random() * GHOST_DELAY_RANGE);
    }
    else {
      setTimeout(() => {
        this.ghostOn();
      }, 1000);
    }
  }

  ghostOff() {
    let startTop = this.cursor.offset().top;
    let startLeft = this.cursor.offset().left;
    let top = $(window).height() / 2;
    let left = -100;
    let dx = top - startTop;
    let dy = left - startLeft;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    this.cursor.animate({
      top: `${top}px`,
      left: `${left}px`
    }, distance / GHOST_SPEED, () => {
      this.ghostOn();
    });
  }

  ghostMove(from, to) {
    this.ghostClick(from, () => {
      this.cursor.animate({
        top: `+=0px`
      }, 2000, () => {
        this.ghostClick(to);
      });
    });
  }

  ghostClick(square, callback) {
    let $square = $(`.square-${square}`);
    let startTop = this.cursor.offset().top;
    let startLeft = this.cursor.offset().left;
    let top = $square.offset().top + $square.height() / 2;
    let left = $square.offset().left + $square.width() / 2;
    let dx = top - startTop;
    let dy = left - startLeft;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    let speed = 0.5;

    this.cursor.animate({
      top: `${top}px`,
      left: `${left}px`
    }, distance / GHOST_SPEED, () => {
      this.cursor.animate({
        top: `+=0px`
      }, 2000, () => {
        $square.trigger('click');
        this.ghostOn();
        if (callback) callback();
      });
    });
  }

  squareClicked(event) {
    super.squareClicked(event);
    this.cursor.stop(true);
    this.ghostOff();
  }

  quit() {}
}