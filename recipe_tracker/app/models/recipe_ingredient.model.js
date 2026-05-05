module.exports = (sequelize, DataTypes) => {
  const RecipeIngredient = sequelize.define("recipe_ingredient", {
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unit_override: DataTypes.STRING,
    notes: DataTypes.STRING
  });
  return RecipeIngredient;
};