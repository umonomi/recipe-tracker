module.exports = app => {
  const ri = require("../controllers/recipe_ingredient.controller");
  const router = require("express").Router();

  router.post("/", ri.create);
  router.get("/recipe/:recipeId", ri.findByRecipe);
  router.put("/:id", ri.update);
  router.delete("/:id", ri.delete);
  router.delete("/recipe/:recipeId", ri.deleteByRecipe); 

  app.use("/api/recipe-ingredients", router);
};