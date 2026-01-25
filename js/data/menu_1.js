/* =========================================
   data/menu.js - DATOS
   ========================================= */

window.MENU_DATA = [
    {
        dia: "Lunes",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "avena", amount: 60 },
                { foodId: "yogur_natural", amount: 125 },
                { foodId: "frutos_rojos", amount: 100 }
            ],
            description: "Desayuno rico en fibra soluble."
        },
        comida: {
            items: [
                { foodId: "pollo", amount: 220 },
                { foodId: "arroz", amount: 140 },
                { foodId: "calabacin", amount: 200 },
                { foodId: "zanahoria", amount: 100 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Comida principal equilibrada."
        },
        cena: {
            items: [
                { foodId: "merluza", amount: 200 },
                { foodId: "coliflor", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena ligera post-entreno."
        }
    },
    {
        dia: "Martes",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "pan_integral", amount: 80 },
                { foodId: "tomate", amount: 100 },
                { foodId: "pavo", amount: 100 }
            ],
            description: "Tostadas saladas con proteína magra."
        },
        comida: {
            items: [
                { foodId: "lentejas", amount: 280 },
                { foodId: "zanahoria", amount: 120 },
                { foodId: "puerro", amount: 80 },
                { foodId: "arroz", amount: 60 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Legumbre completa y digestiva."
        },
        cena: {
            items: [
                { foodId: "salmon", amount: 160 },
                { foodId: "espinacas", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Omega-3 y verdura cocinada."
        }
    },
    {
        dia: "Miércoles",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "huevo", amount: 2 },
                { foodId: "pan_integral", amount: 70 },
                { foodId: "tomate", amount: 80 },
                { foodId: "fruta", amount: 150 }
            ],
            description: "Desayuno proteico y energético."
        },
        comida: {
            items: [
                { foodId: "ternera", amount: 220 },
                { foodId: "quinoa", amount: 160 },
                { foodId: "pimiento", amount: 150 },
                { foodId: "calabacin", amount: 150 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Comida alta en energía y proteína."
        },
        cena: {
            items: [
                { foodId: "pavo", amount: 180 },
                { foodId: "alcachofa", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "yogur_griego", amount: 125 }
            ],
            description: "Recuperación post-entreno sin pesadez."
        }
    },
    {
        dia: "Jueves",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "avena", amount: 50 },
                { foodId: "leche", amount: 200 },
                { foodId: "fruta", amount: 150 }
            ],
            description: "Desayuno sencillo y saciante."
        },
        comida: {
            items: [
                { foodId: "atun", amount: 180 },
                { foodId: "patata", amount: 260 },
                { foodId: "tomate", amount: 120 },
                { foodId: "lechuga", amount: 180 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Plato fresco y fácil de preparar."
        },
        cena: {
            items: [
                { foodId: "calamar", amount: 200 },
                { foodId: "calabacin", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena muy ligera."
        }
    },
    {
        dia: "Viernes",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "yogur_griego", amount: 170 },
                { foodId: "avena", amount: 40 },
                { foodId: "miel", amount: 10 }
            ],
            description: "Desayuno más calórico para día de entreno."
        },
        comida: {
            items: [
                { foodId: "pavo", amount: 240 },
                { foodId: "cuscus", amount: 160 },
                { foodId: "zanahoria", amount: 120 },
                { foodId: "puerro", amount: 100 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Comida fuerte previa al entreno."
        },
        cena: {
            items: [
                { foodId: "huevo", amount: 3 },
                { foodId: "champinones", amount: 250 },
                { foodId: "patata", amount: 150 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena post-entreno con proteína completa."
        }
    },
    {
        dia: "Sábado",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "pan_integral", amount: 70 },
                { foodId: "queso_fresco", amount: 200 },
                { foodId: "fruta", amount: 150 }
            ],
            description: "Desayuno equilibrado."
        },
        comida: {
            items: [
                { foodId: "salmon", amount: 200 },
                { foodId: "arroz", amount: 120 },
                { foodId: "brocoli", amount: 200 },
                { foodId: "zanahoria", amount: 100 },
                { foodId: "aceite_oliva", amount: 5 },
                { foodId: "fruta", amount: 200 }
            ],
            description: "Comida completa con grasa saludable."
        },
        cena: {
            items: [
                { foodId: "lomo_cerdo", amount: 180 },
                { foodId: "coliflor", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena real y sencilla."
        }
    },
    {
        dia: "Domingo",
        desayuno: {
            items: [
                { foodId: "cafe", amount: 1 },
                { foodId: "huevo", amount: 2 },
                { foodId: "aguacate", amount: 80 },
                { foodId: "pan_integral", amount: 50 }
            ],
            description: "Desayuno completo."
        },
        comida: {
            items: [
                { foodId: "lomo_cerdo", amount: 220 },
                { foodId: "patata", amount: 240 },
                { foodId: "tomate", amount: 120 },
                { foodId: "lechuga", amount: 180 },
                { foodId: "aceite_oliva", amount: 10 },
                { foodId: "yogur_natural", amount: 125 }
            ],
            description: "Comida variada para cerrar la semana."
        },
        cena: {
            items: [
                { foodId: "atun", amount: 180 },
                { foodId: "espinacas", amount: 250 },
                { foodId: "aceite_oliva", amount: 5 }
            ],
            description: "Cena ligera y digestiva."
        }
    }
];
