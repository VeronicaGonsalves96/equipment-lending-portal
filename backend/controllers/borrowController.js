const {
  createBorrowRequest,
  findBorrowById,
  listBorrowByUser,
  listBorrowAll,
  updateBorrowStatus,
  countOverlappingRequests,
} = require("../models/borrowModel");
const {
  getEquipmentById,
  adjustAvailability,
} = require("../models/equipmentModel");

const requestBorrow = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;
    if (!equipmentId || !startDate || !endDate) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const equipment = await getEquipmentById(equipmentId);
    if (!equipment) {
      res.status(404).json({ message: "Equipment not found" });
      return;
    }

    const overlap = await countOverlappingRequests({
      equipmentId,
      startDate,
      endDate,
    });

    if (overlap.total >= equipment.available_quantity) {
      res
        .status(409)
        .json({ message: "Equipment not available for selected dates" });
      return;
    }

    const id = await createBorrowRequest({
      userId: req.user.id,
      equipmentId,
      startDate,
      endDate,
    });
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create request" });
  }
};

const listMine = async (req, res) => {
  try {
    const requests = await listBorrowByUser(req.user.id);
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

const listAll = async (req, res) => {
  try {
    const requests = await listBorrowAll();
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

const approve = async (req, res) => {
  try {
    const request = await findBorrowById(req.params.id);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }
    if (request.status !== "pending") {
      res.status(400).json({ message: "Request already processed" });
      return;
    }

    const equipment = await getEquipmentById(request.equipment_id);
    if (!equipment || equipment.available_quantity <= 0) {
      res.status(409).json({ message: "No availability to approve" });
      return;
    }

    await updateBorrowStatus({
      id: request.id,
      status: "approved",
      approvedBy: req.user.id,
    });
    await adjustAvailability({ id: equipment.id, delta: -1 });
    res.json({ message: "Request approved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve request" });
  }
};

const reject = async (req, res) => {
  try {
    const request = await findBorrowById(req.params.id);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }
    if (request.status !== "pending") {
      res.status(400).json({ message: "Request already processed" });
      return;
    }

    await updateBorrowStatus({
      id: request.id,
      status: "rejected",
      approvedBy: req.user.id,
    });
    res.json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request" });
  }
};

const markReturned = async (req, res) => {
  try {
    const request = await findBorrowById(req.params.id);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }
    if (request.status !== "approved") {
      res.status(400).json({ message: "Only approved items can be returned" });
      return;
    }

    await updateBorrowStatus({
      id: request.id,
      status: "returned",
      approvedBy: req.user.id,
    });
    await adjustAvailability({ id: request.equipment_id, delta: 1 });
    res.json({ message: "Item returned" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as returned" });
  }
};

module.exports = {
  requestBorrow,
  listMine,
  listAll,
  approve,
  reject,
  markReturned,
};
