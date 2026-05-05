const db = require("../models");
const { Op } = require("sequelize");   // ← критически важно

exports.create = async (req, res) => {
  try {
    const recipeData = { ...req.body, authorId: req.userId };
    const recipe = await db.Recipe.create(recipeData);
    res.status(201).send(recipe);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const where = {};
    console.log('=== DEBUG findAll ===');
console.log('req.query.title =', req.query.title);

    if (req.query.categoryId) where.categoryId = req.query.categoryId;
    if (req.query.authorId) where.authorId = req.query.authorId;
    if (req.query.difficulty) where.difficulty = req.query.difficulty;

    // Поиск по названию (регистронезависимый, частичное совпадение)
    if (req.query.title && req.query.title.trim() !== "") {
      where.title = { [Op.iLike]: `%${req.query.title}%` };
    }

    // Фильтр по максимальному времени
    if (req.query.maxTime) {
      where.cooking_time_minutes = { [Op.lte]: req.query.maxTime };
    }

    const recipes = await db.Recipe.findAll({
      where,
      include: [
        { model: db.Category, attributes: ['name', 'icon'] },
        { model: db.User, attributes: ['username', 'avatar'] },
        { model: db.Ingredient, through: { attributes: ['quantity', 'unit_override', 'notes'] } }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.send(recipes);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const recipe = await db.Recipe.findByPk(req.params.id, {
      include: [
        { model: db.Category, attributes: ['name', 'icon'] },
        { model: db.User, attributes: ['username', 'avatar'] },
        { model: db.Ingredient, through: { attributes: ['quantity', 'unit_override', 'notes'] } }
      ]
    });
    if (!recipe) return res.status(404).send({ message: "Recipe not found" });
    res.send(recipe);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const recipe = await db.Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).send({ message: "Recipe not found" });
    if (recipe.authorId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).send({ message: "No permission to edit this recipe" });
    }
    await recipe.update(req.body);
    const updated = await db.Recipe.findByPk(req.params.id);
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const recipe = await db.Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).send({ message: "Recipe not found" });
    if (recipe.authorId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).send({ message: "No permission to delete this recipe" });
    }
    await recipe.destroy();
    res.send({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};