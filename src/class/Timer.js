class Timer {
    min;
    sec;
    ms;
    count;
    malt;
    salt;
    msalt;
    idElement;
    isRunning = false;
    
    constructor(idElement = 'timer') {
        console.log('Creamos un timer.');
        this.idElement = idElement;

        const storedTimer = localStorage.getItem('timer');
        if (storedTimer) {
            try {
                let timerFromLocalStorage = JSON.parse(storedTimer);
                this.sec = parseInt(timerFromLocalStorage.sec) || 0;  // Añadimos un fallback a 0 si no es un número
                this.min = parseInt(timerFromLocalStorage.min) || 0;
                this.ms = parseInt(timerFromLocalStorage.ms) || 0;
            } catch (e) {
                console.error("Error al parsear el timer desde localStorage", e);
                this.ms = 0;
                this.min = 0;
                this.sec = 0;
            }
        } else {
            this.ms = 0;
            this.min = 0;
            this.sec = 0;
        }
    }

    start() {
        if (this.isRunning) return; // Evita que el temporizador se inicie múltiples veces.
        this.isRunning = true;
        this.count = setInterval(() => {
            if (this.ms === 100) {
                this.ms = 0;
                if (this.sec === 60) {
                    this.sec = 0;
                    this.min++;
                } else {
                    this.sec++;
                }
            } else {
                this.ms++;
            }

            this.malt = this.pad(this.min);
            this.salt = this.pad(this.sec);
            this.msalt = this.pad(this.ms);

            this.update(this.malt + ':' + this.salt + ':' + this.msalt);
        }, 10);
    };

    stop() {
        clearInterval(this.count);
        this.isRunning = false; // Marca el temporizador como detenido.
    };

    update(txt) {
        let temp = document.getElementById(this.idElement);
        temp.firstChild.nodeValue = txt;

        let timerObject = {
            sec: this.sec,
            min: this.min,
            ms: this.ms,       
        };
        localStorage.setItem('timer', JSON.stringify(timerObject));  
    };

    pad(time) {
        let temp;
        if (time < 10) {
            temp = '0' + time;
        } else {
            temp = time;
        }
        return temp;
    }
}

export default Timer;

