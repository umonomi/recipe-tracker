const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.User;
const bcrypt = require('bcryptjs');

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    // Используем поле password, а не password_hash
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).send({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).send({ message: "User not found" });
    // Сравниваем с полем password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ message: "Invalid password" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).send({ id: user.id, username: user.username, role: user.role, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Остальные middleware остаются без изменений
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: "No token provided" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).send({ message: "Require admin role" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};