import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Game from './Game';
import Swal from 'sweetalert2';

let player1;
let player2;
let personaje1 = "";
let personaje2 = "";

// LÓGICA DE FONDO ALEATORIO 
// 1. Array con las clases de los fondos disponibles 
const ARENA_FONDOS = ['arena-1', 'arena-2', 'arena-3', 'arena-4', 'arena-5', 'arena-6'];

/* Selecciona un fondo aleatorio del array ARENA_FONDOS
 * y lo aplica al <body>*/
function cambiarFondoAleatorio() {
    const body = document.body;

    // 1. Elimina cualquier clase de arena anterior para asegurar que solo una esté activa
    ARENA_FONDOS.forEach(clase => {
        body.classList.remove(clase);
    });

    // 2. Genera un índice aleatorio
    const indiceAleatorio = Math.floor(Math.random() * ARENA_FONDOS.length);

    // 3. Obtiene y aplica la nueva clase de fondo seleccionada
    const nuevaClaseFondo = ARENA_FONDOS[indiceAleatorio];
    body.classList.add(nuevaClaseFondo);

    console.log(`Fondo de batalla cambiado a: ${nuevaClaseFondo}`);
}
//LÓGICA DE HISTORIAL DE ESTADÍSTICAS <<<
let stats = {
    // Almacena: { 'nombreUsuario': { victorias: 0, derrotas: 0 } }
};

const actualizarHistorialDisplay = (user1, user2) => {
    // Inicializar si es la primera vez que luchan
    if (!stats[user1]) stats[user1] = { victorias: 0, derrotas: 0 };
    if (!stats[user2]) stats[user2] = { victorias: 0, derrotas: 0 };

    const historialDiv = document.getElementById("historial_stats");
    if (!historialDiv) return;

    historialDiv.innerHTML = `
        <h3 class="historial-title">📊 Estadísticas del Combate 🏆</h3>
        <div class="stat-player-box">
            <span class="stat-username stat-user1">${user1}</span>: 
            <span class="stat-victorias">${stats[user1].victorias}</span> Victorias | 
            <span class="stat-derrotas">${stats[user1].derrotas}</span> Derrotas
        </div>
        <div class="stat-player-box">
            <span class="stat-username stat-user2">${user2}</span>: 
            <span class="stat-victorias">${stats[user2].victorias}</span> Victorias | 
            <span class="stat-derrotas">${stats[user2].derrotas}</span> Derrotas
        </div>
    `;

    // Mostrar el recuadro de historial una vez que se inicia la batalla
    historialDiv.classList.remove('d-none');
};

const registrarResultado = (ganador, perdedor) => {
    // Asegurarse de que las claves existen
    if (!stats[ganador]) stats[ganador] = { victorias: 0, derrotas: 0 };
    if (!stats[perdedor]) stats[perdedor] = { victorias: 0, derrotas: 0 };

    stats[ganador].victorias++;
    stats[perdedor].derrotas++;

    // Actualizar la visualización inmediatamente después del registro
    actualizarHistorialDisplay(player1.username, player2.username);
};

