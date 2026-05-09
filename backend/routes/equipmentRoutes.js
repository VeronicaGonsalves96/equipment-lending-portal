const express = require("express");
const {
  list,
  getById,
  create,
  update,
  remove,
} = require("../controllers/equipmentController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, list);
router.get("/:id", requireAuth, getById);
router.post("/", requireAuth, requireRole("admin"), create);
router.put("/:id", requireAuth, requireRole("admin"), update);
router.delete("/:id", requireAuth, requireRole("admin"), remove);

module.exports = router;
