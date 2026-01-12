/* =========================================
   app.js - BOOTSTRAP (Inicialización)
   ========================================= */

window.addEventListener('DOMContentLoaded', () => {
    // Detectar en qué página estamos y ejecutar su renderizado
    if (document.getElementById('menu-body')) renderMenuPage();
    if (document.getElementById('lista-container')) renderShoppingListPage();
    if (document.getElementById('actividad-container')) renderActivityPage();
    if (document.getElementById('months-container')) renderControlPage();
});
