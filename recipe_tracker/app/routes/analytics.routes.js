module.exports = app => {
  const analytics = require("../controllers/analytics.controller");
  const router = require("express").Router();

  router.get("/search", analytics.searchByIngredients);
  router.get("/top-recipes", analytics.getTopRecipesByIngredients);
  router.get("/top-categories", analytics.getTopCategories);
  router.get("/recipe-nutrition/:recipeId", analytics.getRecipeNutrition);
  router.get("/by-time/:maxMinutes", analytics.getRecipesByTime);
  router.get("/user-stats/:userId", analytics.getUserStats);
  router.get("/budget", analytics.getBudgetRecipes);

  app.use("/api/analytics", router);
};