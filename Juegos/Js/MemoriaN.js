let board = document.getElementById('game-board'); // Tablero del juego
let player1Score = document.getElementById('score1'); // Puntaje del jugador 1
let player2Score = document.getElementById('score2'); // Puntaje del jugador 2
let currentPlayer = 1; // Jugador que tiene el turno actual (1 o 2)
let player1Pairs = 0; // Contador de pares encontrados por el jugador 1
let player2Pairs = 0; // Contador de pares encontrados por el jugador 2
let firstCard = null; // Primera carta seleccionada
let secondCard = null; // Segunda carta seleccionada
let lockBoard = false; // Bandera para bloquear el tablero durante la verificación

const gridSize = 24; // Total de cartas (12 parejas)


// Cargar los nombres de los jugadores guardados
/*Descripción: Esta función se ejecuta cuando se carga la página. Recupera los nombres de los jugadores desde localStorage. 
Si no existen, establece nombres predeterminados ("Jugador 1" y "Jugador 2").
Uso: Muestra los nombres de los jugadores en la interfaz y llama a startGame() para iniciar el juego.*/
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
/*Descripción: Reinicia el estado del juego. Limpia el tablero y reinicia los puntajes de ambos jugadores a cero. 
Luego, llama a createBoard() para generar un nuevo conjunto de cartas.
Uso: Se llama al inicio del juego o cuando se reinicia el juego.*/
function startGame() {
    board.innerHTML = ''; // Limpia el contenido del tablero
    player1Pairs = 0; // Reinicia el contador de pares del jugador 1
    player2Pairs = 0; // Reinicia el contador de pares del jugador 2
    player1Score.innerText = player1Pairs; // Actualiza el puntaje del jugador 1
    player2Score.innerText = player2Pairs; // Actualiza el puntaje del jugador 2
    createBoard(); // Crea un nuevo tablero
}


// Función para crear el tablero
/*Descripción: Crea un arreglo de cartas que contiene 12 pares de números (de 1 a 12). 
Luego mezcla las cartas aleatoriamente y crea un div para cada carta, configurando su aspecto y comportamiento. 
Cada carta se muestra inicialmente con un símbolo "?" y tiene un evento de clic para voltear la carta.
Uso: Se llama al iniciar el juego o cuando se reinicia el juego.*/
function createBoard() {
    let cards = [];
    for (let i = 1; i <= gridSize / 2; i++) {
        cards.push(i, i); // Agrega dos cartas por cada número (12 números)
    }
    cards.sort(() => 0.5 - Math.random()); // Mezcla las cartas aleatoriamente

    cards.forEach(number => {
        let card = document.createElement('div'); // Crea un nuevo div para cada carta
        card.classList.add('card'); // Agrega la clase 'card' al div
        card.dataset.number = number; // Almacena el número en el atributo data-number
        card.innerText = '?'; // Muestra '?' como texto inicial
        card.addEventListener('click', flipCard); // Añade un evento de clic para voltear la carta
        board.appendChild(card); // Añade la carta al tablero
    });

    board.style.gridTemplateColumns = 'repeat(6, 1fr)'; // Establece el diseño del tablero a 6 columnas
    board.style.gridTemplateRows = 'repeat(4, 1fr)'; // Establece el diseño del tablero a 4 filas
}


// Función para voltear una carta
/*Descripción: Maneja la lógica para voltear las cartas. 
Primero verifica si el tablero está bloqueado o si la carta ya ha sido volcada. Si es válida, 
muestra el número en la carta y marca la carta como volcada. Si no hay una carta seleccionada, 
establece la carta actual como la primera. Si ya hay una carta seleccionada, 
la establece como la segunda y llama a checkForMatch() para verificar si las dos cartas coinciden.
Uso: Se llama cuando un jugador hace clic en una carta.*/
function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flipped')) return; // Evita acciones si el tablero está bloqueado o la carta ya ha sido volcada

    this.innerText = this.dataset.number; // Muestra el número de la carta
    this.classList.add('flipped'); // Marca la carta como volcada

    if (!firstCard) {
        firstCard = this; // Si no hay primera carta, establece la carta actual como primera
    } else {
        secondCard = this; // Establece la carta actual como segunda
        lockBoard = true; // Bloquea el tablero
        checkForMatch(); // Verifica si las cartas coinciden
    }
}


