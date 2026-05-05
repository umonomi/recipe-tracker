const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Регистрация моделей
db.User = require("./user.model")(sequelize, Sequelize);
db.Category = require("./category.model")(sequelize, Sequelize);
db.Ingredient = require("./ingredient.model")(sequelize, Sequelize);
db.Recipe = require("./recipe.model")(sequelize, Sequelize);
db.RecipeIngredient = require("./recipe_ingredient.model")(sequelize, Sequelize);

// ==================== СВЯЗИ МЕЖДУ ТАБЛИЦАМИ ====================

// User → Recipe (один ко многим)
db.User.hasMany(db.Recipe, { foreignKey: 'authorId' });
db.Recipe.belongsTo(db.User, { foreignKey: 'authorId' });

// Category → Recipe (один ко многим)
db.Category.hasMany(db.Recipe, { foreignKey: 'categoryId' });
db.Recipe.belongsTo(db.Category, { foreignKey: 'categoryId' });

// Recipe ↔ Ingredient (многие ко многим через RecipeIngredient)
db.Recipe.belongsToMany(db.Ingredient, { through: db.RecipeIngredient, foreignKey: 'recipeId' });
db.Ingredient.belongsToMany(db.Recipe, { through: db.RecipeIngredient, foreignKey: 'ingredientId' });

// Дополнительные связи для RecipeIngredient
db.RecipeIngredient.belongsTo(db.Recipe, { foreignKey: 'recipeId' });
db.RecipeIngredient.belongsTo(db.Ingredient, { foreignKey: 'ingredientId' });

module.exports = db;