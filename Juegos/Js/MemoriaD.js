/*
-board: Elemento del DOM que representa el tablero del juego.
-player1Score y player2Score: Elementos del DOM que muestran el puntaje de cada jugador.
-currentPlayer: Variable que rastrea de quién es el turno (1 o 2).
-player1Pairs y player2Pairs: Contadores de pares encontrados por cada jugador.
-firstCard y secondCard: Variables que almacenan las cartas seleccionadas actualmente.
-lockBoard: Bandera para evitar que el tablero se pueda interactuar mientras se verifica una coincidencia.
-gridSize: Número total de cartas (24 cartas para 12 parejas).*/

let board = document.getElementById('game-board');
let player1Score = document.getElementById('score1');
let player2Score = document.getElementById('score2');
let currentPlayer = 1;
let player1Pairs = 0;
let player2Pairs = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

const gridSize = 120; // 60 parejas (120 cartas)

// Cargar los nombres de los jugadores guardados
/*Este bloque se ejecuta cuando la ventana se carga. Recupera los nombres de los jugadores almacenados en localStorage. 
Si no hay nombres guardados, se utilizan nombres predeterminados ("Jugador 1" y "Jugador 2"). 
Luego, se actualizan los elementos del DOM correspondientes y se inicia el juego llamando a startGame().*/
window.onload = function() {
    let player1Name = localStorage.getItem('player1') || 'Jugador 1';
    let player2Name = localStorage.getItem('player2') || 'Jugador 2';
    
    document.getElementById('player1-turn').innerText = player1Name;
    document.getElementById('player2-turn').innerText = player2Name;
    document.getElementById('player1-score-name').innerText = player1Name;
    document.getElementById('player2-score-name').innerText = player2Name;

    startGame();
};

// Función para iniciar el juego
/*startGame(): Resetea el tablero, los puntajes de ambos jugadores 
y crea un nuevo tablero llamando a createBoard().*/
function startGame() {
    board.innerHTML = '';
    player1Pairs = 0;
    player2Pairs = 0;
    player1Score.innerText = player1Pairs;
    player2Score.innerText = player2Pairs;
    createBoard();
}

// Función para crear el tablero
/*createBoard(): Crea un array de cartas (120 elementos, 60 parejas), las mezcla aleatoriamente y genera elementos div para cada carta.
Cada carta tiene un texto inicial de "?" y un evento de clic que llama a flipCard(). 
También configura el estilo del tablero para que tenga 6 columnas y 4 filas.*/
function createBoard() {
    let cards = [];
    for (let i = 1; i <= gridSize / 2; i++) {
        cards.push(i, i);
    }
    cards.sort(() => 0.5 - Math.random());

    cards.forEach(number => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.number = number;
        card.innerText = '?';
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    // Establecer el estilo del tablero para que sea cuadrado
    board.style.gridTemplateColumns = 'repeat(12, 1fr)'; // 12 columnas
    board.style.gridTemplateRows = 'repeat(10, 1fr)'; // 10 filas
}


// Función para voltear una carta
/*flipCard(): Maneja la lógica para voltear una carta. Si el tablero está bloqueado, si la carta ya ha sido volteada o si 
es la misma carta que se está intentando voltear,
la función se detiene. Si no hay una carta seleccionada, la carta actual se almacena como firstCard. 
Si ya hay una carta seleccionada, se guarda como secondCard, se bloquea el tablero y se verifica si las cartas coinciden.*/

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flipped')) return;

    this.innerText = this.dataset.number;
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        lockBoard = true;
        checkForMatch();
    }
}

// Función para verificar si las cartas coinciden
/*checkForMatch(): Compara los números de firstCard y secondCard. 
Si coinciden, deshabilita las cartas y actualiza el puntaje. Si no coinciden, llama a unflipCards() y cambia de turno.*/
function checkForMatch() {
    let isMatch = firstCard.dataset.number === secondCard.dataset.number;
    if (isMatch) {
        disableCards();
        updateScore();
    } else {
        unflipCards();
        toggleTurn();
    }
}


// Función para deshabilitar las cartas emparejadas
/*disableCards(): Oculta las cartas que han sido emparejadas 
correctamente después de un segundo y luego restablece el tablero.*/
function disableCards() {
    setTimeout(() => {
        firstCard.style.visibility = 'hidden';
        secondCard.style.visibility = 'hidden';
        resetBoard();
    }, 1000);
}

// Función para voltear las cartas si no coinciden
/*unflipCards(): Vuelve a voltear las cartas que no coinciden 
después de un segundo, restableciendo su texto a "?" y quitando la clase 'flipped'.*/
function unflipCards() {
    setTimeout(() => {
        firstCard.innerText = '?';
        secondCard.innerText = '?';
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Función para restablecer las variables del tablero
/*resetBoard(): Reinicia las variables firstCard, 
secondCard y lockBoard para permitir nuevas selecciones.*/
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Función para actualizar el puntaje del jugador actual
/*updateScore(): Incrementa el puntaje del jugador actual (1 o 2) 
y actualiza el elemento de puntaje correspondiente en el DOM.*/
function updateScore() {
    if (currentPlayer === 1) {
        player1Pairs++;
        player1Score.innerText = player1Pairs;
    } else {
        player2Pairs++;
        player2Score.innerText = player2Pairs;
    }
}

// Función para cambiar de turno
/*toggleTurn(): Cambia el turno al otro jugador y 
actualiza el estado visual de los turnos en el DOM. */
function toggleTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('player1-turn').classList.toggle('active', currentPlayer === 1);
    document.getElementById('player2-turn').classList.toggle('active', currentPlayer === 2);
}

// Botón de reiniciar
/*Este bloque agrega un evento de clic al botón de reinicio. Cuando se hace clic, 
se restablecen los puntajes de ambos jugadores a cero y se reinicia el juego llamando a startGame().*/
document.getElementById('reset-btn').addEventListener('click', () => {
    player1Pairs = 0;
    player2Pairs = 0;
    player1Score.innerText = player1Pairs;
    player2Score.innerText = player2Pairs;
    startGame();
});
