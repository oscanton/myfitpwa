/* =========================================
   pages/menu.page.js - MENÚ SEMANAL
   ========================================= */

function renderMenuPage() {
    const tableBody = document.getElementById("menu-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    MENU_DATA.forEach(day => {
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
                        ${mealData.items.map(i => {
                            const f = FOODS[i.foodId];
                            return `<li>${f ? f.name : i.foodId} <span>${i.amount}${f ? f.unit : ''}</span></li>`;
                        }).join('')}
                    </ul>
                    <div class="meal-macros">
                        <span style="color:var(--color-primary)">${Math.round(nut.kcal)} kcal</span> |
                        P: ${Math.round(nut.protein)} | C: ${Math.round(nut.carbs)} | G: ${Math.round(nut.fat)}
                    </div>
                    <div style="margin-top:4px; font-size:0.7rem; color:rgba(255,255,255,0.5); font-style:italic; line-height:1.2;">
                        ${mealData.description || ''}
                    </div>
                </td>`;
        });

        // 2. Lógica de Totales
        const target = DAILY_NUTRITION_TARGETS[day.dia];
        const tKcal = target ? target.kcal : 0;
        const tProt = target ? target.protein : 0;
        const tCarb = target ? target.carbs : 0;
        const tFat  = target ? target.fat : 0;

        const classKcal = getStatusClass(dayTotals.kcal, tKcal);
        const classProt = getStatusClass(dayTotals.protein, tProt);
        const classCarb = getStatusClass(dayTotals.carbs, tCarb);
        const classFat  = getStatusClass(dayTotals.fat, tFat);

        html += `
            <td class="day-total">
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
                </div>
            </td>`;

        row.innerHTML = html;
        tableBody.appendChild(row);
    });
}
