/* =========================================
   data/menu_1.js - DATOS
   ========================================= */

// --- 3. PLAN: MENÚ SEMANAL ---
window.MENU_DATA = [
    {
        dia: "Lunes",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "avena", amount: 50 },
                { foodId: "yogur_natural", amount: 125 },
                { foodId: "frutos_rojos", amount: 100 }
            ],
            description: "Desayuno digestivo con fibra soluble."
        },
        comida: {
            items: [
                { foodId: "pollo", amount: 200 },
                { foodId: "arroz", amount: 120 },
                { foodId: "calabacin", amount: 200 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Base clásica y fácil de digerir."
        },
        cena: {
            items: [
                { foodId: "merluza", amount: 220 },
                { foodId: "patata", amount: 250 },
                { foodId: "judias_verdes", amount: 200 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Post-entreno: proteína magra y carbohidrato limpio."
        }
    },
    {
        dia: "Martes",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "pan_integral", amount: 80 },
                { foodId: "tomate", amount: 80 },
                { foodId: "pavo", amount: 100 }
            ],
            description: "Tostada salada ligera."
        },
        comida: {
            items: [
                { foodId: "lentejas", amount: 250 },
                { foodId: "zanahoria", amount: 80 },
                { foodId: "arroz", amount: 60 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Legumbre suave con cereal."
        },
        cena: {
            items: [
                { foodId: "salmon", amount: 180 },
                { foodId: "espinacas", amount: 200 },
                { foodId: "patata", amount: 150 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena saciante rica en omega-3."
        }
    },
    {
        dia: "Miércoles",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "yogur_griego", amount: 125 },
                { foodId: "platano", amount: 150 },
                { foodId: "frutos_secos", amount: 20 }
            ],
            description: "Energía sostenida para el día."
        },
        comida: {
            items: [
                { foodId: "ternera", amount: 180 },
                { foodId: "quinoa", amount: 120 },
                { foodId: "pimiento", amount: 150 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Hierro y carbohidrato complejo."
        },
        cena: {
            items: [
                { foodId: "pollo", amount: 220 },
                { foodId: "arroz", amount: 140 },
                { foodId: "brocoli", amount: 200 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "kiwi", amount: 150 }
            ],
            description: "Post-entreno con apoyo digestivo."
        }
    },
    {
        dia: "Jueves",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "avena", amount: 45 },
                { foodId: "leche", amount: 200 },
                { foodId: "fruta", amount: 150 }
            ],
            description: "Desayuno simple y saciante."
        },
        comida: {
            items: [
                { foodId: "atun", amount: 160 },
                { foodId: "patata", amount: 250 },
                { foodId: "ensalada", amount: 300 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Plato frío y fácil de preparar."
        },
        cena: {
            items: [
                { foodId: "calamar", amount: 200 },
                { foodId: "calabacin", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena ligera para descanso."
        }
    },
    {
        dia: "Viernes",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "pan_integral", amount: 70 },
                { foodId: "queso_fresco", amount: 200 },
                { foodId: "fruta", amount: 150 }
            ],
            description: "Proteína láctea y carbohidrato moderado."
        },
        comida: {
            items: [
                { foodId: "pavo", amount: 200 },
                { foodId: "cuscus", amount: 120 },
                { foodId: "verduras", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Comida equilibrada previa al entreno."
        },
        cena: {
            items: [
                { foodId: "lomo_cerdo", amount: 200 },
                { foodId: "patata", amount: 250 },
                { foodId: "judias_verdes", amount: 200 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Recarga post-entreno sin pesadez."
        }
    },
    {
        dia: "Sábado",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "yogur_natural", amount: 125 },
                { foodId: "miel", amount: 15 },
                { foodId: "frutos_secos", amount: 20 }
            ],
            description: "Desayuno cómodo y digestivo."
        },
        comida: {
            items: [
                { foodId: "salmon", amount: 200 },
                { foodId: "arroz", amount: 100 },
                { foodId: "brocoli", amount: 200 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Grasa saludable y vegetal."
        },
        cena: {
            items: [
                { foodId: "huevo", amount: 2 },
                { foodId: "champinones", amount: 250 },
                { foodId: "pimiento", amount: 100 },
                { foodId: "aceite_oliva", amount: 10 }
            ],
            description: "Cena sencilla y baja en carbohidrato."
        }
    },
    {
        dia: "Domingo",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "pan_integral", amount: 60 },
                { foodId: "aguacate", amount: 80 },
                { foodId: "pavo", amount: 80 }
            ],
            description: "Desayuno relajado y completo."
        },
        comida: {
            items: [
                { foodId: "pollo", amount: 200 },
                { foodId: "patata", amount: 200 },
                { foodId: "ensalada", amount: 300 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Comida limpia de domingo."
        },
        cena: {
            items: [
                { foodId: "verduras", amount: 350 },
                { foodId: "merluza", amount: 180 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena suave para cerrar la semana."
        }
    }
];
