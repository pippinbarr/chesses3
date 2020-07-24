"use strict";

// Ghost
//
// Ghost chess is here to help.

const GHOST_DELAY_MIN = 5000;
const GHOST_DELAY_RANGE = 5000;
const GHOST_ARRIVE_SPEED = 0.1;
const GHOST_LEAVE_SPEED = 0.5;
const LOW_VOLUME = 0.025;
const HIGH_VOLUME = 0.3;
const ghostMusic = new Howl({
  src: ['assets/sounds/unchained-melody.mp3', 'assets/sounds/unchained-melody.ogg']
});
const translate = {
  w: 'translate(-10px,-10px)',
  b: 'translate(-10px,-30px)'
}

class Ghost extends BaseChess {

  constructor() {
    super();

    this.cursor = $('<div>')
      .addClass('ghost-cursor')
      .css({
        top: $(window).height() / 2,
        left: -100
      })
      .appendTo('body');
    this.cursor.leaving = false;
    this.cursor.offScreen = true;

    this.ghostOn();
  }

  ghostOn() {
    if (this.gameOver) {
      return;
    }
    if (this.inputEnabled && !this.cursor.leaving && this.cursor.offScreen) {
      this.ghostTimer(() => {
        this.cursor.css({
          "background-image": `url(assets/images/ghost-cursor-${this.game.turn()}.png)`
        });
        let top = $(window).height() / 2;
        let left = this.game.turn() === 'w' ? -100 : $(window).width() + 100;
        this.cursor.css({
          transform: translate[this.game.turn()],
          top: top,
          left: left
        });
        let moves = this.game.moves({
          verbose: true
        });
        let move = getRandomElement(moves);
        ghostMusic.fade(ghostMusic.volume(), HIGH_VOLUME, 3000);
        this.makeGhostMove(move.from, move.to);
        this.cursor.offScreen = false;
      }, 1000);
      // }, GHOST_DELAY_MIN + Math.random() * GHOST_DELAY_RANGE);
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
    // console.log(`makeGhostMove(), turn: ${this.game.turn()}`);
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
    // console.log(`ghostClick(${square}), turn: ${this.game.turn()}`);
    let $square = $(`.square-${square}`);
    let top = $square.offset().top + $square.height() / 2;
    let left = $square.offset().left + $square.width() / 2;

    this.ghostMoveTo(left, top, GHOST_ARRIVE_SPEED, () => {
      this.ghostTimer(() => {
        $square.trigger('click', [true]);
        let bgImage = this.cursor.css('background-image');
        let newBGImage = bgImage.replace('.png', '-click.png');
        this.cursor.css({
          "background-image": `${newBGImage}`
        });
        setTimeout(() => {
          this.cursor.css({
            "background-image": `${bgImage}`
          });
        }, 500);
        if (callback) callback();
      }, 1000 + Math.random() * 2000);
    });
  }

  squareClicked(event, ghost) {
    super.squareClicked(event);
    if (!ghost && !this.cursor.leaving) {
      this.ghostOff();
    };
  }

  ghostOff() {
    if (this.cursor.leaving || this.cursor.offScreen) return;
    // console.log(`ghostOff(), turn: ${this.game.turn()}`);
    this.cursor.stop(true);
    this.leaving = true;
    ghostMusic.fade(ghostMusic.volume(), LOW_VOLUME, 3000);
    let top = $(window).height() / 2;
    let left = this.game.turn() === 'w' ? -100 : $(window).width() + 100;
    this.ghostMoveTo(left, top, GHOST_LEAVE_SPEED, () => {
      this.leaving = false;
      this.cursor.offScreen = true;
      this.ghostOn();
    });
  }

  ghostMoveTo(x, y, speed, callback) {
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
    }, distance / speed, () => {
      if (callback) callback();
    });
  }

  showResult(win, color) {
    super.showResult(win, color);
    this.ghostOff();
  }

  quit() {
    ghostMusic.pause();
    this.cursor.stop();
    this.cursor.remove();
  }
}