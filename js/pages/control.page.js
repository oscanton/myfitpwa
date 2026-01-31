/* =========================================
   pages/control.page.js - CONTROL DE PESO
   ========================================= */

function renderControlPage() {
    const container = document.getElementById('control-container');
    if (!container) return;

    container.classList.add('layout-container');

    // 1. Obtener Datos
    let history = DB.get('weight_history', []);
    
    // Normalización de datos antiguos (si existen con hora) a formato YYYY-MM-DD
    history = history.map(h => {
        if (h.date.includes('T')) {
            return { ...h, date: h.date.split('T')[0] };
        }
        return h;
    });

    // Ordenar por fecha (más reciente primero) para la tabla
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Fecha por defecto: Hoy
    const today = new Date().toISOString().split('T')[0];

    // Peso por defecto: Último registrado
    const lastWeight = history.length > 0 ? history[0].weight : '';

    // 2. Renderizar Estructura
    container.innerHTML = `
        <div class="card">
            <h2>Nuevo Registro</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div>
                    <label class="text-label" style="display:block; margin-bottom:6px;">Fecha</label>
                    <input type="date" id="new-date" class="input-base" value="${today}">
                </div>
                <div>
                    <label class="text-label" style="display:block; margin-bottom:6px;">Peso (kg)</label>
                    <input type="number" id="new-weight" class="input-base" step="0.1" placeholder="0.0" value="${lastWeight}">
                </div>
            </div>
            <div class="text-center">
                <button id="btn-add-weight" class="btn-back" style="cursor:pointer">💾 Guardar</button>
            </div>
        </div>

        <div class="card mt-lg">
            <h2>Historial</h2>
            <div class="table-scroller">
                <table class="menu-table">
                    <thead>
                        <tr>
                            <th style="text-align:left">Fecha</th>
                            <th style="text-align:center">Peso</th>
                            <th style="text-align:right">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="weight-history-body"></tbody>
                </table>
            </div>
        </div>

        <div class="card mt-lg">
            <h2>Evolución</h2>
            <div class="chart-box">
                <canvas id="weightChart"></canvas>
            </div>
        </div>
        
        <div class="text-center mt-lg">
            <button class="btn-back" onclick="DB.clearAll()" style="cursor:pointer">🗑️ Borrar Todo</button>
        </div>
    `;

    // 3. Renderizar Componentes
    renderWeightChart(history);
    renderHistoryTable(history);

    // 4. Eventos
    document.getElementById('btn-add-weight').addEventListener('click', () => {
        const dateVal = document.getElementById('new-date').value;
        const weightVal = parseFloat(document.getElementById('new-weight').value);
        
        if (dateVal && weightVal > 0) {
            // Verificar si ya existe registro para esa fecha
            const existingIndex = history.findIndex(h => h.date === dateVal);
            
            if (existingIndex >= 0) {
                if (!confirm(`Ya existe un registro para el ${dateVal}. ¿Deseas sobrescribirlo?`)) return;
                history[existingIndex].weight = weightVal;
            } else {
                history.push({ date: dateVal, weight: weightVal });
            }
            
            // Ordenar y guardar
            history.sort((a, b) => new Date(b.date) - new Date(a.date));
            DB.save('weight_history', history);
            
            // Actualizar Perfil de Usuario (Sincronización) si es la fecha más reciente
            // Al estar ordenado descendente, el índice 0 es el más reciente
            if (history[0].date === dateVal) {
                const profile = DB.get('user_profile', {});
                profile.weight = weightVal;
                DB.save('user_profile', profile);
            }

            // Recargar página
            renderControlPage();
        } else {
            alert("Por favor, introduce una fecha y un peso válido.");
        }
    });
}

function renderHistoryTable(history) {
    const tbody = document.getElementById('weight-history-body');
    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted" style="padding:20px">Sin registros aún</td></tr>';
        return;
    }
    
    tbody.innerHTML = history.map((entry, index) => {
        const dateStr = entry.date;
        
        return `
            <tr>
                <td style="text-align:left">${dateStr}</td>
                <td style="text-align:center"><strong>${entry.weight}</strong> kg</td>
                <td style="text-align:right">
                    <button class="btn-delete-entry" data-index="${index}" style="background:none; border:none; cursor:pointer; font-size:1.2rem;">❌</button>
                </td>
            </tr>
        `;
    }).join('');

    // Listeners para borrar entradas individuales
    tbody.querySelectorAll('.btn-delete-entry').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(confirm('¿Borrar este registro?')) {
                const idx = parseInt(e.target.dataset.index);
                history.splice(idx, 1);
                DB.save('weight_history', history);
                renderControlPage();
            }
        });
    });
}

function renderWeightChart(history) {
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;

    // Ajustar resolución del canvas
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar
    ctx.clearRect(0, 0, width, height);

    if (history.length < 2) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Añade al menos 2 registros para ver la gráfica", width/2, height/2);
        return;
    }

    // Preparar datos (Orden cronológico para la gráfica: antiguo -> nuevo)
    const data = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Escalas
    const weights = data.map(d => d.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const range = maxW - minW || 1;
    
    const padding = 40;
    const graphWidth = width - (padding * 2);
    const graphHeight = height - (padding * 2);

    // Dibujar Línea
    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 209, 102)"; // var(--color-primary)
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";

    data.forEach((d, i) => {
        const x = padding + (i / (data.length - 1)) * graphWidth;
        const y = height - padding - ((d.weight - minW) / range) * graphHeight;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Puntos
        ctx.fillStyle = "#fff";
        ctx.fillRect(x - 3, y - 3, 6, 6);
        
        // Etiquetas (solo primero y último para no saturar)
        if (i === 0 || i === data.length - 1) {
            ctx.fillStyle = "#fff";
            ctx.font = "12px sans-serif";
            ctx.fillText(`${d.weight}kg`, x - 10, y - 15);
            
            // Fecha en eje X
            const [year, month, day] = d.date.split('-');
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText(`${day}/${month}`, x - 15, height - 10);
        }
    });
    ctx.stroke();
}