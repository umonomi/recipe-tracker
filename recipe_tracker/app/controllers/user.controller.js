const db = require("../models");
const User = db.User;

// Создать пользователя
exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить всех пользователей
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Получить пользователя по ID
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: db.Recipe,
        as: 'recipes',
        attributes: ['id', 'title', 'cooking_time_minutes', 'difficulty']
      }]
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};