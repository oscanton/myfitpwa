/* =========================================
   pages/lista.page.js - LISTA DE LA COMPRA
   ========================================= */

function renderShoppingListPage() {
    const container = document.getElementById('lista-container');
    if (!container) return;

    COMESTIBLES_DATA.categorias.forEach(cat => {
        const section = document.createElement('div');
        section.className = 'section-group';
        section.innerHTML = `<h2>${cat.nombre}</h2><div class="section-group__grid"></div>`;

        const grid = section.querySelector('.section-group__grid');

        // Usamos delegación de eventos para mejorar el rendimiento.
        // Un solo listener en el contenedor en lugar de uno por cada checkbox.
        grid.addEventListener('change', (e) => {
            if (e.target.matches('input[type="checkbox"]')) {
                DB.save(`shop_${e.target.id}`, e.target.checked);
            }
        });

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

            grid.appendChild(label);
        });

        container.appendChild(section);
    });
}