// rutas de las imagenes con respectivo mensaje de cada personaje
const accionesPersonaje = {
    "Veguito": { "basico": { img: "veguito/basico.png", msj: "¡Muere, insecto!" }, "especial": { img: "veguito/especial.png", msj: "¡Big Bang Attack!" }, "semilla": { img: "veguito/curar.png", msj: "He recuperado mi poder" }, "ki": { img: "veguito/energia.png", msj: "¡AAAAhh!" }, },
    "Trunks": { "basico": { img: "trunks/basico.png", msj: "¡Esto se acabó!" }, "especial": { img: "trunks/especial.png", msj: "Burning Attack!" }, "semilla": { img: "trunks/curar.png", msj: "¡Estoy como nuevo!" }, "ki": { img: "trunks/energia.png", msj: "¡Mi energía crece!" }, },
    "Goku": { "basico": { img: "goku/basico.png", msj: "¡Toma esto!" }, "especial": { img: "goku/especial.png", msj: "¡Kamehameha!" }, "semilla": { img: "goku/curar.png", msj: "He recuperado mi poder" }, "ki": { img: "goku/energia.png", msj: "¡Kaioken!" }, },
    "Gohan": { "basico": { img: "gohan/basico.png", msj: "¡Te arrepentirás!" }, "especial": { img: "gohan/especial.png", msj: "¡Masenko!" }, "semilla": { img: "gohan/curar.png", msj: "¡Vuelvo al 100%!" }, "ki": { img: "gohan/energia.png", msj: "¡Despertar de poder!" }, },
    "Bills": { "basico": { img: "Bills/basico.png", msj: "¡Hakai!" }, "especial": { img: "Bills/especial.png", msj: "¡Es hora de la destrucción!" }, "semilla": { img: "Bills/curar.png", msj: "¡El Dios de la Destrucción no puede caer!" }, "ki": { img: "Bills/energia.png", msj: "¡Qué aburrido!" }, },
    "Veguetta": { "basico": { img: "veguetta/basico.png", msj: "¡Basura!" }, "especial": { img: "veguetta/especial.png", msj: "¡Final Flash!" }, "semilla": { img: "veguetta/curar.png", msj: "¡Maldita sea!" }, "ki": { img: "veguetta/energia.png", msj: "¡El príncipe tiene energía!" }, },
    "Pikoro": { "basico": { img: "pikoro/basico.png", msj: "¡Recibe mi ataque!" }, "especial": { img: "pikoro/especial.png", msj: "¡Makankosappo!" }, "semilla": { img: "pikoro/curar.png", msj: "¡El señor Pikoro vuelve!" }, "ki": { img: "pikoro/energia.png", msj: "¡Concentración!" }, },
    "Gogueta": { "basico": { img: "gogueta/basico.png", msj: "¡Es hora de la diversión!" }, "especial": { img: "gogueta/especial.png", msj: "¡Stardust Breaker!" }, "semilla": { img: "gogueta/curar.png", msj: "¡Fusión completa!" }, "ki": { img: "gogueta/energia.png", msj: "¡Máximo poder!" }, },
    "Cell": { "basico": { img: "cell/basico.png", msj: "¡Muereee insecto!" }, "especial": { img: "cell/especial.png", msj: "¡Te voy a destrozar!" }, "semilla": { img: "cell/curar.png", msj: "He recuperado mi poder" }, "ki": { img: "cell/energia.png", msj: "¡AAAAhh!" }, },
    "Majinboo": { "basico": { img: "Majinboo/basico.png", msj: "¡Yo te comeré!" }, "especial": { img: "Majinboo/especial.png", msj: "¡Candy Beam!" }, "semilla": { img: "Majinboo/curar.png", msj: "¡Me recupero y vuelvo a atacar!" }, "ki": { img: "Majinboo/energia.png", msj: "¡Buu carga poder!" }, }
}

// Función de alerta (sweetalert)
const alertaAtk = (personajeNombre, accion) => {
    const datosAccion = accionesPersonaje[personajeNombre][accion];
    if (!datosAccion) return;

    Swal.fire({
        title: datosAccion.msj,
        customClass: {
            title: 'attack-message'
        },
        imageUrl: `./public/img/${datosAccion.img}`,
        imageWidth: 400,
        imageHeight: 400,
        background: "none",
        backdrop: ` rgba(13, 13, 14, 0.89) `,
        showConfirmButton: false,
        timer: 1500
    });
}


// CONTROL DE TURNO. '1' significa turno de Player 1.
let currentTurn = 1;

// Selectores
let btn_py1 = document.getElementById("btn_py1");
let btn_py2 = document.getElementById("btn_py2");
let seleccion1 = document.getElementById("seleccion_personaje_py1");
let seleccion2 = document.getElementById("seleccion_personaje_py2");
const seleccionJugadoresDiv = document.getElementById("seleccion_jugadores");
const batallaDiv = document.getElementById("batalla");
const historialDiv = document.getElementById("historial_stats"); // Historial Div

