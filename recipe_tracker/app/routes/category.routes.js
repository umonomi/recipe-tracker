const auth = require("../controllers/auth.controller");

module.exports = app => {
  const categories = require("../controllers/category.controller");
  const router = require("express").Router();

  // Публичные маршруты (доступны всем)
  router.get("/", categories.findAll);
  router.get("/:id", categories.findOne);

  // Админские маршруты (требуют авторизации и роли admin)
  router.post("/", [auth.verifyToken, auth.isAdmin], categories.create);
  router.put("/:id", [auth.verifyToken, auth.isAdmin], categories.update);
  router.delete("/:id", [auth.verifyToken, auth.isAdmin], categories.delete);

  app.use("/api/categories", router);
};