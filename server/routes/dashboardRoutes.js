const express = require("express");

const {
  getHRDashboard,
  getEmployeeDashboard,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// HR Dashboard
router.get("/hr", protect, authorizeRoles("HR"), getHRDashboard);

// Employee Dashboard
router.get(
  "/employee",
  protect,
  authorizeRoles("EMPLOYEE"),
  getEmployeeDashboard,
);

module.exports = router;
