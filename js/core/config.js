/* =========================================
   core/config.js - CONFIGURACIÓN GLOBAL
   ========================================= */

// Prefijo para las claves de LocalStorage, para evitar colisiones.
const APP_PREFIX = "saludapp_";

// Configuración general de la aplicación
const APP_CONFIG = {
    year: new Date().getFullYear()
};

// Constantes Globales (Fuente única de verdad)
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];