"use strict";

// Immortal
//
// Play Kasparov's Immortal game! Lose!

class Immortal extends BaseChess {

  constructor() {
    super();

    this.immortal = ["e4", "d6", "d4", "Nf6", "Nc3", "g6", "Be3", "Bg7", "Qd2",
      "c6", "f3", "b5", "Nge2", "Nbd7", "Bh6", "Bxh6", "Qxh6", "Bb7", "a3",
      "e5", "O-O-O", "Qe7", "Kb1", "a6", "Nc1", "O-O-O", "Nb3", "exd4",
      "Rxd4", "c5", "Rd1", "Nb6", "g3", "Kb8", "Na5", "Ba8", "Bh3", "d5",
      "Qf4+", "Ka7", "Rhe1", "d4", "Nd5", "Nbxd5", "exd5", "Qd6", "Rxd4",
      "cxd4", "Re7+", "Kb6", "Qxd4+", "Kxa5", "b4+", "Ka4", "Qc3", "Qxd5",
      "Ra7", "Bb7", "Rxb7", "Qc4", "Qxf6", "Kxa3", "Qxa6+", "Kxb4", "c3+", "Kxc3",
      "Qa1+", "Kd2", "Qb2+", "Kd1", "Bf1", "Rd2", "Rd7", "Rxd7", "Bxc4", "bxc4",
      "Qxh8", "Rd3", "Qa8", "c3", "Qa4+", "Ke1", "f4", "f5", "Kc1", "Rd2", "Qa7"
    ];
    this.currentMove = 0;
    this.correct = false;

    $('#board').css({
      transform: `rotate(180deg)`
    });
    $(SQUARE).css({
      transform: `rotate(180deg)`
    });

    setTimeout(() => {
      this.changeTurn();
    }, 1000);
  }

  move(from, to) {
    let move = this.game.move(this.immortal[this.currentMove]);
    this.game.undo();
    this.correct = (from === move.from && to === move.to);
    if (!this.correct) {
      this.showMessage("THAT'S NOT WHAT HAPPENED.");
    }
    super.move(from, to);
  }

  moveCompleted() {
    if (this.correct || this.game.turn() === 'b') {
      this.currentMove++;
      super.moveCompleted();
    }
    else {
      setTimeout(() => {
        this.game.undo();
        this.board.position(this.game.fen(), true);
        this.hideMessage();
        setTimeout(() => {
          this.enableInput();
          this.from = null;
        }, 1000);
      }, 1000);
    }
    this.correct = false;
  }

  changeTurn() {
    if (!this.immortal) {
      return;
    }

    super.changeTurn();

    if (this.game.turn() === 'w') {
      this.makeWhiteMove();
    }
  }

  makeWhiteMove() {
    let move = this.game.move(this.immortal[this.currentMove]);
    this.game.undo();
    this.move(move.from, move.to);
  }

  quit() {

  }
}