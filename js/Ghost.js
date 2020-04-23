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
    }, 2000)

  }

  ghostClick(square) {
    let $square = $(`.square-${square}`);
    let top = $square.offset().top + $square.height() / 2;
    let left = $square.offset().left + $square.width() / 2;
    this.cursor.animate({
      top: `${top}px`,
      left: `${left}px`
    }, 1000, () => {
      $square.trigger('click');
    });
  }

  quit() {}
}