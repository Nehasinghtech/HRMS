const express = require("express");

const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadMyPhoto } = require("../controllers/employeeController");

const router = express.Router();

// HR only
router.post("/", protect, authorizeRoles("HR"), addEmployee);

router.post(
  "/profile/photo",
  protect,
  authorizeRoles("EMPLOYEE"),
  upload.single("photo"),
  uploadMyPhoto,
);

router.get("/", protect, authorizeRoles("HR"), getEmployees);

router.get("/:id", protect, authorizeRoles("HR"), getEmployeeById);

router.put("/:id", protect, authorizeRoles("HR"), updateEmployee);

module.exports = router;
