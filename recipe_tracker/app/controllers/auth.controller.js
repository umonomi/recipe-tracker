const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "supersecretkey";

// Регистрация
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 8);
    const user = await User.create({
      username,
      email,
      password: hashed,
      role: 'user'
    });
    res.status(201).send({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Логин
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).send({ message: "User not found" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).send({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: 86400 }); // 24h
    res.send({ id: user.id, username: user.username, role: user.role, token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Middleware для проверки токена
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).send({ message: "No token provided" });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });
    req.userId = decoded.id;
    // Дополнительно получаем роль пользователя из БД
    const user = await db.User.findByPk(decoded.id);
    req.userRole = user ? user.role : 'user';
    next();
  });
};