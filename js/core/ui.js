/* =========================================
   core/ui.js - UTILIDADES DE UI
   ========================================= */

function getStatusClass(value, target) {
    if (!target || target === 0) return "total-low";
    const ratio = value / target;
    if (ratio < 0.9) return "total-low";  // Blanco (< 90%)
    if (ratio <= 1.1) return "total-ok"; // Verde (90% - 110%)
    return "total-high";                 // Naranja (> 110%)
}
