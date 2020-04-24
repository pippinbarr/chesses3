"use strict";

// Ghost
//
// Ghost chess is here to help.

const GHOST_DELAY_MIN = 5000;
const GHOST_DELAY_RANGE = 5000;
const GHOST_SPEED = 0.25;
const LOW_VOLUME = 0.025;
const HIGH_VOLUME = 1.0;
const ghostMusic = new Howl({
  src: ['assets/sounds/unchained-melody.mp3', 'assets/sounds/unchained-melody.ogg']
});

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

    ghostMusic.volume(0);
    ghostMusic.play();
    ghostMusic.fade(0, LOW_VOLUME, 10000);

    this.ghostOn();

    setInterval(() => {
      // console.log(this.cursor.offset().left, this.cursor.offset().top);
    }, 100)
  }

  ghostOn() {
    if (this.inputEnabled) {
      this.ghostTimer(() => {
        let moves = this.game.moves({
          verbose: true
        });
        let move = getRandomElement(moves);
        this.makeGhostMove(move.from, move.to);
      }, 1000);
    }
    else {
      this.ghostTimer(() => {
        this.ghostOn();
      }, 1000);
    }
  }

  ghostTimer(callback, time) {
    this.cursor.animate({
      top: `+=0px`
    }, time, () => {
      callback();
    });
  }

  makeGhostMove(from, to) {
    console.log(`makeGhostMove(${from},${to})`);
    this.ghostClick(from, () => {
      this.ghostTimer(() => {
        this.ghostClick(to, () => {
          this.ghostOff();
        });
      }, 1000);
    })
    ''
  }

  ghostClick(square, callback) {
    console.log(`ghostClick(${square})`);
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
      this.ghostTimer(() => {
        $square.trigger('click', [true]);
        if (callback) callback();
      }, 2000);
    });
  }

  squareClicked(event, ghost) {
    super.squareClicked(event);
    console.log(ghost);
    if (!ghost) {
      this.ghostOff();
    }
  }

  ghostOff() {
    console.log("ghostOff()");
    let startTop = this.cursor.offset().top;
    let startLeft = this.cursor.offset().left;
    let top = $(window).height() / 2;
    let left = -100;
    let dx = top - startTop;
    let dy = left - startLeft;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    this.cursor.stop(true);
    this.cursor.animate({
      top: `${top}px`,
      left: `${left}px`
    }, distance / GHOST_SPEED, () => {
      this.ghostOn();
    });
  }

  quit() {}
}