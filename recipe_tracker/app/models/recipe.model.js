module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define("recipe", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cooking_time_minutes: DataTypes.INTEGER,
    servings: DataTypes.INTEGER,
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      defaultValue: 'medium'
    },
    image_url: DataTypes.STRING,
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });
  return Recipe;
};