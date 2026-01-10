/* =========================================
   main.js - LÓGICA CENTRALIZADA
   ========================================= */

const APP_PREFIX = "pwa_fit_2026_";

// --- 1. GESTIÓN DE PERSISTENCIA (LocalStorage) ---
const DB = {
    save: (key, value) => localStorage.setItem(APP_PREFIX + key, JSON.stringify(value)),
    get: (key, defaultValue = null) => {
        const data = localStorage.getItem(APP_PREFIX + key);
        return data ? JSON.parse(data) : defaultValue;
    },
    delete: (key) => localStorage.removeItem(APP_PREFIX + key),
    clearAll: () => {
        if (confirm("¿Borrar todos los datos de la aplicación?")) {
            Object.keys(localStorage).forEach(k => k.startsWith(APP_PREFIX) && localStorage.removeItem(k));
            location.reload();
        }
    }
};

// --- 2. UTILIDADES DE FECHAS ---
const DATE_UTILS = {
    getWeekNumber: (date = new Date()) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },
    getCurrentDayName: () => {
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return dias[new Date().getDay()];
    }
};

// --- 3. LÓGICA NUTRICIONAL ---
const NUTRITION = {
    calculateItem: (foodId, amount) => {
        const food = FOODS[foodId];
        if (!food) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };

        const factor = food.nutritionPer100 ? amount / 100 : amount;
        const source = food.nutritionPer100 || food.nutritionPerUnit;

        return {
            kcal: source.kcal * factor,
            protein: source.protein * factor,
            carbs: source.carbs * factor,
            fat: source.fat * factor
        };
    },
    calculateMeal: (items) => {
        return items.reduce((acc, item) => {
            const nut = NUTRITION.calculateItem(item.foodId, item.amount);
            return {
                kcal: acc.kcal + nut.kcal,
                protein: acc.protein + nut.protein,
                carbs: acc.carbs + nut.carbs,
                fat: acc.fat + nut.fat
            };
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    }
};

// --- 4. RENDERIZADORES DE PÁGINA ---

/**
 * MÓDULO: MENÚ SEMANAL (Versión Final con todos los datos)
 */
function renderMenuPage() {
    const tableBody = document.getElementById("menu-body");
    if (!tableBody) return;

    MENU_DATA.forEach(day => {
        const meals = ['desayuno', 'comida', 'cena'];
        const dayTotals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

        const row = document.createElement("tr");
        let html = `<td><strong>${day.dia}</strong></td>`;

        meals.forEach(mealKey => {
            const mealData = day[mealKey];
            const nut = NUTRITION.calculateMeal(mealData.items);
            
            // Acumular para el total diario
            dayTotals.kcal += nut.kcal; 
            dayTotals.protein += nut.protein;
            dayTotals.carbs += nut.carbs; 
            dayTotals.fat += nut.fat;

            html += `
                <td>
                    <ul class="meal-list">
                        ${mealData.items.map(i => `<li>${FOODS[i.foodId].name} <span>${i.amount}${FOODS[i.foodId].unit}</span></li>`).join('')}
                    </ul>
                    <div class="meal-macros">
                        <strong>${Math.round(nut.kcal)} kcal</strong> | P: ${Math.round(nut.protein)}g | C: ${Math.round(nut.carbs)}g | G: ${Math.round(nut.fat)}g
                    </div>
                    <div class="activity-desc" style="margin-top:5px; font-size:0.7rem; color: var(--color-text-muted);">
                        ${mealData.description}
                    </div>
                </td>`;
        });

        // --- Lógica de Formato Condicional (Semáforo) ---
        const target = DAILY_NUTRITION_TARGETS[day.dia];
        const porcentaje = (dayTotals.kcal / target.kcal) * 100;
        
        let colorClass = ""; 
        if (porcentaje < 90) {
            colorClass = "status-below"; // Blanco
        } else if (porcentaje >= 90 && porcentaje <= 110) {
            colorClass = "status-on-target"; // Verde
        } else {
            colorClass = "status-over"; // Naranja
        }

        html += `
            <td class="day-total">
                <div class="${colorClass}" style="font-size: 1.1rem; font-weight: 800; margin-bottom: 5px;">
                    ${Math.round(dayTotals.kcal)} / ${target.kcal}
                    <span style="font-size: 0.65rem; display: block; font-weight: 400; color: #fff; opacity: 0.6;">KCAL TOTALES</span>
                </div>
                <div style="font-family: monospace; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px; color: rgba(255,255,255,0.7);">
                    P: ${Math.round(dayTotals.protein)}/${target.protein}g<br>
                    C: ${Math.round(dayTotals.carbs)}/${target.carbs}g<br>
                    G: ${Math.round(dayTotals.fat)}/${target.fat}g
                </div>
            </td>`;

        row.innerHTML = html;
        tableBody.appendChild(row);
    });
}
/**
 * MÓDULO: LISTA DE LA COMPRA
 */
function renderShoppingListPage() {
    const container = document.getElementById('lista-container');
    if (!container) return;

    COMESTIBLES_DATA.categorias.forEach(cat => {
        const section = document.createElement('div');
        section.className = 'section-group';
        section.innerHTML = `<h2>${cat.nombre}</h2><div class="section-group__grid"></div>`;
        
        const grid = section.querySelector('.section-group__grid');
        cat.items.forEach(item => {
            const label = document.createElement('label');
            label.className = 'row-item';
            const isChecked = DB.get(`shop_${item.id}`, false);
            
            label.innerHTML = `
                <div class="row-item__info">
                    <span class="row-item__title">${item.titulo}</span>
                    ${item.sub ? `<span class="row-item__subtitle">${item.sub}</span>` : ''}
                </div>
                <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''}>
            `;
            
            label.querySelector('input').addEventListener('change', (e) => {
                DB.save(`shop_${item.id}`, e.target.checked);
            });
            
            grid.appendChild(label);
        });
        container.appendChild(section);
    });
}

/**
 * MÓDULO: ACTIVIDAD FÍSICA
 */
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

/**
 * MÓDULO: CONTROL DE PESO
 */
let weightChart = null; // Referencia global para actualizar el gráfico

function renderControlPage() {
    const container = document.getElementById('months-container');
    if (!container) return;

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const weightData = DB.get(`weight_${APP_CONFIG.year}`, {});

    meses.forEach((mes, index) => {
        const monthCard = document.createElement('div');
        monthCard.className = 'section-group';
        monthCard.innerHTML = `<h3>${mes}</h3><div class="stack-vertical"></div>`;
        const stack = monthCard.querySelector('.stack-vertical');

        // Generar 4 semanas por mes (simplificado)
        for (let s = 1; s <= 4; s++) {
            const weekId = (index * 4) + s;
            const row = document.createElement('div');
            row.className = 'row-item';
            
            row.innerHTML = `
                <span class="row-item__title">Semana ${s}</span>
                <input type="number" step="0.1" class="row-item__input" 
                       value="${weightData[weekId] || ''}" placeholder="0.0">
            `;

            // Guardar al escribir
            row.querySelector('input').addEventListener('input', (e) => {
                weightData[weekId] = parseFloat(e.target.value) || null;
                DB.save(`weight_${APP_CONFIG.year}`, weightData);
                updateWeightChart(weightData);
            });

            stack.appendChild(row);
        }
        container.appendChild(monthCard);
    });

    initWeightChart(weightData);
}

function initWeightChart(data) {
    const ctx = document.getElementById('weightChart').getContext('2d');
    const values = Array.from({length: 48}, (_, i) => data[i+1] || null);

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 48}, (_, i) => i + 1),
            datasets: [{
                label: 'Peso (kg)',
                data: values,
                borderColor: '#ffd166',
                backgroundColor: 'rgba(255, 209, 102, 0.1)',
                tension: 0.4,
                fill: true,
                spanGaps: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
                x: { display: false }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function updateWeightChart(data) {
    if (!weightChart) return;
    weightChart.data.datasets[0].data = Array.from({length: 48}, (_, i) => data[i+1] || null);
    weightChart.update();
}

// --- 5. INICIALIZACIÓN AUTOMÁTICA ---
window.addEventListener('DOMContentLoaded', () => {
    // Detectar en qué página estamos y ejecutar su renderizado
    if (document.getElementById('menu-body')) renderMenuPage();
    if (document.getElementById('lista-container')) renderShoppingListPage();
    if (document.getElementById('actividad-container')) renderActivityPage();
    if (document.getElementById('months-container')) renderControlPage(); // <-- Añadir esta línea
});