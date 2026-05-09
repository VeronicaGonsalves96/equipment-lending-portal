const express = require("express");
const {
  requestBorrow,
  listMine,
  listAll,
  approve,
  reject,
  markReturned,
} = require("../controllers/borrowController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, requestBorrow);
router.get("/mine", requireAuth, listMine);
router.get("/", requireAuth, requireRole("staff", "admin"), listAll);
router.post("/:id/approve", requireAuth, requireRole("staff", "admin"), approve);
router.post("/:id/reject", requireAuth, requireRole("staff", "admin"), reject);
router.post("/:id/return", requireAuth, requireRole("staff", "admin"), markReturned);

module.exports = router;
