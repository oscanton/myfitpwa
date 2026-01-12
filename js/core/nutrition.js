/* =========================================
   core/nutrition.js - LÓGICA NUTRICIONAL
   ========================================= */

const NUTRITION = {
    calculateItem: (foodId, amount) => {
        const food = FOODS[foodId];
        if (!food) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };

        const factor = food.nutritionPer100 ? amount / 100 : amount;
        const source = food.nutritionPer100 || food.nutritionPerUnit;

        return {
            kcal: source.kcal * factor,
            protein: source.protein * factor,
            carbs: source.carbs * factor,
            fat: source.fat * factor
        };
    },
    calculateMeal: (items) => {
        return items.reduce((acc, item) => {
            const nut = NUTRITION.calculateItem(item.foodId, item.amount);
            return {
                kcal: acc.kcal + nut.kcal,
                protein: acc.protein + nut.protein,
                carbs: acc.carbs + nut.carbs,
                fat: acc.fat + nut.fat
            };
        }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    }
};
