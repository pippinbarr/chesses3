"use strict";

// Ghost
//
// Ghost chess is here to help.

const GHOST_DELAY_MIN = 5000;
const GHOST_DELAY_RANGE = 5000;
const GHOST_SPEED = 0.1;
const LOW_VOLUME = 0.025;
const HIGH_VOLUME = 0.3;
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
    ghostMusic.fade(0, LOW_VOLUME, 5000);

    this.ghostOn();

    setInterval(() => {
      // console.log(this.cursor.offset().left, this.cursor.offset().top);
    }, 100)
  }

  ghostOn() {
    if (this.gameOver) {
      return;
    }
    if (this.inputEnabled) {
      this.ghostTimer(() => {
        let moves = this.game.moves({
          verbose: true
        });
        let move = getRandomElement(moves);
        ghostMusic.fade(ghostMusic.volume(), HIGH_VOLUME, 3000);
        this.makeGhostMove(move.from, move.to);
      }, GHOST_DELAY_MIN + Math.random() * GHOST_DELAY_RANGE);
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
    this.ghostClick(from, () => {
      this.ghostTimer(() => {
        this.ghostClick(to, () => {
          this.ghostOff();
        });
      }, 1000 + Math.random() * 1000);
    })
    ''
  }

  ghostClick(square, callback) {
    let $square = $(`.square-${square}`);
    let top = $square.offset().top + $square.height() / 2;
    let left = $square.offset().left + $square.width() / 2;

    this.ghostMoveTo(left, top, () => {
      this.ghostTimer(() => {
        $square.trigger('click', [true]);
        if (callback) callback();
      }, 1000 + Math.random() * 2000);
    });
  }

  squareClicked(event, ghost) {
    super.squareClicked(event);
    if (!ghost) {
      this.ghostOff();
    };
  }

  ghostOff() {
    ghostMusic.fade(ghostMusic.volume(), LOW_VOLUME, 3000);
    this.ghostMoveTo(-100, $(window).height() / 2, () => {
      this.ghostOn();
    });
  }

  ghostMoveTo(x, y, callback) {
    let startTop = this.cursor.offset().top;
    let startLeft = this.cursor.offset().left;
    let top = y;
    let left = x;
    let dx = top - startTop;
    let dy = left - startLeft;
    let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    this.cursor.stop(true);
    this.cursor.animate({
      top: `${top}px`,
      left: `${left}px`
    }, distance / GHOST_SPEED, () => {
      if (callback) callback();
    });
  }

  showResult(win, color) {
    super.showResult(win, color);
    this.ghostOff();
  }

  quit() {
    this.cursor.stop();
    $('body').remove(this.cursor);
  }
}