/* js/pages/menu.page.js - Refactor usando DOM & Components
   Nota: mantiene la capacidad de hot-swap cargando archivos en js/data/ que expongan window.MENU_DATA
*/
(function(){
  const DB = window.DB || (window.Storage && window.Storage.DB) || window.localDB;
  const FOODS = window.FOODS || {};
  const TARGETS = window.TARGETS || {};
  const AVAILABLE_MENUS = window.AVAILABLE_MENUS || [
    { label: 'menu', file: 'menu.js' },
    { label: 'menu_1', file: 'menu_1.js' }
  ];

  const container = document.getElementById('menu-container') || document.getElementById('menu-root') || document.body;

  function init() {
    renderHeaderControls();
    renderTable();
    bindEvents();
  }

  function renderHeaderControls() {
    const h1 = document.querySelector('h1') || DOM.el('h1', { text: 'Menú' });
    h1.classList.add('menu-title');

    const headerWrapper = h1.parentElement || container;
    let controls = DOM.q('#menu-controls', headerWrapper);
    if (!controls) {
      controls = DOM.el('div', { id: 'menu-controls' });
      headerWrapper.appendChild(controls);
    }

    const options = AVAILABLE_MENUS.map(m => ({ value: m.file, label: m.label }));
    const currentFile = (DB && DB.get) ? DB.get('selected_menu_file', options[0].value) : options[0].value;

    const selectEl = Components.select({
      id: 'menu-select',
      options,
      value: currentFile,
      onChange: (e) => {
        const newFile = e.target.value;
        if (DB && DB.save) DB.save('selected_menu_file', newFile);
        loadMenuData(newFile);
      }
    });

    // Reemplaza contenido del wrapper y añade el select
    DOM.empty(controls);
    controls.appendChild(selectEl);
  }

  function renderTable() {
    const tableBody = document.getElementById('menu-body');
    if (!tableBody) return;
    DOM.empty(tableBody);

    const menus = window.MENU_DATA || [];
    // Si MENU_DATA es un objeto con comidas por clave, convertir a array
    const menusArr = Array.isArray(menus) ? menus : Object.keys(menus).map(k => Object.assign({ key:k }, menus[k]));

    menusArr.forEach(menu => {
      const tr = DOM.el('tr');
      const nameCell = DOM.el('td', { class: 'menu-row' });
      nameCell.innerHTML = `<div class="menu-row-name">${menu.titulo || menu.name || menu.key || ''}</div>` +
                            `<div class="menu-row-desc">${menu.description || menu.descripcion || ''}</div>`;

      const macrosCell = DOM.el('td', {});
      macrosCell.innerHTML = renderMacrosFor(menu);

      tr.appendChild(nameCell);
      tr.appendChild(macrosCell);
      tableBody.appendChild(tr);
    });
  }

  function renderMacrosFor(menu) {
    // Usa nutrition core si existe
    const nutritionCalc = window.Nutrition || window.nutrition || null;
    const totals = (nutritionCalc && nutritionCalc.calculateMeal) ? nutritionCalc.calculateMeal(menu.items || []) : { kcal:0, protein:0, carbs:0, fat:0 };

    const getCls = (current, target) => {
      if (!target || target === 0) return '';
      const pct = (current / target) * 100;
      if (pct > 110) return 'status-danger';
      if (pct < 90) return 'status-warning';
      return 'status-ok';
    };

    const t = window.TARGETS || TARGETS || {};
    return `
      <div class="activity-stats">
        <span class="${getCls(totals.kcal, t.kcal)}">kcal: ${Math.round(totals.kcal)}</span>
        <span class="${getCls(totals.protein, t.protein)}">protein: ${Math.round(totals.protein)}g</span>
        <span class="${getCls(totals.carbs, t.carbs)}">carbs: ${Math.round(totals.carbs)}g</span>
        <span class="${getCls(totals.fat, t.fat)}">fat: ${Math.round(tals.fat)}g</span>
      </div>
    `;
  }

  function bindEvents() {
    // Escucha cambios globales (ej. evento custom que emita storage.js cuando cambie algo)
    window.addEventListener('storage:updated', renderTable);
  }

  function loadMenuData(fileName) {
    if (!fileName) return;
    const isInViews = window.location.pathname.includes('/views/');
    const basePath = isInViews ? '../js/data/' : 'js/data/';
    const scriptPath = `${basePath}${fileName}?v=${Date.now()}`;
    const scriptId = 'dynamic-menu-data';

    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();

    const s = document.createElement('script');
    s.id = scriptId;
    s.src = scriptPath;
    s.onload = () => { renderTable(); };
    s.onerror = () => console.warn('No se pudo cargar', scriptPath);
    document.body.appendChild(s);
  }

  document.addEventListener('DOMContentLoaded', init);
})();