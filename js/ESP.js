"use strict";

// ESP
//
// Use ESP to make your moves

class ESP extends BaseChess {

  constructor() {
    super();

    $(SQUARE).off('click');
    setTimeout(() => {
      let color = this.game.turn() === 'w' ? 'WHITE' : 'BLACK';
      let message = `${color}, CALM YOUR MIND THEN ${MOBILE ? 'TAP' : 'CLICK'} HERE WHEN YOU ARE READY TO USE ESP.`;
      this.showVerboseMessage(message);
    }, 1500);

    $('#verbose-message').on('click', () => {
      this.hideVerboseMessage();
      this.startESP();
    });

    this.currentESPMoves = [];
  }

  startESP() {
    this.currentESPMoves = this.game.moves({
      verbose: true
    });

    this.currentESPMoves.forEach((move) => {
      $(`.square-${move.from} img`).effect('shake', {
        distance: Math.random(),
        direction: Math.random() > 0.5 ? 'left' : 'up',
        duration: 1000,
        times: 10
      });
    });
    setInterval(() => {
      this.currentESPMoves = this.currentESPMoves.filter(a => Math.random() > 0.5);
      this.currentESPMoves.forEach((move) => {
        console.log(move.from);
        $(`.square-${move.from} img`).effect('shake', {
          distance: Math.random(),
          direction: Math.random() > 0.5 ? 'left' : 'up'
        });
      });
    }, 1000);
  }

  quit() {

  }
}