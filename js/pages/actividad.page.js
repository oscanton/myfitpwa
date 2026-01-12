/* =========================================
   pages/actividad.page.js - ACTIVIDAD FÍSICA
   ========================================= */

function renderActivityPage() {
    const container = document.getElementById('actividad-container');
    if (!container) return;

    const today = DATE_UTILS.getCurrentDayName();

    ACTIVIDAD_DATA.forEach(item => {
        const div = document.createElement('div');
        div.className = `activity-card ${item.dia === today ? 'row-item--active' : ''}`;
        div.style.marginBottom = "15px";

        div.innerHTML = `
            <div class="activity-header">${item.dia} ${item.dia === today ? '(HOY)' : ''}</div>
            <div class="activity-main">${item.titulo}</div>
            <div class="text-muted">${item.ejercicios}</div>
            <div class="activity-desc">${item.explicacion}</div>
        `;

        container.appendChild(div);
    });
}
