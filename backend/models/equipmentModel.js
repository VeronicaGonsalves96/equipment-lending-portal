const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    quantity: { type: Number, required: true },
    available_quantity: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Equipment =
  mongoose.models.Equipment || mongoose.model("Equipment", equipmentSchema);

const mapEquipment = (item) =>
  item
    ? {
        id: item._id.toString(),
        name: item.name,
        category: item.category,
        condition: item.condition,
        quantity: item.quantity,
        available_quantity: item.available_quantity,
      }
    : null;

const listEquipment = async () => {
  const items = await Equipment.find({}).sort({ name: 1 }).lean();
  return items.map(mapEquipment);
};

const getEquipmentById = async (id) => {
  const item = await Equipment.findById(id).lean();
  return mapEquipment(item ? { ...item, _id: item._id } : null);
};

const createEquipment = async ({ name, category, condition, quantity }) => {
  const item = await Equipment.create({
    name,
    category,
    condition,
    quantity,
    available_quantity: quantity,
  });
  return item._id.toString();
};

const updateEquipment = async ({ id, name, category, condition, quantity }) =>
  Equipment.updateOne(
    { _id: id },
    {
      $set: { name, category, condition, quantity },
      $min: { available_quantity: quantity },
    }
  );

const deleteEquipment = async (id) => Equipment.deleteOne({ _id: id });

const adjustAvailability = async ({ id, delta }) =>
  Equipment.updateOne(
    { _id: id },
    { $inc: { available_quantity: delta } }
  );

module.exports = {
  listEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  adjustAvailability,
};
