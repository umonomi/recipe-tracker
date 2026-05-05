const auth = require("../controllers/auth.controller");

module.exports = app => {
  const recipes = require("../controllers/recipe.controller");
  const router = require("express").Router();

  /**
   * @swagger
   * /api/recipes:
   *   post:
   *     summary: Создать новый рецепт
   *     tags: [Recipes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *               - instructions
   *             properties:
   *               title:
   *                 type: string
   *                 example: Омлет с сыром
   *               description:
   *                 type: string
   *                 example: Простой завтрак
   *               instructions:
   *                 type: string
   *                 example: 1. Взбить яйца. 2. Добавить сыр.
   *               cooking_time_minutes:
   *                 type: integer
   *                 example: 10
   *               servings:
   *                 type: integer
   *                 example: 2
   *               difficulty:
   *                 type: string
   *                 enum: [easy, medium, hard]
   *                 example: easy
   *               categoryId:
   *                 type: integer
   *                 example: 1
   *               authorId:
   *                 type: integer
   *                 example: 1
   *     responses:
   *       201:
   *         description: Рецепт создан
   */
  router.post("/", auth.verifyToken, recipes.create);

  /**
   * @swagger
   * /api/recipes:
   *   get:
   *     summary: Получить все рецепты (с фильтрацией)
   *     tags: [Recipes]
   *     parameters:
   *       - in: query
   *         name: categoryId
   *         schema: { type: integer }
   *         description: Фильтр по категории
   *       - in: query
   *         name: authorId
   *         schema: { type: integer }
   *         description: Фильтр по автору
   *       - in: query
   *         name: difficulty
   *         schema: { type: string }
   *         description: Фильтр по сложности (easy, medium, hard)
   *       - in: query
   *         name: title
   *         schema: { type: string }
   *         description: Поиск по названию (частичное совпадение, регистронезависимо)
   *       - in: query
   *         name: maxTime
   *         schema: { type: integer }
   *         description: Максимальное время приготовления в минутах
   *     responses:
   *       200:
   *         description: Список рецептов
   */
  router.get("/", recipes.findAll);

  /**
   * @swagger
   * /api/recipes/{id}:
   *   get:
   *     summary: Получить рецепт по ID
   *     tags: [Recipes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Данные рецепта с ингредиентами
   *       404:
   *         description: Рецепт не найден
   */
  router.get("/:id", recipes.findOne);

  /**
   * @swagger
   * /api/recipes/{id}:
   *   put:
   *     summary: Обновить рецепт
   *     tags: [Recipes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema: { $ref: '#/components/schemas/Recipe' }
   *     responses:
   *       200:
   *         description: Рецепт обновлён
   *       404:
   *         description: Рецепт не найден
   */
  router.put("/:id", auth.verifyToken, recipes.update);

  /**
   * @swagger
   * /api/recipes/{id}:
   *   delete:
   *     summary: Удалить рецепт
   *     tags: [Recipes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Рецепт удалён
   *       404:
   *         description: Рецепт не найден
   */
  router.delete("/:id", auth.verifyToken, recipes.delete);

  app.use("/api/recipes", router);
};