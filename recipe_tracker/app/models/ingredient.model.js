module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define("ingredient", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: "шт"
    },
    calories_per_unit: DataTypes.FLOAT,
    protein_per_unit: DataTypes.FLOAT,
    fat_per_unit: DataTypes.FLOAT,
    carbs_per_unit: DataTypes.FLOAT
  });
  return Ingredient;
};