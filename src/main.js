import '../sass/main.scss';

import Game from './class/Game';
console.log("¡JavaScript cargado correctamente!");
let data = Game.getRowsCols();
let game = new Game(data.rows, data.cols, 'game');

let resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
  Game.resetGame();
});

// let nombres = ['Alba', 'Pepe'];

// localStorage.setItem['nombres', JSON.stringify(nombres)];

// let nombresRecuperados = localStorage.getItem('nombres');
// console.log(JSON.parse(nombresRecuperados));