// Obtener todos los botones de acción para ambos jugadores
const btns_py1 = [document.getElementById("btn_atk_basico1"), document.getElementById("btn_atk_especial1"), document.getElementById("btn_semilla1"), document.getElementById("btn_cargarki1")];
const btns_py2 = [document.getElementById("btn_atk_basico2"), document.getElementById("btn_atk_especial2"), document.getElementById("btn_semilla2"), document.getElementById("btn_cargarki2")];

// Variable para controlar si el combate ha terminado
let gameOver = false;

// FUNCIÓN PARA HABILITAR/DESHABILITAR BOTONES DE ACCIÓN
const toggleTurnButtons = () => {
    if (gameOver) {
        [...btns_py1, ...btns_py2].forEach(btn => btn.disabled = true);
        return;
    }
    const enable1 = currentTurn === 1;
    const enable2 = currentTurn === 2;

    btns_py1.forEach(btn => btn.disabled = !enable1);
    btns_py2.forEach(btn => btn.disabled = !enable2);
}

// FUNCIÓN PARA CAMBIAR EL TURNO
const endTurn = () => {
    if (gameOver) return;

    currentTurn = currentTurn === 1 ? 2 : 1;

    toggleTurnButtons();
    console.log(`Es turno del Jugador ${currentTurn}`);
}

// FUNCIÓN PARA GESTIONAR EL FINAL DEL COMBATE
const checkGameOver = () => {
    let ganador = null;
    let perdedor = null;

    if (player1.getVida() <= 0) {
        ganador = player2.username;
        perdedor = player1.username;
    } else if (player2.getVida() <= 0) {
        ganador = player1.username;
        perdedor = player2.username;
    }

    if (ganador) {
        gameOver = true;
        toggleTurnButtons();

        // Registrar el resultado antes de mostrar la alerta
        registrarResultado(ganador, perdedor);

        Swal.fire({
            title: `¡Fin del Combate!`,
            html: `¡El ganador es **${ganador}**! <br> **${perdedor}** ha llegado al 0% de vida.`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Revancha',
            cancelButtonText: 'Seleccionar otro personaje',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Opción: Revancha 
                cambiarFondoAleatorio();

                player1.resetStats();
                player2.resetStats();
                actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
                actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");

                currentTurn = 1;
                gameOver = false;
                toggleTurnButtons();
                Swal.fire('Revancha', '¡El combate ha sido reiniciado!', 'info');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Opción: Seleccionar otro personaje 

                // Quitar fondo aleatorio y restaurar el por defecto (arena-1)
                document.body.classList.forEach(clase => {
                    if (ARENA_FONDOS.includes(clase)) {
                        document.body.classList.remove(clase);
                    }
                });
                document.body.classList.add('arena-1');

                batallaDiv.classList.add("d-none");
                seleccionJugadoresDiv.classList.remove("d-none");
                // Ocultar el historial al volver a la selección
                historialDiv.classList.add('d-none');

                player1 = null;
                player2 = null;
                personaje1 = "";
                personaje2 = "";
                currentTurn = 1;
                gameOver = false;

                document.getElementById("jugador1").classList.remove("d-none");
                document.getElementById("jugador2").classList.remove("d-none");

                // Limpiar inputs y displays
                document.getElementById("username_py1").value = '';
                document.getElementById("username_py2").value = '';
                document.getElementById("nombre_personaje1").innerText = '';
                document.getElementById("nombre_personaje2").innerText = '';
                document.getElementById("username1").innerText = '';
                document.getElementById("username2").innerText = '';
                document.getElementById("img_personaje1").src = '';
                document.getElementById("img_personaje2").src = '';

                // Restaurar colores de botones
                seleccion1.querySelectorAll("button").forEach(btn => {
                    btn.classList.remove("btn-warning");
                    btn.classList.add("btn-danger");
                });
                seleccion2.querySelectorAll("button").forEach(btn => {
                    btn.classList.remove("btn-warning");
                    btn.classList.add("btn-primary");
                });

                Swal.fire('Nuevo Juego', 'Regresando a la pantalla de selección de personaje.', 'info');
            }
        });
    }
}

