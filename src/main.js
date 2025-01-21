import Game from './class/Game.js';
console.log("¡JavaScript cargado correctamente!");
let data = Game.getRowsCols();
let game = new Game(data.rows, data.cols, 'game');

let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  Game.resetGame();
});
