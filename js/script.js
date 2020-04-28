"use strict";

/*****************

Chesses 3
Pippin Barr

Another eight variations of chess, following on from Chesses.

******************/

// Track whether the user is on mobile or not (we'll find out via events)
let MOBILE = false;

// The basic information about the game to display as part of the menu
const TITLE = `CHESSES3`;
const AUTHOR = `BY <a href="https://www.pippinbarr.com/" target="_blank">&nbsp;PIPPIN BARR</a>`;

// The game itself (as represented by BaseChess and its children)
let chess;
// The menu data
let menu = [{
    title: `4'33"`,
    id: `cage`,
    class: Cage,
    info: `A tribute to John Cage's wonderful and imicable musical piece <a href="https://en.wikipedia.org/wiki/4%E2%80%B233%E2%80%B3" target="_blank">4'33"</a>.`
  },
  {
    title: `IMMORTAL`,
    id: `immortal`,
    class: Immortal,
    info: `Experience the remarkable chess game known as <a href="https://www.chessgames.com/perl/chessgame?gid=1011478" target="_blank">Kasparov's Immortal</a>!`
  },
  {
    title: `PACIFIST`,
    id: `pacifist`,
    class: Pacifist
  },
  {
    title: `PSIONIC`,
    id: `psionic`,
    class: Psionic
  },
  {
    title: `DRESSAGE`,
    id: `dressage`,
    class: Dressage,
    info: `The highest expression of horse training. Horse and rider are expected to perform from memory a series of predetermined movements.`
  },
  {
    title: `MEMORY`,
    id: `memory`,
    class: Memory
  },
  {
    title: `COMEDY`,
    id: `comedy`,
    class: Comedy,
    info: `Ha ha.

    (Laughter from <a href="https://freesound.org/people/sandyrb/>sandyrb</a> on <a href="https://freesound.org/>Freesound</a>.)`
  },
  {
    title: `GHOST`,
    id: `ghost`,
    class: Ghost,
    info: `As in <a href="https://en.wikipedia.org/wiki/Ghost_(1990_film)">Ghost (1990)</a>.`
  },
];

// Laughter
let laughs = [];
for (let i = 1; i <= 16; i++) {
  laughs.push(new Audio(`assets/sounds/laughs/laugh-${i}.wav`));
}

$(document).ready(chessesSetup);

// Do the work of setting up and displaying the menu
function chessesSetup() {
  $('#title').text(`${TITLE}`)
  $('#author').html(`${AUTHOR}`)

  // Sort the menu alphabetically (nice that you can compare strings like this)
  menu.sort((a, b) => a.title < b.title ? -1 : 1);

  // Go through the menu data and create menu items and info icons
  for (let i = 0; i < menu.length; i++) {
    let $menuItem = $('<div>')
      .addClass('menu-item active')
      .attr('id', menu[i].id)
      .data('game', menu[i].id)
      .data('info', menu[i].info)
      .data('index', i)
      .on('click', menuClicked) // Click event for desktop
      .on('touchstart', menuClicked) // Touch event for mobile
      .appendTo('#menu');
    let $menuText = $('<span>')
      .attr('id', `${menu[i].id}-title`)
      .html(`${menu[i].title}`)
      .appendTo($menuItem);
    // Info icon will be positioned to the right of the title if needed
    let $infoSymbol = $('<span class="info">ⓘ</span>')
      .appendTo($menuItem);
  }

  // The info panel is used to display extra information about specific games
  const $infoPanel = $('<div>')
    .addClass('info-panel')
    .appendTo('#game')

  // The info text is displayed inside the info panel
  const $infoText = $('<div>')
    .addClass('info-text')
    .html("")
    .appendTo($infoPanel);
}

// Handles returning to the menu when you click the title
function titleClicked() {
  captureSFX.play();

  // Tell the currently active version of the game to quit
  chess.quit();

  // Slide up all the things we don't want to see on the main menu
  $('.instruction').slideUp();
  $('#message').slideUp();
  $('.info-panel').slideUp();
  $('#verbose-message').slideUp();

  // Disable the title from "quitting" when you're already there
  $('#title').removeClass('active');
  // Hide the info icon if present
  $('.info').stop().css('opacity', 0);
  $('.info').off('click');

  // Slide up the game and slide down the menu interface elements
  $('#game').slideUp(() => {
    $('.menu-item').slideDown();
    $('#author').slideDown();
    // Make all menu items active again
    $('.menu-item')
      .addClass('active')
      .on('click', menuClicked);
  });
}

// Handle a click on a specific menu item
function menuClicked(e) {
  attackSFX.play();

  // Use the event type to determine whether the user is on mobile or desktop
  // (We use this for the instructions for FOG)
  if (e.type === 'touchstart') MOBILE = true;
  else MOBILE = false;

  // Get the index in the menu of the chosen item
  let index = $(this).data('index');
  // Instantiate the associated class
  chess = new menu[index].class(); // Is this hideous? It works...

  // Deactivate the menu item buttons (because one of them is being
  // used to display the title of the current game and shouldn't start a new one)
  $('.menu-item').removeClass('active');
  $('.menu-item').off('click');

  // Slide away the elements we shouldn't see, including the author
  // and all menu items not presently being played
  $('#author').slideUp();
  $.when($('.menu-item').not(`#${menu[index].id}`).slideUp(500))
    .then(() => {
      // Once all the menu items are gone, we can slide down the game
      $('#game').slideDown(() => {
        // Activate the title as a quit button
        $('#title').addClass('active');
        $('#title.active').one('click', titleClicked);
        // If there are instructions slide them down (for Fog)
        $(`#${menu[index].id}`).find('.instruction').slideDown();
        // If there is an info icon for this game, fade it in so they notice
        if ($(this).data('info')) {
          $(`#${$(this).data('game')} .info`).stop().animate({
            opacity: 1
          }, 1000);
        }
      });
      // Listen for click events on the info icon and display the panel if so
      $('.info').on('click', function(e) {
        // Don't interpret it as a click on anything else
        e.stopPropagation();
        // If the panel isn't visible, put in the correct info and slide it down
        if (!$('.info-panel').is(':visible')) {
          $('.info-text').html(`<p>${$(this).parent().data('info')}</p>`);
          $('.info-panel').slideDown();
        }
        // If the panel is visible, slide it back up
        else {
          $('.info-panel').slideUp();
        }
      });
    });
}