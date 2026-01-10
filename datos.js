/* =========================================
   datos.js - BASE DE DATOS LOCAL
   ========================================= */

// --- 1. CONFIGURACIÓN GLOBAL ---
const APP_CONFIG = Object.freeze({
    year: 2026,
    version: "2.0"
});

// --- 2. LIBRERÍA DE ALIMENTOS (MACROS) ---
// Estructura: kcal, protein (P), carbs (C), fat (G)
const FOODS = {
    // A - C
    aceite_oliva:      { name: "Aceite de oliva", unit: "g", nutritionPer100: { kcal: 900, protein: 0, carbs: 0, fat: 100 } },
    aguacate:          { name: "Aguacate", unit: "g", nutritionPer100: { kcal: 160, protein: 2, carbs: 9, fat: 15 } },
    alcachofa:         { name: "Alcachofa", unit: "g", nutritionPer100: { kcal: 50, protein: 3, carbs: 11, fat: 0 } },
    almendras:         { name: "Almendras", unit: "g", nutritionPer100: { kcal: 579, protein: 21, carbs: 22, fat: 50 } },
    alubias:           { name: "Alubias", unit: "g", nutritionPer100: { kcal: 110, protein: 8, carbs: 20, fat: 0 } },
    arroz:             { name: "Arroz cocido", unit: "g", nutritionPer100: { kcal: 130, protein: 3, carbs: 28, fat: 0 } },
    arroz_integral:    { name: "Arroz integral", unit: "g", nutritionPer100: { kcal: 123, protein: 3, carbs: 26, fat: 1 } },
    atun:              { name: "Atún", unit: "g", nutritionPer100: { kcal: 109, protein: 24, carbs: 0, fat: 1 } },
    avena:             { name: "Avena", unit: "g", nutritionPer100: { kcal: 370, protein: 13, carbs: 60, fat: 7 } },
    bonito:            { name: "Bonito", unit: "g", nutritionPer100: { kcal: 140, protein: 24, carbs: 0, fat: 5 } },
    brocoli:           { name: "Brócoli", unit: "g", nutritionPer100: { kcal: 35, protein: 3, carbs: 7, fat: 0 } },
    cafe:              { name: "Café", unit: "ud", nutritionPerUnit: { kcal: 0, protein: 0, carbs: 0, fat: 0 } },
    calabacin:         { name: "Calabacín", unit: "g", nutritionPer100: { kcal: 17, protein: 2, carbs: 3, fat: 0 } },
    calamar:           { name: "Calamar", unit: "g", nutritionPer100: { kcal: 92, protein: 16, carbs: 3, fat: 1 } },
    carne_magra:       { name: "Carne magra", unit: "g", nutritionPer100: { kcal: 140, protein: 26, carbs: 0, fat: 4 } },
    cebolla:           { name: "Cebolla", unit: "g", nutritionPer100: { kcal: 40, protein: 1, carbs: 9, fat: 0 } },
    champinones:       { name: "Champiñones", unit: "g", nutritionPer100: { kcal: 22, protein: 3, carbs: 3, fat: 0 } },
    coles_bruselas:    { name: "Coles Bruselas", unit: "g", nutritionPer100: { kcal: 45, protein: 3, carbs: 9, fat: 0 } },
    coliflor:          { name: "Coliflor", unit: "g", nutritionPer100: { kcal: 25, protein: 2, carbs: 5, fat: 0 } },
    cuscus:            { name: "Cuscús cocido", unit: "g", nutritionPer100: { kcal: 110, protein: 4, carbs: 23, fat: 0 } },
    
    // E - L
    ensalada:          { name: "Ensalada mix", unit: "g", nutritionPer100: { kcal: 20, protein: 1, carbs: 3, fat: 0 } },
    espinacas:         { name: "Espinacas", unit: "g", nutritionPer100: { kcal: 23, protein: 3, carbs: 4, fat: 1 } },
    fruta:             { name: "Fruta variada", unit: "g", nutritionPer100: { kcal: 55, protein: 1, carbs: 13, fat: 0 } },
    frutos_rojos:      { name: "Frutos rojos", unit: "g", nutritionPer100: { kcal: 45, protein: 1, carbs: 10, fat: 1 } },
    frutos_secos:      { name: "Frutos secos", unit: "g", nutritionPer100: { kcal: 600, protein: 18, carbs: 16, fat: 55 } },
    garbanzos:         { name: "Garbanzos", unit: "g", nutritionPer100: { kcal: 165, protein: 9, carbs: 27, fat: 3 } },
    hamburguesa_magra: { name: "Hamburguesa", unit: "g", nutritionPer100: { kcal: 170, protein: 20, carbs: 2, fat: 8 } },
    huevo:             { name: "Huevo", unit: "ud", nutritionPerUnit: { kcal: 78, protein: 6.5, carbs: 0.6, fat: 5.3 } },
    infusion:          { name: "Infusión", unit: "ud", nutritionPerUnit: { kcal: 0, protein: 0, carbs: 0, fat: 0 } },
    judias_verdes:     { name: "Judías verdes", unit: "g", nutritionPer100: { kcal: 31, protein: 2, carbs: 7, fat: 0 } },
    kiwi:              { name: "Kiwi", unit: "g", nutritionPer100: { kcal: 60, protein: 1, carbs: 14, fat: 0 } },
    lentejas:          { name: "Lentejas", unit: "g", nutritionPer100: { kcal: 115, protein: 9, carbs: 20, fat: 0 } },
    lomo_cerdo:        { name: "Lomo cerdo", unit: "g", nutritionPer100: { kcal: 150, protein: 26, carbs: 0, fat: 5 } },
    
    // M - Z
    mandarina:         { name: "Mandarina", unit: "g", nutritionPer100: { kcal: 50, protein: 1, carbs: 13, fat: 0 } },
    merluza:           { name: "Merluza", unit: "g", nutritionPer100: { kcal: 89, protein: 18, carbs: 0, fat: 1 } },
    nueces:            { name: "Nueces", unit: "g", nutritionPer100: { kcal: 650, protein: 15, carbs: 14, fat: 65 } },
    pan:               { name: "Pan blanco", unit: "g", nutritionPer100: { kcal: 260, protein: 9, carbs: 50, fat: 3 } },
    pan_integral:      { name: "Pan integral", unit: "g", nutritionPer100: { kcal: 240, protein: 8, carbs: 45, fat: 3 } },
    patata:            { name: "Patata cocida", unit: "g", nutritionPer100: { kcal: 80, protein: 2, carbs: 18, fat: 0 } },
    pavo:              { name: "Pavo", unit: "g", nutritionPer100: { kcal: 110, protein: 24, carbs: 0, fat: 1 } },
    pescado_azul:      { name: "Pescado azul", unit: "g", nutritionPer100: { kcal: 180, protein: 22, carbs: 0, fat: 10 } },
    pescado_blanco:    { name: "Pescado blanco", unit: "g", nutritionPer100: { kcal: 90, protein: 20, carbs: 0, fat: 1 } },
    pimiento:          { name: "Pimientos", unit: "g", nutritionPer100: { kcal: 30, protein: 1, carbs: 6, fat: 0 } },
    platano:           { name: "Plátano", unit: "g", nutritionPer100: { kcal: 90, protein: 1, carbs: 23, fat: 0 } },
    pollo:             { name: "Pollo", unit: "g", nutritionPer100: { kcal: 120, protein: 27, carbs: 0, fat: 2 } },
    proteina:          { name: "Whey Protein", unit: "g", nutritionPer100: { kcal: 400, protein: 80, carbs: 8, fat: 6 } },
    queso_fresco:      { name: "Queso fresco", unit: "g", nutritionPer100: { kcal: 90, protein: 12, carbs: 3, fat: 4 } },
    quinoa:            { name: "Quinoa cocida", unit: "g", nutritionPer100: { kcal: 120, protein: 4, carbs: 21, fat: 2 } },
    salmon:            { name: "Salmón", unit: "g", nutritionPer100: { kcal: 200, protein: 20, carbs: 0, fat: 13 } },
    sardinas:          { name: "Sardinas", unit: "g", nutritionPer100: { kcal: 210, protein: 25, carbs: 0, fat: 11 } },
    ternera:           { name: "Ternera", unit: "g", nutritionPer100: { kcal: 170, protein: 26, carbs: 0, fat: 7 } },
    tomate:            { name: "Tomate", unit: "g", nutritionPer100: { kcal: 18, protein: 1, carbs: 4, fat: 0 } },
    verduras:          { name: "Verduras mix", unit: "g", nutritionPer100: { kcal: 30, protein: 2, carbs: 5, fat: 0 } },
    yogur_griego:      { name: "Yogur griego", unit: "g", nutritionPer100: { kcal: 120, protein: 10, carbs: 4, fat: 6 } },
    yogur_natural:     { name: "Yogur natural", unit: "g", nutritionPer100: { kcal: 60, protein: 5, carbs: 4, fat: 3 } },
    zanahoria:         { name: "Zanahoria", unit: "g", nutritionPer100: { kcal: 40, protein: 1, carbs: 10, fat: 0 } }
};

