const db = require("../models");
const Ingredient = db.Ingredient;

exports.create = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).send(ingredient);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.send(ingredients);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).send({ message: "Ingredient not found" });
    }
    res.send(ingredient);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Ingredient.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).send({ message: "Ingredient not found" });
    }
    const ingredient = await Ingredient.findByPk(req.params.id);
    res.send(ingredient);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Ingredient.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).send({ message: "Ingredient not found" });
    }
    res.send({ message: "Ingredient deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};