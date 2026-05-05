require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./app/models");

// ==================== SWAGGER ====================
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== SWAGGER КОНФИГУРАЦИЯ ====================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🍳 Recipe Tracker API",
      version: "1.0.0",
      description: "API для сайта рецептов. Позволяет управлять рецептами, ингредиентами, категориями и аналитикой.",
      contact: {
        name: "Your Name",
        email: "your@email.com"
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: "Локальный сервер"
      }
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "anna" },
            email: { type: "string", example: "anna@example.com" },
            avatar: { type: "string", example: "https://..." }
          }
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Завтраки" },
            description: { type: "string", example: "Вкусные блюда для завтрака" },
            icon: { type: "string", example: "🍳" }
          }
        },
        Ingredient: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "яйцо" },
            unit: { type: "string", example: "шт" },
            calories_per_unit: { type: "number", example: 70 }
          }
        },
        Recipe: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Омлет с сыром" },
            instructions: { type: "string", example: "1. Взбить яйца..." },
            cooking_time_minutes: { type: "integer", example: 10 },
            servings: { type: "integer", example: 2 },
            difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
          }
        },
        RecipeIngredient: {
          type: "object",
          properties: {
            recipeId: { type: "integer", example: 1 },
            ingredientId: { type: "integer", example: 1 },
            quantity: { type: "number", example: 3 },
            unit_override: { type: "string", example: "шт" },
            notes: { type: "string", example: "комнатной температуры" }
          }
        }
      }
    }
  },
  apis: ["./app/routes/*.routes.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== ПОДКЛЮЧЕНИЕ К БД ====================
db.sequelize.authenticate()
  .then(() => console.log("✅ Подключено к PostgreSQL"))
  .catch(err => console.log("❌ Ошибка подключения:", err));

db.sequelize.sync({ alter: true })
  .then(() => console.log("✅ База данных синхронизирована"))
  .catch(err => console.log("❌ Ошибка синхронизации:", err));

// ==================== МАРШРУТЫ ====================
require("./app/routes/user.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/ingredient.routes")(app);
require("./app/routes/recipe.routes")(app);
require("./app/routes/recipe_ingredient.routes")(app);
require("./app/routes/analytics.routes")(app);
require("./app/routes/auth.routes")(app);

// ==================== ТЕСТОВЫЙ МАРШРУТ ====================
app.get("/", (req, res) => {
  res.json({ 
    message: "🍳 Recipe Tracker API - готов к работе!",
    docs: `http://localhost:${process.env.PORT || 8080}/api-docs`
  });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📚 Swagger документация: http://localhost:${PORT}/api-docs`);
});