// Función auxiliar para cambiar el color de selección
const cambiarSeleccion = (botones, seleccionado, color) => {
    botones.forEach(btn => {
        const img = btn.querySelector("img");
        const currentTitle = img ? img.title : btn.title;

        if (currentTitle === seleccionado) {
            btn.classList.remove(color);
            btn.classList.add("btn-warning");
        } else {
            btn.classList.remove("btn-warning");
            btn.classList.add(color);
        }
    });
}

// Player 1 selección listener
if (seleccion1) {
    seleccion1.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", (evento) => {
            let title = evento.target.title || (evento.target.tagName === 'IMG' ? evento.target.title : evento.target.closest('button').title);

            if (title) {
                cambiarSeleccion(seleccion1.querySelectorAll("button"), title, "btn-danger");
                personaje1 = title;
            }
        });
    });
}

// Player 2 selección listener
if (seleccion2) {
    seleccion2.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", (evento) => {
            let title = evento.target.title || (evento.target.tagName === 'IMG' ? evento.target.title : evento.target.closest('button').title);

            if (title) {
                cambiarSeleccion(seleccion2.querySelectorAll("button"), title, "btn-primary");
                personaje2 = title;
            }
        });
    });
}

const ocultarSeleccion1 = () => {
    if (player1 && personaje1) {
        document.getElementById("jugador1").classList.add("d-none");
        document.getElementById("nombre_personaje1").innerText = personaje1;
    }
}
const ocultarSeleccion2 = () => {
    if (player2 && personaje2) {
        document.getElementById("jugador2").classList.add("d-none");
        document.getElementById("nombre_personaje2").innerText = personaje2;
    }
}

const mostrarBatalla = () => {
    if (player1 !== null && personaje1 !== "" && player2 !== null && personaje2 !== "") {
        // Cambiar fondo aleatorio antes de mostrar la batalla
        cambiarFondoAleatorio();

        batallaDiv.classList.remove("d-none");
        seleccionJugadoresDiv.classList.add("d-none");

        toggleTurnButtons();
    }
}

// Botón aceptar Player 1
btn_py1.addEventListener("click", () => {
    let user_py1 = document.getElementById("username_py1").value.trim();
    if (user_py1 === "") {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El nombre no puede estar vacío' });
        return;
    }
    if (personaje1 === "") {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Debe seleccionar un personaje' });
        return;
    }

    player1 = new Game(user_py1);
    document.getElementById("username1").innerText = user_py1;
    const ext1 = 'png';
    document.getElementById("img_personaje1").src = `./public/img/${personaje1}/base.${ext1}`;
    actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
    ocultarSeleccion1();
    mostrarBatalla();

    if (player2) {
        actualizarHistorialDisplay(player1.username, player2.username);
    }
});

// Botón aceptar Player 2
btn_py2.addEventListener("click", () => {
    let user_py2 = document.getElementById("username_py2").value.trim();
    if (user_py2 === "") {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El nombre no puede estar vacío' });
        return;
    }
    if (personaje2 === "") {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Debe seleccionar un personaje' });
        return;
    }

    player2 = new Game(user_py2);
    document.getElementById("username2").innerText = user_py2;
    const ext2 = 'png';
    document.getElementById("img_personaje2").src = `./public/img/${personaje2}/base.${ext2}`;
    actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
    ocultarSeleccion2();
    mostrarBatalla();

    if (player1) {
        actualizarHistorialDisplay(player1.username, player2.username);
    }
});

