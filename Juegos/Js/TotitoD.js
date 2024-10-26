let casillas = [];
let turno = "X";
let juegoTerminado = false;
let victoriasX = 0; // Contador para X
let victoriasO = 0; // Contador para O
let empates = 0;  // Contador para empates
const filas = 10;  // Número de filas
const columnas = 10; // Número de columnas

// Generar la cuadrícula
const cuadriculaPrincipal = document.querySelector(".cuadricula-principal");
for (let i = 0; i < filas * columnas; i++) {
    const casilla = document.createElement("div");
    casilla.classList.add("casilla", "alinear");
    casilla.dataset.index = i; // Almacenar el índice
    cuadriculaPrincipal.appendChild(casilla);
    casillas.push(casilla);

    // Asignar evento de clic
    casilla.addEventListener("click", () => {
        if (!juegoTerminado && casilla.innerHTML === "") {
            casilla.innerHTML = turno;
            verificarGanador();  // Verificar si alguien ha ganado
            verificarEmpate();   // Verificar si hay empate
            cambiarTurno();      // Cambiar de turno
        }
    });
}

// Cambia el turno entre X y O
function cambiarTurno() {
    if (turno === "X") {
        turno = "O";
        document.querySelector(".fondo").style.left = "85px";
    } else {
        turno = "X";
        document.querySelector(".fondo").style.left = "0";
    }
}

// Verifica si alguien ha ganado
function verificarGanador() {
    const condicionesGanadoras = [];

    // Comprobar filas
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j <= columnas - 5; j++) {
            condicionesGanadoras.push([i * columnas + j, i * columnas + j + 1, i * columnas + j + 2, i * columnas + j + 3, i * columnas + j + 4]);
        }
    }

    // Comprobar columnas
    for (let j = 0; j < columnas; j++) {
        for (let i = 0; i <= filas - 5; i++) {
            condicionesGanadoras.push([i * columnas + j, (i + 1) * columnas + j, (i + 2) * columnas + j, (i + 3) * columnas + j, (i + 4) * columnas + j]);
        }
    }

    // Comprobar diagonales \
    for (let i = 0; i <= filas - 5; i++) {
        for (let j = 0; j <= columnas - 5; j++) {
            condicionesGanadoras.push([i * columnas + j, (i + 1) * columnas + j + 1, (i + 2) * columnas + j + 2, (i + 3) * columnas + j + 3, (i + 4) * columnas + j + 4]);
        }
    }

    // Comprobar diagonales /
    for (let i = 4; i < filas; i++) {
        for (let j = 0; j <= columnas - 5; j++) {
            condicionesGanadoras.push([i * columnas + j, (i - 1) * columnas + j + 1, (i - 2) * columnas + j + 2, (i - 3) * columnas + j + 3, (i - 4) * columnas + j + 4]);
        }
    }

    // Verificar las condiciones de victoria
    for (let condicion of condicionesGanadoras) {
        let [v0, v1, v2, v3, v4] = condicion.map(index => casillas[index].innerHTML);
        if (v0 !== "" && v0 === v1 && v0 === v2 && v0 === v3 && v0 === v4) {
            juegoTerminado = true;
            document.querySelector("#resultado").innerHTML = turno + " gana";  // Mensaje en español
            document.querySelector("#jugar-nuevamente").style.display = "inline";

            // Resaltar las casillas ganadoras
            condicion.forEach(index => {
                casillas[index].style.backgroundColor = "#08D9D6";
                casillas[index].style.color = "#000";
            });

            if (turno === "X") {
                victoriasX++;
                document.querySelector("#victorias-x").innerHTML = victoriasX;
            } else {
                victoriasO++;
                document.querySelector("#victorias-o").innerHTML = victoriasO;
            }
            return;
        }
    }
}

// Verifica si el juego termina en empate
function verificarEmpate() {
    if (!juegoTerminado) {
        let esEmpate = true;
        casillas.forEach(casilla => {
            if (casilla.innerHTML === "") esEmpate = false;
        });

        if (esEmpate) {
            juegoTerminado = true;
            document.querySelector("#resultado").innerHTML = "Empate";  // Mensaje en español
            document.querySelector("#jugar-nuevamente").style.display = "inline";

            empates++;
            document.querySelector("#empates").innerHTML = empates;
        }
    }
}

// Reinicia el juego
document.querySelector("#jugar-nuevamente").addEventListener("click", () => {
    juegoTerminado = false;
    turno = "X";
    document.querySelector(".fondo").style.left = "0";
    document.querySelector("#resultado").innerHTML = "";
    document.querySelector("#jugar-nuevamente").style.display = "none";

    // Limpiar las casillas y restablecer estilos
    casillas.forEach(casilla => {
        casilla.innerHTML = "";
        casilla.style.removeProperty("background-color");
        casilla.style.color = "#fff";
    });
});
