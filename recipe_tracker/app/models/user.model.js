module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' } // 'admin' или 'user'
  });
  return User;
};