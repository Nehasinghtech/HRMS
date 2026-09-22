const express = require("express");

const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Employee
router.post("/check-in", protect, authorizeRoles("EMPLOYEE"), checkIn);

router.post("/check-out", protect, authorizeRoles("EMPLOYEE"), checkOut);

router.get("/my", protect, authorizeRoles("EMPLOYEE"), getMyAttendance);

// HR
router.get("/", protect, authorizeRoles("HR"), getAllAttendance);

module.exports = router;
