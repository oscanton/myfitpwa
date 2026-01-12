/* =========================================
   core/date.js - UTILIDADES DE FECHAS
   ========================================= */

const DATE_UTILS = {
    getCurrentDayName: () => {
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return dias[new Date().getDay()];
    }
};
