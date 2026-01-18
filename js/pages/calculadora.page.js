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

    // Configuración de campos de ajuste para iteración (DRY)
    const ADJ_FIELDS = [
        { id: 'adj-kcal', label: '🔥Kcal', key: 'kcal' },
        { id: 'adj-p',    label: '🥩 Prot', key: 'p' },
        { id: 'adj-c',    label: '🍚 Carb', key: 'c' },
        { id: 'adj-f',    label: '🥑 Gras', key: 'f' }
    ];

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

    // --- SECCIÓN 4: AJUSTES GENERALES ---
    const adjustmentsCard = document.createElement('div');
    adjustmentsCard.className = 'card';
    adjustmentsCard.style.marginTop = 'var(--space-lg)';
    
    // Helper para generar opciones (-20% a +20%)
    const generateOpts = (val) => {
        const steps = [0.20, 0.15, 0.10, 0.05, 0, -0.05, -0.10, -0.15, -0.20];
        return steps.map(s => {
            const label = s === 0 ? "0%" : (s > 0 ? `+${Math.round(s*100)}%` : `${Math.round(s*100)}%`);
            return `<option value="${s}" ${Math.abs(val - s) < 0.001 ? 'selected' : ''}>${label}</option>`;
        }).join('');
    };

    adjustmentsCard.innerHTML = `
        <h2>Ajustes Generales</h2>
        <div class="section-group__grid" style="grid-template-columns: repeat(4, 1fr); gap: 6px;">
            ${ADJ_FIELDS.map(field => `
                <div class="row-item" style="flex-direction: column; padding: 8px 4px;">
                    <span style="font-size: 0.65rem; text-transform: uppercase; opacity: 0.7;">${field.label}</span>
                    <select id="${field.id}" class="row-item__input" style="width: 100%; margin-top: 4px; padding: 4px; font-size: 0.8rem;">${generateOpts(adjustments[field.key])}</select>
                </div>
            `).join('')}
        </div>
    `;
    container.appendChild(adjustmentsCard);

    // --- SECCIÓN 5: OBJETIVOS SEMANALES ---
    const weeklyGoalsCard = document.createElement('div');
    weeklyGoalsCard.className = 'card';
    weeklyGoalsCard.style.marginTop = 'var(--space-lg)';
    weeklyGoalsCard.innerHTML = `
        <h2>Objetivos Semanales</h2>
        <div id="daily-results-grid" class="stack-vertical"></div>
    `;
    container.appendChild(weeklyGoalsCard);

    // --- LÓGICA DE CÁLCULO ---
    
    // Helper para renderizar pills de macros
    const renderMacroPills = (vals) => `
        <div class="stats-pills stats-pills--center" style="width: 100%;">
            <div class="stat-pill stat-pill--kcal">🔥 ${vals.kcal} kcal</div>
            <div class="stat-pill">🥩 ${vals.p}g</div>
            <div class="stat-pill">🍚 ${vals.c}g</div>
            <div class="stat-pill">🥑 ${vals.f}g</div>
        </div>
    `;

    const updateAndCalculate = () => {
        // Guardar Perfil
        userProfile.sex = document.getElementById('calc-sex').value;
        userProfile.age = parseInt(document.getElementById('calc-age').value) || 0;
        userProfile.height = parseInt(document.getElementById('calc-height').value) || 0;
        userProfile.weight = parseFloat(document.getElementById('calc-weight').value) || 0;
        DB.save('user_profile', userProfile);

        // Guardar Ajustes
        ADJ_FIELDS.forEach(field => {
            adjustments[field.key] = parseFloat(document.getElementById(field.id).value);
        });
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
                    <div class="stats-pills stats-pills--center" style="margin: 8px 0;">
                        <div class="stat-pill stat-pill--kcal">🔥 ${bmr} kcal</div>
                    </div>
                    <div class="mini-card__extra ${imcData.className}">Basal</div>
                </div>

                <!-- Presupuesto (Reposo) -->
                <div class="mini-card">
                    <div class="mini-card__title">Presupuesto</div>
                    <div class="stats-pills stats-pills--center" style="margin-top: 8px; width: 100%;">
                        <div class="stat-pill stat-pill--kcal">🔥 ${restVals.kcal} kcal</div>
                    </div>
                    ${renderMacroPills(restVals).replace('style="width: 100%;"', 'style="margin-top: 4px; width: 100%;"')}
                </div>
            </div>
        `;

        // --- RESULTADOS DIARIOS (OBJETIVOS) ---
        const dailyGrid = document.getElementById('daily-results-grid');
        dailyGrid.innerHTML = '';

        const dailyTargets = {};

        DIAS_SEMANA.forEach((day, index) => {
            const activityKey = weeklyPlan[index];
            
            // UNIFICACIÓN: Usamos el multiplicador centralizado de Formulas, igual que en Actividad
            const factor = Formulas.ACTIVITY_MULTIPLIERS[activityKey] || 1.2;

            // Cálculo con ajuste
            const tdee = bmr * factor;
            const dayVals = getAdjustedValues(tdee, activityKey);

            dailyTargets[day] = {
                kcal: dayVals.kcal,
                protein: dayVals.p,
                carbs: dayVals.c,
                fat: dayVals.f
            };

            const dayCard = document.createElement('div');
            dayCard.className = 'row-item daily-result-card';
            
            dayCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div class="row-item__title">${day}</div>
                    <div class="row-item__subtitle" style="margin-top: 0;">${(ACTIVITY_CATALOG[activityKey] || {}).label || activityKey}</div>
                </div>
                ${renderMacroPills(dayVals)}
            `;
            dailyGrid.appendChild(dayCard);
        });

        // Guardamos los objetivos calculados en la DB para que el Menú pueda leerlos
        DB.save('daily_nutrition_targets', dailyTargets);
    };

    // Listeners
    profileCard.querySelectorAll('input, select').forEach(el => el.addEventListener('change', updateAndCalculate));
    adjustmentsCard.querySelectorAll('select').forEach(el => el.addEventListener('change', updateAndCalculate));
    
    // Ejecutar al inicio
    updateAndCalculate();
}
