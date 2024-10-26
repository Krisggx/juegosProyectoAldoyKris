let casillas = document.querySelectorAll(".casilla");

let turno = "X";
let juegoTerminado = false;
let victoriasX = 0; // Contador para X
let victoriasO = 0; // Contador para O
let empates = 0;  // Contador para empates

// Reiniciar las casillas y asignar eventos a cada una
casillas.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!juegoTerminado && e.innerHTML === "") {
            e.innerHTML = turno;
            verificarGanador();  // Verificar si alguien ha ganado
            verificarEmpate();   // Verificar si hay empate
            cambiarTurno();      // Cambiar de turno
        }
    });
});

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
    let condicionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < condicionesGanadoras.length; i++) {
        let v0 = casillas[condicionesGanadoras[i][0]].innerHTML;
        let v1 = casillas[condicionesGanadoras[i][1]].innerHTML;
        let v2 = casillas[condicionesGanadoras[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            juegoTerminado = true;
            document.querySelector("#resultado").innerHTML = turno + " gana";  // Mensaje en español
            document.querySelector("#jugar-nuevamente").style.display = "inline";

            for (j = 0; j < 3; j++) {
                casillas[condicionesGanadoras[i][j]].style.backgroundColor = "#08D9D6";
                casillas[condicionesGanadoras[i][j]].style.color = "#000";
            }

            if (turno === "X") {
                victoriasX++;
                document.querySelector("#victorias-x").innerHTML = victoriasX;
            } else {
                victoriasO++;
                document.querySelector("#victorias-o").innerHTML = victoriasO;
            }
        }
    }
}

// Verifica si el juego termina en empate
function verificarEmpate() {
    if (!juegoTerminado) {
        let esEmpate = true;
        casillas.forEach(e => {
            if (e.innerHTML === "") esEmpate = false;
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
    casillas.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});
