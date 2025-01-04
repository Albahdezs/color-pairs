// Función que baraja o desordena un array que se para por parámetro
function shuffleArray(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remain element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with current element
        [array[currentIndex] , array[currentIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
}


export {shuffleArray};