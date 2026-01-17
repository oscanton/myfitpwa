/* =========================================
   pages/calculadora.page.js - CALCULADORA
   ========================================= */

function renderCalculatorPage() {
    const container = document.getElementById('calculadora-container');
    if (!container) return;

    // 1. Cargar datos (o defaults)
    const userProfile = DB.get('user_profile', {
        sex: 'hombre', age: 30, height: 175, weight: 75
    });
    
    // Plan semanal por defecto: todo descanso
    const weeklyPlan = DB.get('user_activity_plan', Array(7).fill('descanso'));
    
    // Objetivo por defecto: Mantenimiento (0)
    let objectiveAdjustment = DB.get('user_objective_adjustment', 0);

    // --- SECCIÓN 1: DATOS PERSONALES ---
    const profileCard = document.createElement('div');
    profileCard.className = 'card';
    profileCard.innerHTML = `
        <h2>Datos Personales</h2>
        <div class="section-group__grid">
            <div class="row-item">
                <span class="row-item__title">Sexo</span>
                <select id="calc-sex" class="row-item__input input-auto">
                    <option value="hombre" ${userProfile.sex === 'hombre' ? 'selected' : ''}>Hombre</option>
                    <option value="mujer" ${userProfile.sex === 'mujer' ? 'selected' : ''}>Mujer</option>
                </select>
            </div>
            <div class="row-item">
                <span class="row-item__title">Edad</span>
                <input type="number" id="calc-age" class="row-item__input" value="${userProfile.age}">
            </div>
            <div class="row-item">
                <span class="row-item__title">Altura (cm)</span>
                <input type="number" id="calc-height" class="row-item__input" value="${userProfile.height}">
            </div>
            <div class="row-item">
                <span class="row-item__title">Peso (kg)</span>
                <input type="number" id="calc-weight" class="row-item__input" value="${userProfile.weight}">
            </div>
        </div>
    `;
    container.appendChild(profileCard);

    // --- SECCIÓN 2: RESULTADOS BASE (IMC, BMR, REPOSO) ---
    const baseResultsCard = document.createElement('div');
    baseResultsCard.className = 'card';
    baseResultsCard.style.marginTop = 'var(--space-lg)';
    // Se rellena en updateAndCalculate
    container.appendChild(baseResultsCard);

    // --- SECCIÓN 3: ACTIVIDAD SEMANAL ---
    const planCard = document.createElement('div');
    planCard.className = 'card';
    planCard.style.marginTop = 'var(--space-lg)';
    planCard.innerHTML = `<h2 class="text-center">Actividad Semanal</h2><div class="stack-vertical" id="plan-rows"></div>`;
    container.appendChild(planCard);

    const planRows = planCard.querySelector('#plan-rows');
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    days.forEach((day, index) => {
        const row = document.createElement('div');
        row.className = 'row-item';
        
        let options = '';
        for (const [key, data] of Object.entries(ACTIVITY_CATALOG)) {
            const isSelected = weeklyPlan[index] === key ? 'selected' : '';
            options += `<option value="${key}" ${isSelected}>${data.label}</option>`;
        }

        row.innerHTML = `
            <span class="row-item__title">${day}</span>
            <select class="row-item__input activity-select" data-index="${index}">
                ${options}
            </select>
        `;
        planRows.appendChild(row);
    });

    // --- SECCIÓN 4: OBJETIVOS Y PLAN DIARIO ---
    const objectivesCard = document.createElement('div');
    objectivesCard.className = 'card';
    objectivesCard.style.marginTop = 'var(--space-lg)';
    
    // Generar opciones del select marcando la seleccionada
    const opts = [
        { val: -0.20, txt: "Déficit agresivo (-20%)" },
        { val: -0.15, txt: "Déficit moderado (-15%)" },
        { val: -0.10, txt: "Déficit ligero (-10%)" },
        { val: -0.05, txt: "Pequeño déficit (-5%)" },
        { val: 0,     txt: "Mantenimiento (0%)" },
        { val: 0.05,  txt: "Superávit ligero (+5%)" },
        { val: 0.10,  txt: "Superávit (+10%)" }
    ];
    
    const optionsHtml = opts.map(o => 
        `<option value="${o.val}" ${Math.abs(objectiveAdjustment - o.val) < 0.001 ? 'selected' : ''}>${o.txt}</option>`
    ).join('');

    objectivesCard.innerHTML = `
        <h2>Objetivos</h2>
        <div class="row-item" style="margin-bottom: var(--space-md);">
            <span class="row-item__title">Ajuste</span>
            <select id="calc-objective" class="row-item__input input-auto">
                ${optionsHtml}
            </select>
        </div>
        <div id="daily-results-grid" class="section-group__grid"></div>
    `;
    container.appendChild(objectivesCard);

    // --- LÓGICA DE CÁLCULO ---

    const updateAndCalculate = () => {
        // Guardar Perfil
        userProfile.sex = document.getElementById('calc-sex').value;
        userProfile.age = parseInt(document.getElementById('calc-age').value) || 0;
        userProfile.height = parseInt(document.getElementById('calc-height').value) || 0;
        userProfile.weight = parseFloat(document.getElementById('calc-weight').value) || 0;
        DB.save('user_profile', userProfile);

        // Guardar Objetivo
        objectiveAdjustment = parseFloat(document.getElementById('calc-objective').value);
        DB.save('user_objective_adjustment', objectiveAdjustment);

        // Usar Fórmulas del Core
        const imc = Formulas.calcIMC(userProfile.weight, userProfile.height);
        const imcData = Formulas.getIMCCategory(imc);
        const bmr = Formulas.calcBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.sex);

        // --- RESULTADOS BASE ---
        const restKcal = Math.round(bmr * 1.2); // Factor sedentario
        const restMacros = Formulas.calcMacros(restKcal, 'descanso');

        baseResultsCard.innerHTML = `
            <h2>Resultados Base</h2>
            <div class="calc-summary">
                <div class="calc-stat">
                    <div class="calc-stat__value ${imcData.className}">${imc}</div>
                    <div class="calc-stat__sub ${imcData.className}">${imcData.label}</div>
                    <div class="text-muted">IMC</div>
                </div>
                <div class="calc-stat">
                    <div class="calc-stat__value ${imcData.className}">${bmr}</div>
                    <div class="calc-stat__sub ${imcData.className}">kcal</div>
                    <div class="text-muted">BMR (Basal)</div>
                </div>
            </div>
            <div class="row-item base-result-row">
                <div class="calc-day-row">
                    <div class="calc-day-row__header">
                        <div class="row-item__title">Día de Reposo (Sedentario)</div>
                    </div>
                    <div class="calc-day-row__data">
                        <div style="font-weight: bold; color: var(--color-primary);">${restKcal} kcal</div>
                        <div class="calc-day-row__macros">
                            P:${restMacros.p}g (${restMacros.pct.p}%) | CH:${restMacros.c}g (${restMacros.pct.c}%) | G:${restMacros.f}g (${restMacros.pct.f}%)
                        </div>
                    </div>
                </div>
            </div>
        `;

        // --- RESULTADOS DIARIOS (OBJETIVOS) ---
        const dailyGrid = document.getElementById('daily-results-grid');
        dailyGrid.innerHTML = '';

        days.forEach((day, index) => {
            const activityKey = weeklyPlan[index];
            const factor = ACTIVITY_CATALOG[activityKey].factor;
            
            // Cálculo con ajuste
            const tdee = bmr * factor;
            const targetKcal = Math.round(tdee * (1 + objectiveAdjustment));
            const macros = Formulas.calcMacros(targetKcal, activityKey);

            const dayCard = document.createElement('div');
            dayCard.className = 'row-item daily-result-card';
            
            dayCard.innerHTML = `
                <div class="calc-day-row">
                    <div class="calc-day-row__header">
                        <div class="row-item__title">${day}</div>
                        <div class="calc-day-row__activity-label">${ACTIVITY_CATALOG[activityKey].label}</div>
                    </div>
                    <div class="calc-day-row__data">
                        <div style="font-weight: bold; color: var(--color-primary);">${targetKcal} kcal</div>
                        <div class="calc-day-row__macros">
                            P:${macros.p}g (${macros.pct.p}%) | CH:${macros.c}g (${macros.pct.c}%) | G:${macros.f}g (${macros.pct.f}%)
                        </div>
                    </div>
                </div>
            `;
            dailyGrid.appendChild(dayCard);
        });
    };

    // Listeners
    profileCard.querySelectorAll('input, select').forEach(el => el.addEventListener('change', updateAndCalculate));
    document.getElementById('calc-objective').addEventListener('change', updateAndCalculate);
    
    planRows.querySelectorAll('select').forEach(el => {
        el.addEventListener('change', (e) => {
            weeklyPlan[e.target.dataset.index] = e.target.value;
            DB.save('user_activity_plan', weeklyPlan);
            updateAndCalculate();
        });
    });

    // Ejecutar al inicio
    updateAndCalculate();
}