// --- 3. PLAN: MENÚ SEMANAL ---
const MENU_DATA = [
    {
        dia: "Lunes",
        desayuno: {
            items: [{ foodId: "cafe", amount: 1 }, { foodId: "yogur_griego", amount: 125 }, { foodId: "proteina", amount: 35 }, { foodId: "frutos_rojos", amount: 100 }],
            description: "Foco en grasas saludables y antioxidantes."
        },
        comida: {
            items: [{ foodId: "lomo_cerdo", amount: 200 }, { foodId: "aceite_oliva", amount: 10 }, { foodId: "ensalada", amount: 300 }, { foodId: "fruta", amount: 200 }],
            description: "Comida limpia con aporte graso controlado."
        },
        cena: {
            items: [{ foodId: "huevo", amount: 2 }, { foodId: "patata", amount: 250 }, { foodId: "judias_verdes", amount: 200 }, { foodId: "aceite_oliva", amount: 10 }, { foodId: "yogur_natural", amount: 125 }],
            description: "Recuperación post-fuerza: Proteína + Glucógeno."
        }
    },
    {
        dia: "Martes",
        desayuno: {
            items: [{ foodId: "cafe", amount: 1 }, { foodId: "pan_integral", amount: 80 }, { foodId: "tomate", amount: 60 }, { foodId: "pavo", amount: 100 }],
            description: "Tostada clásica y rápida."
        },
        comida: {
            items: [{ foodId: "pollo", amount: 200 }, { foodId: "arroz_integral", amount: 130 }, { foodId: "calabacin", amount: 200 }, { foodId: "aceite_oliva", amount: 10 }, { foodId: "fruta", amount: 200 }],
            description: "Pollo con base de arroz y vegetal."
        },
        cena: {
            items: [{ foodId: "merluza", amount: 200 }, { foodId: "pan_integral", amount: 40 }, { foodId: "ensalada", amount: 300 }],
            description: "Cena ligera de descanso."
        }
    },
    {
        dia: "Miércoles",
        desayuno: {
            items: [{ foodId: "proteina", amount: 35 }, { foodId: "platano", amount: 150 }, { foodId: "frutos_secos", amount: 20 }],
            description: "Rápido, saciante y energético."
        },
        comida: {
            items: [{ foodId: "quinoa", amount: 150 }, { foodId: "atun", amount: 150 }, { foodId: "aguacate", amount: 120 }, { foodId: "tomate", amount: 120 }, { foodId: "yogur_natural", amount: 125 }],
            description: "Bowl de quinoa con grasas vegetales."
        },
        cena: {
            items: [{ foodId: "lomo_cerdo", amount: 180 }, { foodId: "aceite_oliva", amount: 5 }, { foodId: "patata", amount: 250 }, { foodId: "espinacas", amount: 150 }, { foodId: "kiwi", amount: 150 }],
            description: "Post-entreno: Magro y patata."
        }
    },
    {
        dia: "Jueves",
        desayuno: {
            items: [{ foodId: "cafe", amount: 1 }, { foodId: "yogur_griego", amount: 125 }, { foodId: "avena", amount: 50 }, { foodId: "fruta", amount: 150 }],
            description: "Lácteo, cereal y fruta fresca."
        },
        comida: {
            items: [{ foodId: "lentejas", amount: 250 }, { foodId: "arroz", amount: 70 }, { foodId: "zanahoria", amount: 60 }, { foodId: "pimiento", amount: 80 }, { foodId: "fruta", amount: 200 }],
            description: "Legumbre con cereal (protein complete)."
        },
        cena: {
            items: [{ foodId: "huevo", amount: 2 }, { foodId: "champinones", amount: 250 }, { foodId: "aceite_oliva", amount: 15 }],
            description: "Cena ligera low-carb."
        }
    },
    {
        dia: "Viernes",
        desayuno: {
            items: [{ foodId: "cafe", amount: 1 }, { foodId: "pan_integral", amount: 80 }, { foodId: "huevo", amount: 2 }, { foodId: "aceite_oliva", amount: 10 }],
            description: "Base proteica y grasa para el día."
        },
        comida: {
            items: [{ foodId: "salmon", amount: 180 }, { foodId: "coliflor", amount: 200 }, { foodId: "brocoli", amount: 200 }, { foodId: "yogur_natural", amount: 125 }],
            description: "Saciante y antiinflamatoria (Omega-3)."
        },
        cena: {
            items: [{ foodId: "pollo", amount: 200 }, { foodId: "patata", amount: 350 }, { foodId: "ensalada", amount: 200 }, { foodId: "fruta", amount: 200 }],
            description: "Carga de micronutrientes y fibra."
        }
    },
    {
        dia: "Sábado",
        desayuno: {
            items: [{ foodId: "cafe", amount: 1 }, { foodId: "proteina", amount: 35 }, { foodId: "pan_integral", amount: 80 }, { foodId: "frutos_secos", amount: 15 }],
            description: "Pre-actividad aeróbica."
        },
        comida: {
            items: [{ foodId: "pavo", amount: 200 }, { foodId: "cuscus", amount: 100 }, { foodId: "pimiento", amount: 200 }, { foodId: "aceite_oliva", amount: 10 }, { foodId: "fruta", amount: 200 }],
            description: "Comida de sábado balanceada."
        },
        cena: {
            items: [{ foodId: "calamar", amount: 200 }, { foodId: "ensalada", amount: 200 }, { foodId: "yogur_natural", amount: 125 }],
            description: "Proteína limpia del mar."
        }
    },
    {
        dia: "Domingo",
        desayuno: {
            items: [{ foodId: "cafe", amount: 1 }, { foodId: "pan_integral", amount: 40 }, { foodId: "queso_fresco", amount: 250 }, { foodId: "fruta", amount: 200 }],
            description: "Lácteo fresco y fruta."
        },
        comida: {
            items: [{ foodId: "ternera", amount: 200 }, { foodId: "ensalada", amount: 300 }, { foodId: "aceite_oliva", amount: 5 }, { foodId: "fruta", amount: 200 }],
            description: "Carne roja magra y saciedad."
        },
        cena: {
            items: [{ foodId: "verduras", amount: 350 }, { foodId: "aceite_oliva", amount: 10 }, { foodId: "huevo", amount: 2 }],
            description: "Reset digestivo para la semana."
        }
    }
];