// Función para verificar si las cartas coinciden
/*Descripción: Comprueba si las dos cartas seleccionadas coinciden. 
Si coinciden, llama a disableCards() para ocultarlas y updateScore() 
para aumentar el puntaje del jugador actual. Si no coinciden, llama a unflipCards() 
para volver a voltear las cartas y toggleTurn() para cambiar al siguiente jugador.
Uso: Se llama después de que se han seleccionado dos cartas.*/
function checkForMatch() {
    let isMatch = firstCard.dataset.number === secondCard.dataset.number; // Compara los números de las cartas
    if (isMatch) {
        disableCards(); // Deshabilita las cartas si coinciden
        updateScore(); // Actualiza el puntaje
    } else {
        unflipCards(); // Vuelve a voltear las cartas si no coinciden
        toggleTurn(); // Cambia de turno
    }
}

// Función para deshabilitar las cartas emparejadas
/*Descripción: Deshabilita las cartas que han sido emparejadas. 
Después de un segundo, oculta las cartas (cambiando su visibilidad) 
y llama a resetBoard() para preparar el tablero para la próxima selección.
Uso: Se llama cuando se encuentran dos cartas coincidentes.*/
function disableCards() {
    setTimeout(() => {
        firstCard.style.visibility = 'hidden'; // Oculta la primera carta
        secondCard.style.visibility = 'hidden'; // Oculta la segunda carta
        resetBoard(); // Restablece el tablero
    }, 1000); // Espera 1 segundo antes de ocultar
}

// Función para voltear las cartas si no coinciden
/*Descripción: Esta función se encarga de voltear las cartas de nuevo si no coinciden. 
Después de un segundo, muestra de nuevo el símbolo "?" en las cartas, elimina la clase "flipped" 
y llama a resetBoard() para reiniciar el estado de selección.
Uso: Se llama cuando las cartas seleccionadas no coinciden.*/
function unflipCards() {
    setTimeout(() => {
        firstCard.innerText = '?'; // Vuelve a mostrar '?'
        secondCard.innerText = '?'; // Vuelve a mostrar '?'
        firstCard.classList.remove('flipped'); // Elimina la clase 'flipped'
        secondCard.classList.remove('flipped'); // Elimina la clase 'flipped'
        resetBoard(); // Restablece el tablero
    }, 1000); // Espera 1 segundo antes de voltear
}

// Función para restablecer las variables del tablero
/*Descripción: Restablece las variables que mantienen el estado del tablero, lo que permite nuevas selecciones de cartas.
Uso: Se llama después de que se manejan los resultados de una selección de cartas (ya sea un emparejamiento exitoso o no).*/
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false]; // Restablece las cartas y desbloquea el tablero
}


// Función para actualizar el puntaje del jugador actual
/*Descripción: Actualiza el puntaje del jugador que tiene el turno actual. Incrementa el número de pares encontrados y actualiza la visualización del puntaje en el DOM.
Uso: Se llama cuando un jugador encuentra un par de cartas coincidentes.*/
function updateScore() {
    if (currentPlayer === 1) {
        player1Pairs++; // Incrementa el contador de pares del jugador 1
        player1Score.innerText = player1Pairs; // Actualiza el puntaje del jugador 1
    } else {
        player2Pairs++; // Incrementa el contador de pares del jugador 2
        player2Score.innerText = player2Pairs; // Actualiza el puntaje del jugador 2
    }
}

// Función para cambiar de turno
/*Descripción: Cambia el turno entre los dos jugadores. 
Se alterna el valor de currentPlayer entre 1 y 2. Además, 
actualiza la interfaz para reflejar qué jugador está activo actualmente.
Uso: Se llama después de que un jugador pierde su turno. */
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
