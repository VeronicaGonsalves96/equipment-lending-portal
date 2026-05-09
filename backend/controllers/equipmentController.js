const {
  listEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require("../models/equipmentModel");

const list = async (req, res) => {
  try {
    const items = await listEquipment();
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch equipment" });
  }
};

const getById = async (req, res) => {
  try {
    const item = await getEquipmentById(req.params.id);
    if (!item) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch equipment" });
  }
};

const create = async (req, res) => {
  try {
    const { name, category, condition, quantity } = req.body;
    if (!name || !category || !condition || !quantity) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const id = await createEquipment({
      name,
      category,
      condition,
      quantity: Number(quantity),
    });
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create equipment" });
  }
};

const update = async (req, res) => {
  try {
    const { name, category, condition, quantity } = req.body;
    if (!name || !category || !condition || !quantity) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    await updateEquipment({
      id: req.params.id,
      name,
      category,
      condition,
      quantity: Number(quantity),
    });
    res.json({ message: "Equipment updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update equipment" });
  }
};

const remove = async (req, res) => {
  try {
    await deleteEquipment(req.params.id);
    res.json({ message: "Equipment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete equipment" });
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