// --- 4. PLAN: OBJETIVOS ---
const DAILY_NUTRITION_TARGETS = {
    Lunes:     { kcal: 1900, protein: 140, carbs: 190, fat: 60 },
    Martes:    { kcal: 1700, protein: 130, carbs: 160, fat: 55 },
    Miércoles: { kcal: 1900, protein: 140, carbs: 190, fat: 60 },
    Jueves:    { kcal: 1700, protein: 130, carbs: 160, fat: 55 },
    Viernes:   { kcal: 2000, protein: 150, carbs: 210, fat: 65 },
    Sábado:    { kcal: 1900, protein: 140, carbs: 190, fat: 60 },
    Domingo:   { kcal: 1700, protein: 130, carbs: 160, fat: 55 }
};

// --- 5. PLAN: ACTIVIDAD FÍSICA ---
const ACTIVIDAD_DATA = [
    {
        dia: "Lunes",
        titulo: "Gym 1h: 70% Fuerza + 30% Cardio",
        ejercicios: "Sentadillas, Press Banca, Remo con barra",
        explicacion: "Enfoque en grandes grupos musculares. Cardio final en cinta o elíptica."
    },
    {
        dia: "Martes",
        titulo: "Descanso",
        ejercicios: "Recuperación total",
        explicacion: "Hidratación y movilidad suave."
    },
    {
        dia: "Miércoles",
        titulo: "Gym 1h: 90% Fuerza + 10% Cardio",
        ejercicios: "Prensa, Remo polea baja, Press inclinado",
        explicacion: "Día de carga alta sin impacto lumbar."
    },
    {
        dia: "Jueves",
        titulo: "Mantenimiento activo",
        ejercicios: "Core, Planchas, Deadbug",
        explicacion: "Salud de la espalda y zona media."
    },
    {
        dia: "Viernes",
        titulo: "Gym 1.5h: Fuerza + HIIT",
        ejercicios: "Zancadas, Fondos, Jalón pecho + Intervalos",
        explicacion: "Sesión intensa pre-fin de semana."
    },
    {
        dia: "Sábado",
        titulo: "Aeróbico extensivo",
        ejercicios: "Caminata / Senderismo / Bici (Zona 2)",
        explicacion: "Quema de grasas a pulsaciones bajas."
    },
    {
        dia: "Domingo",
        titulo: "Movilidad y Relax",
        ejercicios: "Yoga básico, estiramientos",
        explicacion: "Preparación para la semana."
    }
];

