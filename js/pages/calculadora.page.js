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
    
    // Ajustes por defecto: Mantenimiento (0) para todo
    let adjustments = DB.get('user_adjustments', { kcal: 0, p: 0, c: 0, f: 0 });

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

    DIAS_SEMANA.forEach((day, index) => {
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
    
    // Helper para generar opciones (-20% a +20%)
    const generateOpts = (val) => {
        const steps = [-0.20, -0.15, -0.10, -0.05, 0, 0.05, 0.10, 0.15, 0.20];
        return steps.map(s => {
            const label = s === 0 ? "0%" : (s > 0 ? `+${Math.round(s*100)}%` : `${Math.round(s*100)}%`);
            return `<option value="${s}" ${Math.abs(val - s) < 0.001 ? 'selected' : ''}>${label}</option>`;
        }).join('');
    };

    objectivesCard.innerHTML = `
        <h2>Ajustes de Objetivos</h2>
        <div class="section-group__grid" style="grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: var(--space-md);">
            <div class="row-item" style="flex-direction: column; padding: 8px 4px;">
                <span style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.7;">Kcal</span>
                <select id="adj-kcal" class="row-item__input" style="width: 100%; margin-top: 4px; padding: 4px; font-size: 0.8rem;">${generateOpts(adjustments.kcal)}</select>
            </div>
            <div class="row-item" style="flex-direction: column; padding: 8px 4px;">
                <span style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.7;">Prot</span>
                <select id="adj-p" class="row-item__input" style="width: 100%; margin-top: 4px; padding: 4px; font-size: 0.8rem;">${generateOpts(adjustments.p)}</select>
            </div>
            <div class="row-item" style="flex-direction: column; padding: 8px 4px;">
                <span style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.7;">Carb</span>
                <select id="adj-c" class="row-item__input" style="width: 100%; margin-top: 4px; padding: 4px; font-size: 0.8rem;">${generateOpts(adjustments.c)}</select>
            </div>
            <div class="row-item" style="flex-direction: column; padding: 8px 4px;">
                <span style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.7;">Gras</span>
                <select id="adj-f" class="row-item__input" style="width: 100%; margin-top: 4px; padding: 4px; font-size: 0.8rem;">${generateOpts(adjustments.f)}</select>
            </div>
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

        // Guardar Ajustes
        adjustments.kcal = parseFloat(document.getElementById('adj-kcal').value);
        adjustments.p = parseFloat(document.getElementById('adj-p').value);
        adjustments.c = parseFloat(document.getElementById('adj-c').value);
        adjustments.f = parseFloat(document.getElementById('adj-f').value);
        DB.save('user_adjustments', adjustments);

        // Usar Fórmulas del Core
        const imc = Formulas.calcIMC(userProfile.weight, userProfile.height);
        const imcData = Formulas.getIMCCategory(imc);
        const bmr = Formulas.calcBMR(userProfile.weight, userProfile.height, userProfile.age, userProfile.sex);

        // Helper de cálculo ajustado
        const getAdjustedValues = (baseKcal, activityKey) => {
            const targetKcal = baseKcal * (1 + adjustments.kcal);
            const m = Formulas.calcMacros(targetKcal, activityKey);
            
            const p = Math.round(m.p * (1 + adjustments.p));
            const c = Math.round(m.c * (1 + adjustments.c));
            const f = Math.round(m.f * (1 + adjustments.f));
            
            const finalKcal = (p * 4) + (c * 4) + (f * 9);
            
            const pct = {
                p: finalKcal ? Math.round(p * 4 / finalKcal * 100) : 0,
                c: finalKcal ? Math.round(c * 4 / finalKcal * 100) : 0,
                f: finalKcal ? Math.round(f * 9 / finalKcal * 100) : 0
            };
            
            return { p, c, f, pct, kcal: finalKcal };
        };

        // --- RESULTADOS BASE ---
        const restKcal = Math.round(bmr * 1.2); // Factor sedentario
        const restVals = getAdjustedValues(restKcal, 'descanso');

        baseResultsCard.innerHTML = `
            <h2>Resultados Base</h2>
            <div class="calc-grid-3">
                <!-- IMC -->
                <div class="mini-card">
                    <div class="mini-card__title">IMC</div>
                    <div class="mini-card__value ${imcData.className}">${imc}</div>
                    <div class="mini-card__extra ${imcData.className}">${imcData.label}</div>
                </div>
                
                <!-- BMR -->
                <div class="mini-card">
                    <div class="mini-card__title">BMR</div>
                    <div class="mini-card__value ${imcData.className}">
                        ${bmr}<span class="mini-card__unit"> kcal</span>
                    </div>
                    <div class="mini-card__extra ${imcData.className}">Basal</div>
                </div>

                <!-- Presupuesto (Reposo) -->
                <div class="mini-card">
                    <div class="mini-card__title">Presupuesto</div>
                    <div class="mini-card__value" style="color: var(--color-primary)">
                        ${restVals.kcal}<span class="mini-card__unit"> kcal</span>
                    </div>
                    <div class="mini-card__macros">
                        P:${restVals.p}g | CH:${restVals.c}g | G:${restVals.f}g
                    </div>
                </div>
            </div>
        `;

        // --- RESULTADOS DIARIOS (OBJETIVOS) ---
        const dailyGrid = document.getElementById('daily-results-grid');
        dailyGrid.innerHTML = '';

        DIAS_SEMANA.forEach((day, index) => {
            const activityKey = weeklyPlan[index];
            
            // UNIFICACIÓN: Usamos el multiplicador centralizado de Formulas, igual que en Actividad
            const factor = Formulas.ACTIVITY_MULTIPLIERS[activityKey] || 1.2;

            // Cálculo con ajuste
            const tdee = bmr * factor;
            const dayVals = getAdjustedValues(tdee, activityKey);

            const dayCard = document.createElement('div');
            dayCard.className = 'row-item daily-result-card';
            
            dayCard.innerHTML = `
                <div class="calc-day-row">
                    <div class="calc-day-row__header">
                        <div class="row-item__title">${day}</div>
                        <div class="calc-day-row__activity-label">${ACTIVITY_CATALOG[activityKey].label}</div>
                    </div>
                    <div class="calc-day-row__data">
                        <div style="font-weight: bold; color: var(--color-primary);">${dayVals.kcal} kcal</div>
                        <div class="calc-day-row__macros">
                            P:${dayVals.p}g | CH:${dayVals.c}g | G:${dayVals.f}g
                        </div>
                    </div>
                </div>
            `;
            dailyGrid.appendChild(dayCard);
        });
    };

    // Listeners
    profileCard.querySelectorAll('input, select').forEach(el => el.addEventListener('change', updateAndCalculate));
    objectivesCard.querySelectorAll('select').forEach(el => el.addEventListener('change', updateAndCalculate));
    
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
