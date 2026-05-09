const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    equipment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, default: "pending" },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const BorrowRequest =
  mongoose.models.BorrowRequest ||
  mongoose.model("BorrowRequest", borrowSchema);

const mapBorrow = (request) => ({
  id: request._id.toString(),
  user_id: request.user_id?._id ? request.user_id._id.toString() : request.user_id?.toString(),
  equipment_id: request.equipment_id?._id
    ? request.equipment_id._id.toString()
    : request.equipment_id?.toString(),
  start_date: request.start_date.toISOString().slice(0, 10),
  end_date: request.end_date.toISOString().slice(0, 10),
  status: request.status,
  approved_by: request.approved_by
    ? request.approved_by.toString()
    : null,
  created_at: request.created_at,
  user_name: request.user_id?.name,
  equipment_name: request.equipment_id?.name,
});

const createBorrowRequest = async ({
  userId,
  equipmentId,
  startDate,
  endDate,
}) => {
  const request = await BorrowRequest.create({
    user_id: userId,
    equipment_id: equipmentId,
    start_date: new Date(startDate),
    end_date: new Date(endDate),
  });
  return request._id.toString();
};

const findBorrowById = async (id) => {
  const request = await BorrowRequest.findById(id)
    .populate("user_id", "name")
    .populate("equipment_id", "name")
    .lean();

  return request ? mapBorrow({ ...request, _id: request._id }) : null;
};

const listBorrowByUser = async (userId) => {
  const requests = await BorrowRequest.find({ user_id: userId })
    .populate("equipment_id", "name")
    .sort({ created_at: -1 })
    .lean();
  return requests.map((request) => mapBorrow({ ...request, _id: request._id }));
};

const listBorrowAll = async () => {
  const requests = await BorrowRequest.find({})
    .populate("user_id", "name")
    .populate("equipment_id", "name")
    .sort({ created_at: -1 })
    .lean();
  return requests.map((request) => mapBorrow({ ...request, _id: request._id }));
};

const updateBorrowStatus = async ({ id, status, approvedBy }) =>
  BorrowRequest.updateOne(
    { _id: id },
    { $set: { status, approved_by: approvedBy || null } }
  );

const countOverlappingRequests = async ({
  equipmentId,
  startDate,
  endDate,
}) => {
  const overlapCount = await BorrowRequest.countDocuments({
    equipment_id: equipmentId,
    status: { $in: ["pending", "approved"] },
    $nor: [
      { end_date: { $lt: new Date(startDate) } },
      { start_date: { $gt: new Date(endDate) } },
    ],
  });

  return { total: overlapCount };
};

module.exports = {
  createBorrowRequest,
  findBorrowById,
  listBorrowByUser,
  listBorrowAll,
  updateBorrowStatus,
  countOverlappingRequests,
};
