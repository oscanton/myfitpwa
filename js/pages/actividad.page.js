/* =========================================
   pages/actividad.page.js - ACTIVIDAD SEMANAL
   ========================================= */

function renderActivityPage() {
    const container = document.getElementById('actividad-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Calcular índice del día actual (Lunes=0, ..., Domingo=6)
    // getDay(): 0=Domingo, 1=Lunes... Ajustamos para que 0 sea Lunes.
    const todayIndex = (new Date().getDay() + 6) % 7;

    // 1. Sincronización: Leemos el mismo plan que usa la calculadora
    const weeklyPlan = DB.get('user_activity_plan', Array(7).fill('descanso'));
    
    // Optimización: Leemos el perfil una sola vez para toda la lista
    const userProfile = DB.get('user_profile', {});

    DIAS_SEMANA.forEach((diaNombre, index) => {
        const card = document.createElement('div');
        const isActive = index === todayIndex;
        
        // Usamos el valor del plan compartido
        const savedType = weeklyPlan[index] || 'descanso';

        // Usamos las clases mejoradas en components.css
        card.className = `activity-card ${isActive ? 'activity-card--active' : ''}`;
        
        // Generar opciones del select
        const options = TIPOS_ACTIVIDAD.map(opt => 
            `<option value="${opt.value}" ${opt.value === savedType ? 'selected' : ''}>${opt.label}</option>`
        ).join('');

        card.innerHTML = `
            <div class="activity-header">${diaNombre} ${isActive ? ' (HOY)' : ''}</div>
            
            <div style="margin: 8px 0;">
                <select class="input-base input-select w-100" onchange="updateActivity(${index}, this.value)">
                    ${options}
                </select>
            </div>

            <div id="rutina-content-${index}">
                ${generateRoutineContent(savedType, userProfile)}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Función auxiliar para generar el contenido HTML de la rutina y los stats
function generateRoutineContent(type, profileData = null) {
    const rutina = RUTINAS[type] || RUTINAS['descanso'];
    
    // Usamos el perfil pasado o leemos de DB si no existe (fallback)
    const userProfile = profileData || DB.get('user_profile', {});
    
    const userWeight = parseFloat(userProfile.weight) || 0;
    const userHeight = parseFloat(userProfile.height) || 0;
    const userAge = parseInt(userProfile.age) || 0;
    const userSex = userProfile.sex || 'hombre'; // Default seguro

    let statsHtml = '';

    if (userWeight > 0 && userHeight > 0) {
        const bmr = Formulas.calcBMR(userWeight, userHeight, userAge, userSex);
        const multiplier = (Formulas.ACTIVITY_MULTIPLIERS && Formulas.ACTIVITY_MULTIPLIERS[type]) || 1.2;
        
        // Calculamos solo el gasto específico de la actividad (Delta sobre base sedentaria 1.2)
        const activityKcal = Math.max(0, Math.round(bmr * (multiplier - 1.2)));
        const macros = Formulas.calcMacros(activityKcal, type);

        statsHtml = `
            <div class="activity-stats">
                <div class="stat-pill stat-pill--kcal">🔥 ${activityKcal} kcal</div>
                <div class="stat-pill">🥩 ${macros.p}g</div>
                <div class="stat-pill">🍚 ${macros.c}g</div>
                <div class="stat-pill">🥑 ${macros.f}g</div>
            </div>
        `;
    } else {
        statsHtml = `<div class="text-muted text-center" style="font-size:0.8rem; margin-top:10px; opacity:0.7;">Configura la calculadora para ver macros</div>`;
    }

    return `
        <div class="activity-main">${rutina.titulo}</div>
        <div style="font-size: 0.9rem; margin-top: 4px; opacity: 0.9;">${rutina.ejercicios}</div>
        ${statsHtml}
        <div class="activity-desc">${rutina.explicacion}</div>
    `;
}

// Función global para actualizar la tarjeta al cambiar el select
window.updateActivity = function(dayIndex, type) {
    // 3. Guardado sincronizado: Actualizamos el array completo del plan
    const weeklyPlan = DB.get('user_activity_plan', Array(7).fill('descanso'));
    weeklyPlan[dayIndex] = type;
    DB.save('user_activity_plan', weeklyPlan);
    
    const contentDiv = document.getElementById(`rutina-content-${dayIndex}`);
    
    if (contentDiv) {
        // Pequeño feedback visual
        contentDiv.style.opacity = '0.5';
        setTimeout(() => contentDiv.style.opacity = '1', 200);

        contentDiv.innerHTML = generateRoutineContent(type);
    }
};