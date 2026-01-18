/* =========================================
   data/actividad.js - DATOS
   ========================================= */

const TIPOS_ACTIVIDAD = [
    { value: 'descanso', label: '💤 Descanso' },
    { value: 'descanso_activo', label: '🚶 Descanso Activo' },
    { value: 'cardio_1h', label: '🏃 1h Cardio' },
    { value: 'fuerza_1h', label: '🏋️ 1h Fuerza' },
    { value: 'cardio_fuerza_1h', label: '🔥 1h Cardio + Fuerza' },
    { value: 'cardio_fuerza_1_5h', label: '🔥 1.5h Cardio + Fuerza' }
];

// Catálogo indexado para acceso rápido (O(1)) por clave.
const ACTIVITY_CATALOG = TIPOS_ACTIVIDAD.reduce((acc, item) => {
    acc[item.value] = item;
    return acc;
}, {});

const RUTINAS = {
    'descanso': {
        titulo: "Recuperación Total",
        ejercicios: "Sin actividad física programada",
        explicacion: "Aprovecha para dormir bien, hidratarte y reducir el estrés. El músculo crece cuando descansas."
    },
    'descanso_activo': {
        titulo: "Movilidad y Recuperación",
        ejercicios: "Caminata ligera, Yoga suave o Estiramientos (30-45 min)",
        explicacion: "Actividad de bajo impacto para promover el flujo sanguíneo sin fatigar el sistema nervioso."
    },
    'cardio_1h': {
        titulo: "Resistencia Aeróbica (60 min)",
        ejercicios: "Correr, Bici, Elíptica o Natación",
        explicacion: "Mantén un ritmo constante en Zona 2 (puedes hablar pero te cuesta). Mejora la salud cardiovascular."
    },
    'fuerza_1h': {
        titulo: "Hipertrofia / Fuerza (60 min)",
        ejercicios: "Calentamiento + Rutina Full Body o Torso/Pierna",
        explicacion: "Ejercicios compuestos (Sentadilla, Press, Remo). Series de 8-12 reps. Controla la fase excéntrica. Descansos de 90s."
    },
    'cardio_fuerza_1h': {
        titulo: "Híbrido Eficiente (60 min)",
        ejercicios: "40' Fuerza (Circuito) + 20' Cardio",
        explicacion: "Reparto 66% Fuerza / 33% Cardio. Haz una rutina de fuerza intensa sin pausas largas y termina con 20 min de cardio moderado."
    },
    'cardio_fuerza_1_5h': {
        titulo: "Sesión Completa (90 min)",
        ejercicios: "60' Fuerza Pesada + 30' Cardio",
        explicacion: "Reparto 66% Fuerza / 33% Cardio. Dedica 1h a levantar pesado con buenos descansos. Finaliza con 30 min de cardio para oxidar grasas."
    }
};