// --- FUNCIONES AUXILIARES PARA ACTUALIZAR BARRAS ---
const actualizarBarrasJugador = (player, vidaId, energiaId, kiId) => {
    // Asume que MAX_STAT es una propiedad de la clase Game, con un fallback de 1000
    const MAX_STAT = player.MAX_STAT || 1000;

    const updateBar = (id, currentValue, spanClass) => {
        const barElement = document.getElementById(id);
        const safeValue = Math.max(0, currentValue);
        const percentage = (safeValue / MAX_STAT) * 100;

        const valorSpan = barElement.querySelector(`.${spanClass}`);
        if (valorSpan) {
            valorSpan.innerHTML = `${safeValue} (${percentage.toFixed(0)}%)`;
        }

        barElement.style.width = `${percentage}%`;
        barElement.setAttribute('aria-valuenow', safeValue);
    };

    updateBar(vidaId, player.getVida(), 'vida-valor');
    updateBar(energiaId, player.getEnergia(), 'energia-valor');
    updateBar(kiId, player.getKi(), 'ki-valor');
}

// --- LÓGICA DE ACCIONES (LISTENERS) ---

// Player 1 Actions
document.getElementById("btn_atk_basico1").addEventListener("click", () => {
    if (currentTurn !== 1) return;
    if (player1.atk_basic(player2)) {
        alertaAtk(personaje1, "basico");
        actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
        actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
        checkGameOver();
        endTurn();
    } else {
        Swal.fire({ icon: 'error', title: '¡Error!', text: `${personaje1} no tiene suficiente Ki/Energía para un ataque básico.` });
    }
});

document.getElementById("btn_atk_especial1").addEventListener("click", () => {
    if (currentTurn !== 1) return;
    if (player1.atk_especial(player2)) {
        alertaAtk(personaje1, "especial");
        actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
        actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
        checkGameOver();
        endTurn();
    } else {
        Swal.fire({ icon: 'error', title: '¡Error!', text: `${personaje1} no tiene suficiente Ki para un ataque especial.` });
    }
});

document.getElementById("btn_semilla1").addEventListener("click", () => {
    if (currentTurn !== 1) return;
    if (player1.semilla()) {
        alertaAtk(personaje1, "semilla");
        actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
        endTurn();
    }
});

document.getElementById("btn_cargarki1").addEventListener("click", () => {
    if (currentTurn !== 1) return;
    if (player1.cargarKi()) {
        alertaAtk(personaje1, "ki");
        actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
        endTurn();
    }
});

// Player 2 Actions
document.getElementById("btn_atk_basico2").addEventListener("click", () => {
    if (currentTurn !== 2) return;
    if (player2.atk_basic(player1)) {
        alertaAtk(personaje2, "basico");
        actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
        actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
        checkGameOver();
        endTurn();
    } else {
        Swal.fire({ icon: 'error', title: '¡Error!', text: `${personaje2} no tiene suficiente Ki/Energía para un ataque básico.` });
    }
});

document.getElementById("btn_atk_especial2").addEventListener("click", () => {
    if (currentTurn !== 2) return;
    if (player2.atk_especial(player1)) {
        alertaAtk(personaje2, "especial");
        actualizarBarrasJugador(player1, "vida1", "energia1", "ki1");
        actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
        checkGameOver();
        endTurn();
    } else {
        Swal.fire({ icon: 'error', title: '¡Error!', text: `${personaje2} no tiene suficiente Ki para un ataque especial.` });
    }
});

document.getElementById("btn_semilla2").addEventListener("click", () => {
    if (currentTurn !== 2) return;
    if (player2.semilla()) {
        alertaAtk(personaje2, "semilla");
        actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
        endTurn();
    }
});

document.getElementById("btn_cargarki2").addEventListener("click", () => {
    if (currentTurn !== 2) return;
    if (player2.cargarKi()) {
        alertaAtk(personaje2, "ki");
        actualizarBarrasJugador(player2, "vida2", "energia2", "ki2");
        endTurn();
    }
});