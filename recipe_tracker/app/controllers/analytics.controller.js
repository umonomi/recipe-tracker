const db = require("../models");
const { QueryTypes } = require("sequelize");

// 1. Поиск рецептов по ингредиентам (старый)
exports.searchByIngredients = async (req, res) => {
  const { ingredients } = req.query;
  if (!ingredients) {
    return res.status(400).send({ message: "Укажите ингредиенты через запятую" });
  }
  
  const query = `
    SELECT DISTINCT 
      r.id, r.title, r.cooking_time_minutes, r.difficulty, r.image_url,
      COUNT(*) AS total_ingredients,
      STRING_AGG(DISTINCT i.name, ', ') AS matched_ingredients
    FROM recipes r
    JOIN recipe_ingredients ri ON r.id = ri."recipeId"
    JOIN ingredients i ON i.id = ri."ingredientId"
    WHERE LOWER(i.name) IN (${ingredients.split(',').map(i => `LOWER('${i.trim()}')`).join(',')})
    GROUP BY r.id
    ORDER BY total_ingredients DESC
  `;
  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT });
    res.send({ search_ingredients: ingredients, found_recipes: result });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 2. Топ рецептов по количеству ингредиентов
exports.getTopRecipesByIngredients = async (req, res) => {
  const query = `
    SELECT 
      r.id, r.title, r.cooking_time_minutes, r.difficulty,
      COUNT(*) AS ingredient_count,
      c.name AS category_name
    FROM recipes r
    JOIN recipe_ingredients ri ON r.id = ri."recipeId"
    LEFT JOIN categories c ON r."categoryId" = c.id
    GROUP BY r.id, c.name
    ORDER BY ingredient_count DESC
    LIMIT 5
  `;
  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 3. Популярные категории
exports.getTopCategories = async (req, res) => {
  const query = `
    SELECT 
      c.id, c.name, c.icon,
      COUNT(r.id) AS recipe_count,
      ROUND((COUNT(r.id) * 100.0 / (SELECT COUNT(*) FROM recipes))::numeric, 1) AS percentage
    FROM categories c
    LEFT JOIN recipes r ON c.id = r."categoryId"
    GROUP BY c.id
    ORDER BY recipe_count DESC
  `;
  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT });
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 4. Питательная ценность рецепта
exports.getRecipeNutrition = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const recipeQuery = `
      SELECT id, title, servings, cooking_time_minutes, difficulty
      FROM recipes
      WHERE id = ${recipeId}
    `;
    const recipeResult = await db.sequelize.query(recipeQuery, { type: QueryTypes.SELECT });
    if (!recipeResult.length) {
      return res.status(404).send({ message: "Recipe not found" });
    }
    const recipe = recipeResult[0];

    const ingredientsQuery = `
      SELECT 
        i.id, i.name, i.unit, i.calories_per_unit, i.protein_per_unit, i.fat_per_unit, i.carbs_per_unit,
        ri.quantity, ri.unit_override, ri.notes
      FROM recipe_ingredients ri
      JOIN ingredients i ON i.id = ri."ingredientId"
      WHERE ri."recipeId" = ${recipeId}
    `;
    const ingredients = await db.sequelize.query(ingredientsQuery, { type: QueryTypes.SELECT });

    let totalCalories = 0, totalProtein = 0, totalFat = 0, totalCarbs = 0;
    const formattedIngredients = ingredients.map(ing => {
      const qty = ing.quantity;
      const cals = ing.calories_per_unit * qty;
      const prot = ing.protein_per_unit * qty;
      const fat = ing.fat_per_unit * qty;
      const carbs = ing.carbs_per_unit * qty;
      totalCalories += cals;
      totalProtein += prot;
      totalFat += fat;
      totalCarbs += carbs;
      return {
        name: ing.name,
        quantity: qty,
        unit: ing.unit_override || ing.unit,
        calories: cals,
        protein: prot,
        fat: fat,
        carbs: carbs
      };
    });

    const servings = recipe.servings || 1;
    const response = {
      id: recipe.id,
      title: recipe.title,
      servings: recipe.servings,
      cooking_time_minutes: recipe.cooking_time_minutes,
      difficulty: recipe.difficulty,
      ingredients: formattedIngredients,
      calories_per_serving: Math.round(totalCalories / servings * 10) / 10,
      total_protein: Math.round(totalProtein / servings * 10) / 10,
      total_fat: Math.round(totalFat / servings * 10) / 10,
      total_carbs: Math.round(totalCarbs / servings * 10) / 10
    };
    res.send(response);
  } catch (err) {
    console.error("Nutrition error:", err);
    res.status(500).send({ message: err.message });
  }
};

// 5. Поиск по времени
exports.getRecipesByTime = async (req, res) => {
  const { maxMinutes } = req.params;
  const query = `
    SELECT 
      r.id, r.title, r.cooking_time_minutes, r.difficulty, r.image_url,
      c.name AS category_name,
      COUNT(*) AS ingredients_count
    FROM recipes r
    JOIN recipe_ingredients ri ON r.id = ri."recipeId"
    LEFT JOIN categories c ON r."categoryId" = c.id
    WHERE r.cooking_time_minutes <= ${maxMinutes}
    GROUP BY r.id, c.name
    ORDER BY r.cooking_time_minutes ASC
    LIMIT 10
  `;
  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT });
    res.send({ max_minutes: maxMinutes, found_recipes: result, count: result.length });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 6. Статистика пользователя
exports.getUserStats = async (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT 
      u.id, u.username,
      COUNT(DISTINCT r.id) AS total_recipes,
      COUNT(DISTINCT ri."recipeId") AS total_ingredients_used,
      ROUND(AVG(r.cooking_time_minutes)::numeric, 1) AS avg_cooking_time,
      MIN(r.cooking_time_minutes) AS fastest_recipe,
      MAX(r.cooking_time_minutes) AS longest_recipe,
      STRING_AGG(DISTINCT c.name, ', ') AS favorite_categories
    FROM users u
    LEFT JOIN recipes r ON u.id = r."authorId"
    LEFT JOIN recipe_ingredients ri ON r.id = ri."recipeId"
    LEFT JOIN categories c ON r."categoryId" = c.id
    WHERE u.id = ${userId}
    GROUP BY u.id
  `;
  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT });
    if (result.length === 0 || !result[0].id) {
      return res.status(404).send({ message: "User not found or no recipes" });
    }
    res.send(result[0]);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// 7. Дешёвые рецепты
exports.getBudgetRecipes = async (req, res) => {
  const query = `
    SELECT r.id, r.title, COUNT(*) AS ingredients_count
    FROM recipes r
    JOIN recipe_ingredients ri ON r.id = ri."recipeId"
    GROUP BY r.id
    ORDER BY ingredients_count ASC
    LIMIT 5
  `;
  try {
    const result = await db.sequelize.query(query, { type: QueryTypes.SELECT });
    res.send({ message: "Рецепты с наименьшим количеством ингредиентов", recipes: result });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
