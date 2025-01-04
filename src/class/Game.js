import { shuffleArray } from '../utils/utils.js';
import Box from '../class/Box.js';
import Timer from '../class/Timer.js';

class Game {
    #rows;
    #cols;
    #idElement;
    #boxes;
    element;
    timer;

    constructor(rows, cols, idElement='game') {
        this.#rows = rows;
        this.#cols = cols;
        this.#idElement = idElement;
        this.element = document.getElementById(idElement);
        this.#boxes = [];
        this.createBoxes();
        this.paintBoxes();

        console.log('Se ha creado un objeto de tipo Game');

        this.element.addEventListener('click', () => {
            this.checkOpenBoxes();
        });

        this.initTimer();
    }

    get col() {
        return this.#cols;
    }

    get row() {
        return this.#rows;
    }



    checkOpenBoxes() {
        // Inicia el temporizador en el primer clic.
        if (!this.timer.isRunning) {
            this.timer.start();
            this.timer.isRunning = true; // Marca el temporizador como activo.
        }
        // Comprobamos si ya hay más de 1 caja abierta
        let nOpenBoxes = this.#boxes.filter((box) => box.open && box.free);
        if (nOpenBoxes.length == 2) {
            if (nOpenBoxes[0].color === nOpenBoxes[1].color) {
                // Itereamos en cada una de ellas y cambiamos el free a false
                nOpenBoxes.map((box) => {
                    box.free = false;
                });
            } else {
                setTimeout(() => {
                    nOpenBoxes.map((box) => {
                        box.resetColor();
                    });
                }, 500);
            }
        }
        this.arrayBoxesToLocalStorage();
        // Verifica si todas las cajas están libres.
        if (this.#boxes.every((box) => !box.free)) {
            this.timer.stop(); // Detén el temporizador.
            this.showVictoryMessage(); // Muestra el mensaje de victoria.
        }
    }
    // Agrega un mensaje de victoria al finalizar
    showVictoryMessage() {
        let header = document.getElementById('boxHeader');
        let victoryMessage = document.createElement('div');
        victoryMessage.setAttribute('id', 'victoryMessage');
        victoryMessage.innerHTML = `<h3>¡Felicidades! Has ganado el juego en ${this.timer.min}:${this.timer.pad(this.timer.sec)}:${this.timer.pad(this.timer.ms)}.</h3>`;
        header.appendChild(victoryMessage);
    }
    
    // Función que crea los colores aleatorios
    createRandomColors() {
        let randomColors = [];
        for (let index = 0; index < (this.#cols * this.#rows) / 2; index++) {
            let red = Math.floor(Math.random() * 256);
            let green = Math.floor(Math.random() * 256);
            let blue = Math.floor(Math.random() * 256);
            let color = `rgb(${red}, ${green}, ${blue})`;
            randomColors.push(color);
        }
        randomColors = [...randomColors, ...randomColors];
        shuffleArray(randomColors);
        return randomColors;
    }

    // Función que crea las cajas
    createBoxes() {
        this.#boxes = [];
        // Si hay dtos en localStorge, creo las boxes desde ahí, sino las genero normalmente
        if(localStorage.getItem('boxes') !== null) {
            let boxesFromLocalStorage = JSON.parse(localStorage.getItem('boxes'));
            boxesFromLocalStorage.map(box => {
                let newBox = new Box(box.row, box.col, box.color, box.free, box.open);
                this.#boxes.push(newBox);
            })
        } else {
            let randomColors = this.createRandomColors();
            for (let row = 0; row < this.#rows; row++) {
                for (let col = 0; col < this.#cols; col++) {
                    let color = randomColors.shift();
                    let newBox = new Box(row, col, color);
                    this.#boxes.push(newBox);
                }
            }
            this.arrayBoxesToLocalStorage();
        }
    }

    // Función que recorre todas las boxes con la configuración que tengan en ese momento y va a alamcenarlas en un string normal y lo va a guardar en el localStorage
    arrayBoxesToLocalStorage() {
        let arrayBoxesToLocalStorage = this.#boxes.map(box => {
            return {
                'row': box.row,
                'col': box.col,
                'color': box.color,
                'free': box.free,
                'open': box.open,
            }
        });
        localStorage.setItem('boxes', JSON.stringify(arrayBoxesToLocalStorage));
    }

    // Función que colorea las cajas
    paintBoxes() {
        let header = document.createElement('header');
        header.setAttribute('id', 'boxHeader');
        this.element.appendChild(header);

        let boxContainer = document.createElement('div');
        boxContainer.setAttribute('id', 'boxContainer');
        this.element.appendChild(boxContainer);

        this.setCSSBoxTemplate();
        this.#boxes.map((box) => {
            let newBoxDiv = document.createElement('div');
            newBoxDiv.classList.add('box');
            if(!box.free || box.open) {
                newBoxDiv.style.backgroundColor = box.color;
            }
            box.element = newBoxDiv;
            box.addEventClick();
            boxContainer.appendChild(newBoxDiv);
        });
    }
    // Función que inicializa el cronómetro
    initTimer() { 
        let timerContainer = document.createElement('h2');
        timerContainer.setAttribute('id', 'timerContainer');
        timerContainer.innerHTML = '<span id="timer">00:00:00</span>';

        let header = document.getElementById('boxHeader');
        header.appendChild(timerContainer);

        this.timer = new Timer();
        this.timer.stop();
        // Detén el temporizador si se resetea el juego.
        document.addEventListener('resetGame', () => {
        this.timer.stop();
    });
    }

    // Función que settea las columnas y las filas según lo que introduzca el usuario
    setCSSBoxTemplate() {
        let boxContainer = document.getElementById('boxContainer');
        boxContainer.style.gridTemplateColumns = `repeat(${this.#cols}, 1fr)`;
        boxContainer.style.gridTemplateRows = `repeat(${this.#rows}, 1fr)`
    }

    // Función estática que pide al usuario el número de filas y columnas y verifica si son pares.
    static getRowsCols() {
        let rows, cols;

        if (localStorage.getItem('rows') !== null && localStorage.getItem('cols') !== null) {
            rows = parseInt(localStorage.getItem('rows'));
            cols = parseInt(localStorage.getItem('cols'));
        } else {
            rows = parseInt(prompt('Introduzca el número de filas'));
            cols = parseInt(prompt('Introduzca el número de columnas'));
            while(rows * cols % 2 != 0) {
                alert('El número de cartas deben ser par. Vuelva a introducir los datos');
                rows = parseInt(prompt('Introduzca el número de filas'));
                cols = parseInt(prompt('Introduzca el número de columnas'));
            }
            // Después de introducir el número de filas y columnas vamos a almacenarlo en localStorage, de modo que si actualizas el juego lo deja donde lo dejaste
            localStorage.setItem('rows', rows);
            localStorage.setItem('cols', cols);
        }
        // Devolvemos un objeto con las valores dados por el usuario
        return {
            'rows': rows,
            'cols': cols,
        }
    }
    // Borrar del localStorage las filas y columnas y refresca la página para poder introducir nuevos valores
    static resetGame() {
        document.dispatchEvent(new Event ('resetGame')); // Dispara un nuevo evento global
        localStorage.removeItem('cols');
        localStorage.removeItem('rows');
        localStorage.removeItem('boxes');
        localStorage.removeItem('timer');
        location.reload();
    }
}

export default Game;