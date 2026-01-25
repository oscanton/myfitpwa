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

    // --- Helpers Locales (Definidos dentro para evitar conflictos de redeclaración) ---
    const NUTRITION = {
        calculateMeal: (items) => {
            let total = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
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
        if (pct > 110) return 'status-danger'; 
        if (pct < 90) return 'status-warning'; 
        return 'status-ok'; 
    };

    // Inyectar estilos para los estados si no existen
    if (!document.getElementById('menu-styles')) {
        const style = document.createElement('style');
        style.id = 'menu-styles';
        style.innerHTML = `
            .status-ok { color: var(--color-success); font-weight: bold; }
            .status-warning { color: var(--color-warning); font-weight: bold; }
            .status-danger { color: var(--color-danger); font-weight: bold; }
        `;
        document.head.appendChild(style);
    }

    // Configuración de archivos disponibles
    // NOTA: Para añadir más menús, crea el archivo en js/data/ y regístralo aquí.
    // Importante: El archivo nuevo debe empezar con window.MENU_DATA = [...]
    const AVAILABLE_MENUS = [
        { label: 'menu', file: 'menu.js' },
        { label: 'menu_1', file: 'menu_1.js' },
        // { label: 'menu_2', file: 'menu_2.js' }, // Ejemplo para futuros archivos
    ];

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
            tableBody.innerHTML = `<tr><td colspan="3" style="color:var(--color-danger)">Error cargando ${fileName}</td></tr>`;
        };
        
        document.body.appendChild(script);
    };

    // --- Inyectar Selector en el Título (H1) ---
    const h1 = document.querySelector('h1');
    if (h1 && !document.getElementById('menu-controls')) {
        const wrapper = document.createElement('div');
        wrapper.id = 'menu-controls';
        wrapper.style.display = 'flex';
        wrapper.style.gap = '8px';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginLeft = '10px';

        const options = AVAILABLE_MENUS.map(m => 
            `<option value="${m.file}" ${m.file === currentFile ? 'selected' : ''}>${m.label}</option>`
        ).join('');

        const select = document.createElement('select');
        select.id = 'menu-select';
        select.className = 'input-base input-select input-inline';
        select.innerHTML = options;
        select.addEventListener('change', (e) => {
            const newFile = e.target.value;
            currentFile = newFile;
            DB.save('selected_menu_file', newFile);
            loadMenuData(newFile); // Carga directa sin reload
        });

        wrapper.appendChild(select);
        
        h1.style.display = 'flex';
        h1.style.justifyContent = 'center';
        h1.style.alignItems = 'center';
        h1.style.flexWrap = 'wrap';
        h1.appendChild(wrapper);
    }

    // --- Botón de Edición (Debajo de la tabla) ---
    if (container && !document.getElementById('menu-edit-btn')) {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'text-center';
        btnContainer.style.marginTop = 'var(--space-lg)';
        
        const editBtn = document.createElement('button');
        editBtn.id = 'menu-edit-btn';
        editBtn.className = 'btn';
        editBtn.innerHTML = '✏️ Editar Menú';
        
        editBtn.onclick = () => {
            isEditMode = !isEditMode;
            editBtn.innerHTML = isEditMode ? '✅ Listo' : '✏️ Editar Menú';
            editBtn.style.borderColor = isEditMode ? 'var(--color-success)' : '';
            editBtn.style.color = isEditMode ? 'var(--color-success)' : '';
            renderTableContent();
        };

        btnContainer.appendChild(editBtn);
        container.appendChild(btnContainer);
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
            <div style="font-size: 1.1rem;">
                <span class="${classKcal}">${Math.round(dayTotals.kcal)}</span>
                <span style="color: #fff; opacity: 0.3; font-weight: 300;"> / ${tKcal}</span>
            </div>
            <div style="font-size:0.6rem; opacity:0.5; margin-bottom:8px; text-transform: uppercase;">Kcal Totales</div>

            <div style="font-family: monospace; font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; line-height: 1.6;">
                <div>
                    P: <span class="${classProt}">${Math.round(dayTotals.protein)}</span>
                    <span style="opacity:0.3; font-weight: 300;"> / ${tProt}</span>
                </div>
                <div>
                    C: <span class="${classCarb}">${Math.round(dayTotals.carbs)}</span>
                    <span style="opacity:0.3; font-weight: 300;"> / ${tCarb}</span>
                </div>
                <div>
                    G: <span class="${classFat}">${Math.round(dayTotals.fat)}</span>
                    <span style="opacity:0.3; font-weight: 300;"> / ${tFat}</span>
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

        tableBody.innerHTML = "";

        try {
        currentData.forEach((day, dayIndex) => {
        const meals = ['desayuno', 'comida', 'cena'];
        const dayTotals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
        const row = document.createElement("tr");

        let html = `
            <td class="menu-day-col">
                <div>
                    ${day.dia}
                </div>
            </td>`;

        // 1. Procesar cada comida
        meals.forEach(mealKey => {
            const mealData = day[mealKey];
            const nut = NUTRITION.calculateMeal(mealData.items);

            dayTotals.kcal += nut.kcal;
            dayTotals.protein += nut.protein;
            dayTotals.carbs += nut.carbs;
            dayTotals.fat += nut.fat;

            html += `
                <td>
                    <ul class="meal-list">
                        ${mealData.items.map((i, itemIndex) => {
                            const f = FOODS[i.foodId];
                            let amountHtml;
                            if (isEditMode) {
                                amountHtml = `<input type="text" inputmode="decimal" value="${i.amount}" 
                                    class="input-base" 
                                    style="width: 65px; padding: 4px 2px; font-size: 0.9rem; text-align: right; display: inline-block;"
                                    data-day="${dayIndex}" data-meal="${mealKey}" data-item="${itemIndex}">`;
                            } else {
                                amountHtml = `<span style="font-size: 0.9rem; font-weight: 500;">${i.amount}</span>`;
                            }
                            return `<li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 1rem;">
                                <span style="margin-right: 8px;">${f ? f.name : i.foodId}</span>
                                <div style="white-space: nowrap; display: flex; align-items: center;">
                                    ${amountHtml}
                                    <span style="margin-left: 4px; opacity: 0.8; font-size: 0.85rem;">${f ? f.unit : ''}</span>
                                </div>
                            </li>`;
                        }).join('')}
                    </ul>
                    <div class="meal-macros" id="macros-${dayIndex}-${mealKey}">
                        <span style="color:var(--color-primary)">${Math.round(nut.kcal)} kcal</span> |
                        P: ${Math.round(nut.protein)} | C: ${Math.round(nut.carbs)} | G: ${Math.round(nut.fat)}
                    </div>
                    <div style="margin-top:4px; font-size:0.7rem; color:rgba(255,255,255,0.5); font-style:italic; line-height:1.2;">
                        ${mealData.description || ''}
                    </div>
                </td>`;
        });

        // 2. Lógica de Totales
        const target = storedTargets[day.dia];

        html += `
            <td class="day-total" id="day-totals-${dayIndex}">
                ${generateTotalsHtml(dayTotals, target)}
            </td>`;

        row.innerHTML = html;
        tableBody.appendChild(row);
    });
        } catch (error) {
            console.error("Error renderizando el menú:", error);
            tableBody.innerHTML = `<tr><td colspan="3" style="padding: 20px; text-align: center; color: var(--color-danger);">Error cargando los datos: ${error.message}</td></tr>`;
        }
    };

    // --- 3. Event Delegation para Inputs (Edición) ---
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
                        <span style="color:var(--color-primary)">${Math.round(mealNut.kcal)} kcal</span> |
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
