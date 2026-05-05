const db = require("../models");

// Добавить связь рецепта с ингредиентом
exports.create = async (req, res) => {
  try {
    const recipeIngredient = await db.RecipeIngredient.create(req.body);
    res.status(201).send(recipeIngredient);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить все ингредиенты для конкретного рецепта
exports.findByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const ingredients = await db.RecipeIngredient.findAll({
      where: { recipeId },
      include: ['ingredient']
    });
    res.send(ingredients);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Обновить связь (количество, unit_override, notes)
exports.update = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await db.RecipeIngredient.update(req.body, {
      where: { id }
    });
    if (updated === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    const updatedRecord = await db.RecipeIngredient.findByPk(id);
    res.send(updatedRecord);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить одну связь (конкретный ингредиент из рецепта)
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db.RecipeIngredient.destroy({ where: { id } });
    if (deleted === 0) {
      return res.status(404).send({ message: "Record not found" });
    }
    res.send({ message: "Ingredient removed from recipe" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Удалить ВСЕ ингредиенты из рецепта (при обновлении рецепта)
exports.deleteByRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    await db.RecipeIngredient.destroy({ where: { recipeId } });
    res.send({ message: "All ingredients removed from recipe" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};