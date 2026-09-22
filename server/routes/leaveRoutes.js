const express = require("express");

const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} = require("../controllers/leaveController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Employee
router.post("/", protect, authorizeRoles("EMPLOYEE"), applyLeave);

router.get("/my", protect, authorizeRoles("EMPLOYEE"), getMyLeaves);

// HR
router.get("/", protect, authorizeRoles("HR"), getAllLeaves);

router.put("/:id/approve", protect, authorizeRoles("HR"), approveLeave);

router.put("/:id/reject", protect, authorizeRoles("HR"), rejectLeave);

module.exports = router;
