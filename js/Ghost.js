"use strict";

// Ghost
//
// Ghost chess is here to help.

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

    setTimeout(() => {
      this.ghostClick('e2');
    }, 2000);

    // $(document).on('click', () => {
    //   this.cursor.stop();
    // });
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
    console.log(distance);
    this.cursor.animate({
      top: `${top}px`,
      left: `${left}px`
    }, distance / speed, () => {
      this.cursor.animate({
        top: `+=0px`
      }, 2000, () => {
        $square.trigger('click');
        callback();
      });
    });
  }

  quit() {}
}