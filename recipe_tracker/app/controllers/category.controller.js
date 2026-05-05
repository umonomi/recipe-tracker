const db = require("../models");
const Category = db.Category;

exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: db.Recipe,
        as: 'recipes',
        attributes: ['id', 'title']
      }]
    });
    res.send(categories);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: db.Recipe,
        as: 'recipes'
      }]
    });
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).send({ message: "Category not found" });
    }
    const category = await Category.findByPk(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.send({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};