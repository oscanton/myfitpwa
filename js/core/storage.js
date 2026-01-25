/* =========================================
   core/storage.js - PERSISTENCIA (LocalStorage)
   ========================================= */

const DB = {
    save: (key, value) => localStorage.setItem(APP_PREFIX + key, JSON.stringify(value)),
    get: (key, defaultValue = null) => {
        const data = localStorage.getItem(APP_PREFIX + key);
        return data ? JSON.parse(data) : defaultValue;
    },
    clearAll: () => {
        if (confirm("¿Borrar todos los datos de la aplicación?")) {
            Object.keys(localStorage).forEach(k => k.startsWith(APP_PREFIX) && localStorage.removeItem(k));
            location.reload();
        }
    }
};

// Exponer DB globalmente (necesario para onclick="DB.clearAll()" en control.html)
window.DB = DB;
