/* =========================================
   pages/control.page.js - CONTROL DE PESO
   ========================================= */

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
                const v = parseFloat(e.target.value);
                if (Number.isFinite(v)) {
                    weightData[weekId] = v;
                } else {
                    delete weightData[weekId];
                }
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
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const values = Array.from({ length: 48 }, (_, i) => data[i + 1] || null);

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 48 }, (_, i) => i + 1),
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
    weightChart.data.datasets[0].data = Array.from({ length: 48 }, (_, i) => data[i + 1] || null);
    weightChart.update();
}