// --- 6. PLAN: LISTA DE LA COMPRA ---
const COMESTIBLES_DATA = {
  categorias: [
    {
      nombre: "🥩 Proteínas",
      items: [
        { id: "pollo", titulo: "Pechuga de pollo 600 g" },
        { id: "pavo", titulo: "Pechuga de pavo 300 g", sub: "Alt: fiambre ≥90%" },
        { id: "lomo_cerdo", titulo: "Lomo de cerdo 400 g" },
        { id: "ternera", titulo: "Ternera magra 200 g" },
        { id: "salmon", titulo: "Salmón fresco 200 g" },
        { id: "merluza", titulo: "Merluza 200 g", sub: "Alt: pescadilla" },
        { id: "atun", titulo: "Atún al natural 2 latas" },
        { id: "calamar", titulo: "Calamar 200 g" },
        { id: "huevo", titulo: "Huevos 12 uds", sub: "Alt: claras pasteurizadas" },
        { id: "proteina", titulo: "Proteína en polvo 150 g" }
      ]
    },
    {
      nombre: "🥛 Lácteos",
      items: [
        { id: "yogur_griego", titulo: "Yogur griego natural 2×125 g" },
        { id: "yogur_natural", titulo: "Yogur natural 4×125 g" },
        { id: "queso_fresco", titulo: "Queso fresco 250 g" }
      ]
    },
    {
      nombre: "🍚 Cereales y legumbres",
      items: [
        { id: "pan_integral", titulo: "Pan integral 400 g" },
        { id: "arroz_integral", titulo: "Arroz integral 250 g" },
        { id: "arroz", titulo: "Arroz blanco 100 g" },
        { id: "quinoa", titulo: "Quinoa 200 g" },
        { id: "cuscus", titulo: "Cuscús 200 g" },
        { id: "avena", titulo: "Copos de avena 250 g" },
        { id: "lentejas", titulo: "Lentejas cocidas 1 frasco grande" }
      ]
    },
    {
      nombre: "🥔 Verduras y hortalizas",
      items: [
        { id: "patata", titulo: "Patata 1,5 kg" },
        { id: "ensalada", titulo: "Mezcla de ensalada 2 kg" },
        { id: "verduras", titulo: "Verduras variadas 500 g" },
        { id: "judias_verdes", titulo: "Judías verdes 250 g" },
        { id: "calabacin", titulo: "Calabacín 1 mediano" },
        { id: "espinacas", titulo: "Espinacas frescas 200 g" },
        { id: "brocoli", titulo: "Brócoli 1 unidad" },
        { id: "coliflor", titulo: "Coliflor 1 pequeña" },
        { id: "champinones", titulo: "Champiñones 250 g" },
        { id: "pimiento", titulo: "Pimientos variados 3 uds" },
        { id: "zanahoria", titulo: "Zanahorias 1 bolsa pequeña" },
        { id: "tomate", titulo: "Tomates 500 g" }
      ]
    },
    {
      nombre: "🍎 Fruta",
      items: [
        { id: "fruta", titulo: "Fruta variada 2 kg" },
        { id: "platano", titulo: "Plátanos 3 uds" },
        { id: "kiwi", titulo: "Kiwis 3 uds" },
        { id: "frutos_rojos", titulo: "Frutos rojos congelados 300 g" }
      ]
    },
    {
      nombre: "🥑 Grasas saludables y extras",
      items: [
        { id: "aceite_oliva", titulo: "Aceite de oliva virgen extra 500 ml" },
        { id: "frutos_secos", titulo: "Frutos secos naturales 100 g" },
        { id: "aguacate", titulo: "Aguacates 2 uds" },
        { id: "cafe", titulo: "Café natural" }
      ]
    }
  ]
};
