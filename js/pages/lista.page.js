/* =========================================
   pages/lista.page.js - LISTA DE LA COMPRA
   ========================================= */

function renderShoppingListPage() {
    const container = document.getElementById('lista-container');
    if (!container) return;

    // Limitar ancho igual que las otras páginas
    container.classList.add('layout-container');

    // --- 1. Carga Dinámica de Datos (Menú y Alimentos) ---
    // Detectamos si estamos en /views/ o en root para la ruta del script
    const isInViews = window.location.pathname.includes('/views/');
    const basePath = isInViews ? '../js/data/' : 'js/data/';

    const loadScript = (fileName, id = null) => {
        return new Promise((resolve, reject) => {
            if (id) {
                const old = document.getElementById(id);
                if (old) old.remove();
            }
            const script = document.createElement('script');
            if (id) script.id = id;
            script.src = `${basePath}${fileName}?v=${Date.now()}`;
            script.onload = resolve;
            script.onerror = () => reject(fileName);
            document.body.appendChild(script);
        });
    };

    const promises = [];

    // Cargar foods.js si no está disponible
    if (typeof FOODS === 'undefined') {
        promises.push(loadScript('foods.js', 'static-foods-data'));
    }

    // Cargar el menú seleccionado
    // Limpiamos rastros previos para asegurar recarga limpia (evita conflictos de const y datos viejos)
    window.MENU_DATA = undefined;
    const otherMenuScript = document.getElementById('dynamic-menu-data'); // Script dejado por menu.page.js
    if (otherMenuScript) otherMenuScript.remove();

    const menuFile = DB.get('selected_menu_file', 'menu.js');

    // Actualizar título con etiqueta del menú
    const h1 = document.querySelector('h1');
    if (h1) {
        const menuOption = (typeof AVAILABLE_MENUS !== 'undefined' ? AVAILABLE_MENUS : []).find(m => m.file === menuFile);
        const label = menuOption ? menuOption.label : menuFile.replace('.js', '');
        
        // Evitar duplicados si se re-ejecuta
        const existingLabel = h1.querySelector('.menu-label');
        if (existingLabel) existingLabel.remove();

        h1.innerHTML += ` <span class="menu-label">(${label})</span>`;
    }

    promises.push(loadScript(menuFile, 'dynamic-menu-list'));

    Promise.all(promises)
        .then(() => {
            // IMPORTANTE: Verificar si hay cambios guardados por el usuario (edición manual en la tabla)
            // Esto asegura que la lista refleje las cantidades editadas, no solo el archivo base.
            const savedData = DB.get(`menu_data_${menuFile}`, null);
            if (savedData) {
                window.MENU_DATA = savedData;
            }
            calculateAndRenderList(container);
        })
        .catch((file) => {
            container.innerHTML = `<div class="card"><p class="text-status--danger">Error cargando ${file}</p></div>`;
        });
}

function calculateAndRenderList(container) {
    if (typeof MENU_DATA === 'undefined' || typeof FOODS === 'undefined') {
        container.innerHTML = '<div class="card"><p>Faltan datos (Menú o Alimentos).</p></div>';
        return;
    }

    // 1. Calcular totales desde el menú
    const totals = {};
    
    MENU_DATA.forEach(day => {
        ['desayuno', 'comida', 'cena'].forEach(meal => {
            if (day[meal] && day[meal].items) {
                day[meal].items.forEach(item => {
                    totals[item.foodId] = (totals[item.foodId] || 0) + item.amount;
                });
            }
        });
    });

    // 2. Agrupar items de FOODS por categoría
    const listByCategory = {};
    
    // Orden de visualización deseado
    const categoryOrder = [
        "🥔 Verduras y hortalizas",
        "🍎 Fruta",
        "🥩 Proteínas",
        "🥛 Lácteos",
        "🍚 Cereales, legumbres y tubérculos",
        "🥑 Grasas, frutos secos y semillas",
        "🧂 Condimentos y especias",
        "☕ Bebidas",
        "📦 Otros / Procesados",
        "💊 Suplementos"
    ];

    Object.keys(totals).forEach(foodId => {
        const amount = totals[foodId];
        if (amount <= 0) return;

        const food = FOODS[foodId];
        if (!food) return; // Item en menú pero no en FOODS

        const cat = food.category || "📦 Otros / Procesados";
        
        if (!listByCategory[cat]) {
            listByCategory[cat] = [];
        }
        
        listByCategory[cat].push({
            id: foodId,
            titulo: food.name,
            amount: amount,
            unit: food.unit
        });
    });

    container.innerHTML = '';
    let hasItems = false;

    // 3. Renderizar categorías ordenadas
    const sortedCategories = Object.keys(listByCategory).sort((a, b) => {
        const idxA = categoryOrder.indexOf(a);
        const idxB = categoryOrder.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });

    sortedCategories.forEach(catName => {
        const items = listByCategory[catName];
        if (items.length === 0) return;
        hasItems = true;

        const section = document.createElement('div');
        section.className = 'section-group';
        section.innerHTML = `<h2>${catName}</h2><div class="section-group__grid"></div>`;

        const grid = section.querySelector('.section-group__grid');

        // Delegación de eventos
        grid.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                DB.save(`shop_${e.target.id}`, e.target.checked);
            }
        });

        items.forEach(item => {
            const isChecked = DB.get(`shop_${item.id}`, false);
            
            // Formateo inteligente
            let displayAmount = item.amount;
            let displayUnit = item.unit || '';

            if (displayUnit === 'g' && displayAmount >= 1000) {
                displayAmount = (displayAmount / 1000).toFixed(1).replace('.0', '');
                displayUnit = 'kg';
            }
            if (displayUnit === 'ml' && displayAmount >= 1000) {
                displayAmount = (displayAmount / 1000).toFixed(1).replace('.0', '');
                displayUnit = 'L';
            }

            const label = document.createElement('label');
            label.className = 'row-item';

            label.innerHTML = `
                <div class="row-item__info">
                    <span class="row-item__title">${item.titulo}</span>
                    <span class="row-item__subtitle">
                        ${displayAmount} ${displayUnit} 
                    </span>
                </div>
                <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''}>
            `;

            grid.appendChild(label);
        });

        container.appendChild(section);
    });

    if (!hasItems) {
        container.innerHTML = '<div class="card"><p>Lista vacía.</p></div>';
    }
}
