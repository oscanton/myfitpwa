/* =========================================
   data/comestibles.js - DATOS
   ========================================= */

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
        { id: "suplemento_proteina", titulo: "Proteína en polvo 150 g" }
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
