'use strict';

import Game from './Game.js';

const init = () => {
  const theField = document.getElementById("field");
  const theGame = new Game(theField);

  document.getElementById('start').addEventListener("click", () => {
    startGame(theGame);
    document.getElementById("start").blur();
  });

  window.addEventListener('keydown', theGame.keyDownActionHandler.bind(theGame));
  window.addEventListener('keyup', theGame.keyUpActionHandler.bind(theGame));
}

window.addEventListener("load", init);


// true iff game is started
let started = false;
/** start and stop a game
 * @param {Game} theGame - the game to start and stop
 */
const startGame = theGame => {
  if (!started) {
    theGame.start();
    theGame.socket.on('number', (message) => {
      document.getElementById('player').textContent = message < 3 ? `Bienvenue, joueur ${message}`:"Connexion refusée.";
    });
  }
  else {
    theGame.socket.disconnect(true);
    theGame.stop();
  }
  started = ! started;
}
