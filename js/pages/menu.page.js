/* =========================================
   pages/menu.page.js - MENÚ SEMANAL
   ========================================= */

function renderMenuPage() {
    const tableBody = document.getElementById("menu-body");
    if (!tableBody) return;

    let isEditMode = false;

    // --- 1. Selector de Datos (Dropdown) ---
    // Buscamos el contenedor principal para insertar el selector
    let container = document.getElementById('menu-container');
    if (!container) {
        const table = tableBody.closest('table');
        if (table) container = table.parentElement;
    }

    // Limitar ancho igual que las otras páginas
    if (container) {
        container.classList.add('layout-container');
    }

    // --- Helpers Locales ---
    // NOTA: Idealmente, `calculateMeal` debería estar en un módulo central como `core/formulas.js`
    // para ser reutilizado en otras partes de la aplicación.
    const NUTRITION = {
        calculateMeal: (items) => {
            const total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
            if (!items || !Array.isArray(items)) return total;
            
            items.forEach(item => {
                // Verificar que FOODS existe y el alimento también
                if (typeof FOODS === 'undefined') {
                    // Error logueado en renderTableContent para no saturar
                    return;
                }
                const food = FOODS[item.foodId];
                if (!food) {
                    console.warn(`Alimento no encontrado: ${item.foodId}`);
                    return;
                }
                
                let ratio = 0;
                if (food.nutritionPer100) {
                    ratio = item.amount / 100;
                    total.kcal += food.nutritionPer100.kcal * ratio;
                    total.protein += food.nutritionPer100.protein * ratio;
                    total.carbs += food.nutritionPer100.carbs * ratio;
                    total.fat += food.nutritionPer100.fat * ratio;
                } else if (food.nutritionPerUnit) {
                    ratio = item.amount;
                    total.kcal += food.nutritionPerUnit.kcal * ratio;
                    total.protein += food.nutritionPerUnit.protein * ratio;
                    total.carbs += food.nutritionPerUnit.carbs * ratio;
                    total.fat += food.nutritionPerUnit.fat * ratio;
                }
            });
            return total;
        }
    };

    const getStatusClass = (current, target) => {
        if (!target || target === 0) return '';
        const pct = (current / target) * 100;
        if (pct > 110) return 'text-status--danger'; 
        if (pct < 90) return 'text-status--warning'; 
        return 'text-status--ok'; 
    };


    let currentFile = DB.get('selected_menu_file', 'menu.js');

    // --- Función para Cargar Datos (Hot-Swap) ---
    const loadMenuData = (fileName) => {
        const isInViews = window.location.pathname.includes('/views/');
        const basePath = isInViews ? '../js/data/' : 'js/data/';
        const scriptPath = `${basePath}${fileName}?v=${Date.now()}`;
        const scriptId = 'dynamic-menu-data';
        
        // Eliminar script anterior para forzar recarga limpia
        const oldScript = document.getElementById(scriptId);
        if (oldScript) oldScript.remove();

        // Limpiar explícitamente para evitar datos antiguos si falla la carga
        window.MENU_DATA = undefined;

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = scriptPath;
        
        script.onload = () => {
            // Restaurar datos guardados si existen para este archivo
            const savedData = DB.get(`menu_data_${fileName}`, null);
            if (savedData) {
                window.MENU_DATA = savedData;
            }
            setTimeout(renderTableContent, 50);
        };
        
        script.onerror = () => {
            tableBody.innerHTML = `<tr><td colspan="3" class="text-status--danger text-center">Error cargando ${fileName}</td></tr>`;
        };
        
        document.body.appendChild(script);
    };

    // --- Botones de Control (Debajo de la tabla) ---
    if (container && !document.getElementById('menu-controls-container')) {
        const btnContainer = document.createElement('div');
        btnContainer.id = 'menu-controls-container';
        btnContainer.className = 'text-center mt-lg';
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.gap = '12px';
        
        // Botón Editar
        const editBtn = document.createElement('button');
        editBtn.id = 'menu-edit-btn';
        editBtn.className = 'btn-back'; // Estilo unificado
        editBtn.style.cursor = 'pointer';
        editBtn.innerHTML = '✏️ Editar';
        
        editBtn.onclick = () => {
            isEditMode = !isEditMode;
            editBtn.innerHTML = isEditMode ? '✅ Listo' : '✏️ Editar';
            
            if (isEditMode) {
                editBtn.style.background = 'rgba(255, 209, 102, 0.2)';
                editBtn.style.borderColor = 'var(--color-primary)';
            } else {
                editBtn.style.background = '';
                editBtn.style.borderColor = '';
            }
            renderTableContent();
        };

        // Botón Restablecer
        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn-back';
        resetBtn.style.cursor = 'pointer';
        resetBtn.innerHTML = '🔄 Reset';
        resetBtn.onclick = () => {
            if (confirm("¿Restablecer el menú original? Se perderán los cambios.")) {
                localStorage.removeItem(APP_PREFIX + `menu_data_${currentFile}`);
                if (isEditMode) {
                    isEditMode = false;
                    editBtn.innerHTML = '✏️ Editar';
                    editBtn.style.background = '';
                    editBtn.style.borderColor = '';
                }
                loadMenuData(currentFile);
            }
        };

        // Botón Modo Ancho
        const wideBtn = document.createElement('button');
        wideBtn.className = 'btn-back';
        wideBtn.style.cursor = 'pointer';
        wideBtn.innerHTML = '↔️ Ancho';
        
        let isWideMode = false;
        wideBtn.onclick = () => {
            isWideMode = !isWideMode;
            if (isWideMode) {
                container.classList.remove('layout-container');
                wideBtn.innerHTML = '📱 Normal';
                wideBtn.style.background = 'rgba(255, 209, 102, 0.2)';
                wideBtn.style.borderColor = 'var(--color-primary)';
            } else {
                container.classList.add('layout-container');
                wideBtn.innerHTML = '↔️ Ancho';
                wideBtn.style.background = '';
                wideBtn.style.borderColor = '';
            }
        };

        btnContainer.appendChild(editBtn);
        btnContainer.appendChild(resetBtn);
        btnContainer.appendChild(wideBtn);
        container.after(btnContainer);
    }

    // Helper para generar HTML de totales (usado en render y update)
    const generateTotalsHtml = (dayTotals, target) => {
        const tKcal = target ? target.kcal : 0;
        const tProt = target ? target.protein : 0;
        const tCarb = target ? target.carbs : 0;
        const tFat  = target ? target.fat : 0;

        const classKcal = getStatusClass(dayTotals.kcal, tKcal);
        const classProt = getStatusClass(dayTotals.protein, tProt);
        const classCarb = getStatusClass(dayTotals.carbs, tCarb);
        const classFat  = getStatusClass(dayTotals.fat, tFat);

        return `
            <div class="day-total__main-value">
                <span class="${classKcal}">${Math.round(dayTotals.kcal)}</span>
                <span class="day-total__target-value"> / ${tKcal}</span>
            </div>
            <div class="day-total__label">Kcal Totales</div>

            <div class="day-total__macros">
                <div>
                    P: <span class="${classProt}">${Math.round(dayTotals.protein)}</span>
                    <span class="day-total__target-value"> / ${tProt}</span>
                </div>
                <div>
                    C: <span class="${classCarb}">${Math.round(dayTotals.carbs)}</span>
                    <span class="day-total__target-value"> / ${tCarb}</span>
                </div>
                <div>
                    G: <span class="${classFat}">${Math.round(dayTotals.fat)}</span>
                    <span class="day-total__target-value"> / ${tFat}</span>
                </div>
            </div>`;
    };

    // --- 2. Lógica de Renderizado (Encapsulada) ---
    const renderTableContent = () => {
        // Asegurar que MENU_DATA existe
        if (typeof window.MENU_DATA === 'undefined') {
            console.error("Error: MENU_DATA no está definido.");
            tableBody.innerHTML = `<tr><td colspan="3" style="color:var(--color-danger)">Error: MENU_DATA no disponible.</td></tr>`;
            return;
        }

        const storedTargets = DB.get(
            'daily_nutrition_targets',
            (typeof DAILY_NUTRITION_TARGETS !== 'undefined' ? DAILY_NUTRITION_TARGETS : {})
        );

        const currentData = window.MENU_DATA;

        // Calcular índice del día actual (Lunes=0, ..., Domingo=6)
        const todayIndex = (new Date().getDay() + 6) % 7;

        // 0. Actualizar Cabecera (Días en columnas)
        const table = tableBody.closest('table');
        const thead = table.querySelector('thead');
        if (thead) {
            // Mover Selector al H1
            const h1 = document.querySelector('h1');
            if (h1) {
                // Flexbox para alineación vertical centrada
                h1.style.display = 'flex';
                h1.style.justifyContent = 'center';
                h1.style.alignItems = 'center';
                h1.style.gap = '12px';

                let selectWrapper = document.getElementById('menu-select-wrapper');
                if (!selectWrapper) {
                    selectWrapper = document.createElement('span');
                    selectWrapper.id = 'menu-select-wrapper';
                    h1.appendChild(selectWrapper);
                }

                const options = AVAILABLE_MENUS.map(m => 
                    `<option value="${m.file}" ${m.file === currentFile ? 'selected' : ''}>${m.label}</option>`
                ).join('');
                
                // Estilo ajustado para estar inline en el título
                selectWrapper.innerHTML = `<select id="menu-select" class="input-base input-select" style="width:auto; font-size:0.5em; padding:4px 24px 4px 8px;">${options}</select>`;

                // Event Listener
                const select = document.getElementById('menu-select');
                if (select) {
                    select.addEventListener('change', (e) => {
                        const newFile = e.target.value;
                        currentFile = newFile;
                        DB.save('selected_menu_file', newFile);
                        loadMenuData(newFile);
                    });
                }
            }

            // Celda vacía en la esquina
            let headerHtml = `<tr><th class="menu-row-header" style="padding: var(--space-xs);"></th>`;
            currentData.forEach((day, index) => {
                const isToday = index === todayIndex;
                const activeClass = isToday ? 'text-status--ok' : '';
                headerHtml += `<th class="${activeClass}">${day.dia}</th>`;
            });
            headerHtml += '</tr>';
            thead.innerHTML = headerHtml;
        }

        tableBody.innerHTML = "";
        const meals = ['desayuno', 'comida', 'cena'];
        const mealLabels = { 'desayuno': 'Desayuno', 'comida': 'Comida', 'cena': 'Cena' };

        // Determinar comida activa según la hora
        const currentHour = new Date().getHours();
        let activeMeal = null;
        if (currentHour >= 6 && currentHour < 12) activeMeal = 'desayuno';
        else if (currentHour >= 12 && currentHour < 18) activeMeal = 'comida';
        else if (currentHour >= 18) activeMeal = 'cena';

        try {
            // 1. Filas de Comidas (Transpuesto)
            meals.forEach(mealKey => {
                const row = document.createElement("tr");
                const isActive = mealKey === activeMeal;
                const activeClass = isActive ? 'text-status--ok' : '';
                let html = `<td class="menu-row-header ${activeClass}">${mealLabels[mealKey]}</td>`;

                currentData.forEach((day, dayIndex) => {
                    const mealData = day[mealKey];
                    const nut = NUTRITION.calculateMeal(mealData.items);

                    html += `
                        <td>
                            <ul class="meal-list">
                                ${mealData.items.map((i, itemIndex) => {
                                    const f = FOODS[i.foodId];
                                    let amountHtml;
                                    if (isEditMode) {
                                        amountHtml = `<input type="text" inputmode="decimal" value="${i.amount}" 
                                            class="input-base input-base--table-edit" 
                                            data-day="${dayIndex}" data-meal="${mealKey}" data-item="${itemIndex}">`;
                                    } else {
                                        amountHtml = `<span>${i.amount}</span>`;
                                    }
                                    return `<li class="meal-item">
                                        <span class="meal-item__name food-info-trigger" data-food-id="${i.foodId}">${f ? f.name : i.foodId}</span>
                                        <div class="meal-item__amount">
                                            ${amountHtml}
                                            <span class="meal-item__unit">${f ? f.unit : ''}</span>
                                        </div>
                                    </li>`;
                                }).join('')}
                            </ul>
                            <div class="meal-macros" id="macros-${dayIndex}-${mealKey}">
                                <span class="text-primary">${Math.round(nut.kcal)} kcal</span> |
                                P: ${Math.round(nut.protein)} | C: ${Math.round(nut.carbs)} | G: ${Math.round(nut.fat)}
                            </div>
                            <div class="meal-description">
                                ${mealData.description || ''}
                            </div>
                        </td>`;
                });
                row.innerHTML = html;
                tableBody.appendChild(row);
            });

            // 2. Fila de Totales
            const totalsRow = document.createElement("tr");
            let totalsHtml = `<td class="menu-row-header">Totales</td>`;
            
            currentData.forEach((day, dayIndex) => {
                const dayTotals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
                meals.forEach(mk => {
                    const n = NUTRITION.calculateMeal(day[mk].items);
                    dayTotals.kcal += n.kcal;
                    dayTotals.protein += n.protein;
                    dayTotals.carbs += n.carbs;
                    dayTotals.fat += n.fat;
                });
                
                const target = storedTargets[day.dia];
                totalsHtml += `
                    <td class="day-total" id="day-totals-${dayIndex}">
                        ${generateTotalsHtml(dayTotals, target)}
                    </td>`;
            });
            totalsRow.innerHTML = totalsHtml;
            tableBody.appendChild(totalsRow);

            // 3. Scroll automático al día actual
            setTimeout(() => {
                if (table && table.parentElement) {
                    const scroller = table.parentElement;
                    // +1 porque la primera columna es el encabezado de fila
                    const targetTh = table.querySelectorAll('thead th')[todayIndex + 1];
                    const stickyTh = table.querySelector('thead th');
                    
                    if (targetTh && stickyTh) {
                        // Alinear a la izquierda justo después de la columna sticky
                        const scrollLeft = targetTh.offsetLeft - stickyTh.offsetWidth;
                        scroller.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                    }
                }
            }, 100);

        } catch (error) {
            console.error("Error renderizando el menú:", error);
            tableBody.innerHTML = `<tr><td colspan="3" class="text-status--danger text-center p-lg">Error cargando los datos: ${error.message}</td></tr>`;
        }
    };

    // --- 3. Event Delegation ---

    // A) Popup de Info Nutricional (Click en alimento)
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('food-info-trigger')) {
            const foodId = e.target.dataset.foodId;
            
            if (typeof FOODS === 'undefined') return;
            const food = FOODS[foodId];
            if (!food) return;

            // Eliminar popup previo si existe
            const existing = document.getElementById('food-popup');
            if (existing) existing.remove();

            // Determinar valores a mostrar
            let vals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
            let label = '';
            if (food.nutritionPer100) {
                vals = food.nutritionPer100;
                label = 'Valores por 100g';
            } else if (food.nutritionPerUnit) {
                vals = food.nutritionPerUnit;
                label = 'Valores por Unidad';
            }

            const modal = document.createElement('div');
            modal.id = 'food-popup';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3 class="text-primary" style="margin-top:0">${food.name}</h3>
                    <div class="text-xs text-muted mb-sm">${label}</div>
                    
                    <div class="stats-pills stats-pills--center my-sm">
                        <div class="stat-pill stat-pill--kcal" style="font-size:1.1rem">🔥 ${vals.kcal}</div>
                    </div>

                    <div class="section-group__grid" style="grid-template-columns: 1fr 1fr 1fr; gap:8px; margin-bottom:16px;">
                        <div class="card-panel" style="padding:8px"><div class="text-xs text-muted">Prot</div><div class="text-lg">🥩 ${vals.protein}</div></div>
                        <div class="card-panel" style="padding:8px"><div class="text-xs text-muted">Carb</div><div class="text-lg">🍚 ${vals.carbs}</div></div>
                        <div class="card-panel" style="padding:8px"><div class="text-xs text-muted">Grasa</div><div class="text-lg">🥑 ${vals.fat}</div></div>
                    </div>

                    <button class="btn btn--primary" style="margin-bottom:0; padding:10px">Cerrar</button>
                </div>
            `;
            
            modal.addEventListener('click', (ev) => { if (ev.target === modal || ev.target.closest('.btn')) modal.remove(); });
            document.body.appendChild(modal);
        }
    });

    // B) Inputs (Edición)
    tableBody.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.dataset.day) {
            const dayIndex = parseInt(e.target.dataset.day);
            const mealKey = e.target.dataset.meal;
            const itemIndex = parseInt(e.target.dataset.item);
            const newVal = parseFloat(e.target.value) || 0;

            // Actualizar Datos en Memoria
            if (window.MENU_DATA && window.MENU_DATA[dayIndex]) {
                window.MENU_DATA[dayIndex][mealKey].items[itemIndex].amount = newVal;

                // Guardar cambios permanentemente
                DB.save(`menu_data_${currentFile}`, window.MENU_DATA);

                // Recalcular Macros de la Comida (Feedback visual inmediato)
                const mealItems = window.MENU_DATA[dayIndex][mealKey].items;
                const mealNut = NUTRITION.calculateMeal(mealItems);
                const mealMacroDiv = document.getElementById(`macros-${dayIndex}-${mealKey}`);
                if (mealMacroDiv) {
                    mealMacroDiv.innerHTML = `
                        <span class="text-primary">${Math.round(mealNut.kcal)} kcal</span> |
                        P: ${Math.round(mealNut.protein)} | C: ${Math.round(mealNut.carbs)} | G: ${Math.round(mealNut.fat)}
                    `;
                }

                // Recalcular Totales del Día
                const dayData = window.MENU_DATA[dayIndex];
                const dayTotals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
                ['desayuno', 'comida', 'cena'].forEach(mk => {
                    const n = NUTRITION.calculateMeal(dayData[mk].items);
                    dayTotals.kcal += n.kcal;
                    dayTotals.protein += n.protein;
                    dayTotals.carbs += n.carbs;
                    dayTotals.fat += n.fat;
                });

                // Actualizar Celda de Totales
                const storedTargets = DB.get('daily_nutrition_targets', {});
                const target = storedTargets[dayData.dia];
                const totalsCell = document.getElementById(`day-totals-${dayIndex}`);
                if (totalsCell) {
                    totalsCell.innerHTML = generateTotalsHtml(dayTotals, target);
                }
            }
        }
    });

    // --- 3. Carga Dinámica del Script ---
    // Carga inicial
    loadMenuData(currentFile);
}
