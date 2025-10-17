// Game.js
import Swal from 'sweetalert2';

// Constantes de juego
const MAX_STAT = 1000;
const COSTO_BASICO = 100;
const DANO_BASICO = 100;
const COSTO_ESPECIAL = 300;
const DANO_ESPECIAL = 350;
const KI_RECUPERADO = 200;
const ENERGIA_RECUPERADA = 150;

export default class Game {
    constructor(username) {
        this.username = username;
        this.vida = MAX_STAT;
        this.energia = MAX_STAT;
        this.ki = MAX_STAT;
        this.MAX_STAT = MAX_STAT; // Útil para validaciones
    }

    // --- Métodos de Acceso (Getters) ---
    getVida() {
        return this.vida;
    }

    getEnergia() {
        return this.energia;
    }

    getKi() {
        return this.ki;
    }

    // --- Reinicio de Estadísticas ---
    resetStats() {
        this.vida = MAX_STAT;
        this.energia = MAX_STAT;
        this.ki = MAX_STAT;
    }

    // --- Ataques ---

    /**
     * Ataque básico: Cuesta Energía o Ki y causa un daño moderado.
     * @param {Game} oponente - El jugador objetivo.
     * @returns {boolean} - Retorna true si el ataque fue exitoso, false si falló por falta de recursos.
     */
    atk_basic(oponente) {
        let costoAplicado = false;

        // 1. Prioridad: usar Energía
        if (this.energia >= COSTO_BASICO) {
            this.energia -= COSTO_BASICO;
            costoAplicado = true;
        }
        // 2. Si no hay Energía suficiente, usar Ki
        else if (this.ki >= COSTO_BASICO) {
            this.ki -= COSTO_BASICO;
            costoAplicado = true;
        }

        if (costoAplicado) {
            oponente.vida = Math.max(0, oponente.vida - DANO_BASICO);
            console.log(`${this.username} usa Ataque Básico contra ${oponente.username}. Daño: ${DANO_BASICO}`);
            return true;
        } else {
            // El front-end ya maneja la alerta de error, solo devolvemos false.
            return false;
        }
    }

    /**
     * Ataque especial: Cuesta Ki y causa un gran daño.
     * @param {Game} oponente - El jugador objetivo.
     * @returns {boolean} - Retorna true si el ataque fue exitoso, false si falló por falta de Ki.
     */
    atk_especial(oponente) {
        if (this.ki >= COSTO_ESPECIAL) {
            this.ki -= COSTO_ESPECIAL;
            oponente.vida = Math.max(0, oponente.vida - DANO_ESPECIAL);
            console.log(`${this.username} usa Ataque Especial contra ${oponente.username}. Daño: ${DANO_ESPECIAL}`);
            return true;
        } else {
            // El front-end ya maneja la alerta de error, solo devolvemos false.
            return false;
        }
    }

    // --- Habilidades ---

    /**
     * Semilla Ermitaño: Restaura la vida, energía y ki al máximo (1000).
     * @returns {boolean} - Retorna true si se usó la semilla (la vida no estaba al máximo), false si estaba al máximo.
     */
    semilla() {
        if (this.vida === this.MAX_STAT) {
            Swal.fire({ icon: 'warning', title: '¡No Necesario!', text: `${this.username} ya tiene la vida al máximo y no necesita la Semilla.` });
            return false; // No se consume el turno si no se usa
        }

        this.vida = this.MAX_STAT;
        this.energia = this.MAX_STAT;
        this.ki = this.MAX_STAT;
        console.log(`${this.username} usa Semilla Ermitaño. Stats restaurados.`);
        return true; // Se consume el turno
    }

    /**
     * Cargar Ki: Restaura una cantidad de Energía y Ki.
     * @returns {boolean} - Retorna true si se cargó Ki (no estaba todo al máximo), false si estaba todo al máximo.
     */
    cargarKi() {
        if (this.energia === this.MAX_STAT && this.ki === this.MAX_STAT) {
            Swal.fire({ icon: 'warning', title: '¡No Necesario!', text: `${this.username} ya tiene Energía y Ki al máximo.` });
            return false; // No se consume el turno si no se usa
        }

        this.energia = Math.min(this.MAX_STAT, this.energia + ENERGIA_RECUPERADA);
        this.ki = Math.min(this.MAX_STAT, this.ki + KI_RECUPERADO);
        console.log(`${this.username} carga Ki. Energía recuperada: ${ENERGIA_RECUPERADA}, Ki recuperado: ${KI_RECUPERADO}.`);
        return true; // Se consume el turno
    }
}