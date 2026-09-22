const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { loginUser, changePassword } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});
router.put("/change-password", authMiddleware, changePassword);
router.get("/hr-test", protect, authorizeRoles("HR"), (req, res) => {
  res.json({
    success: true,
    message: "HR access granted",
  });
});

router.get(
  "/employee-test",
  protect,
  authorizeRoles("EMPLOYEE"),
  (req, res) => {
    res.json({
      success: true,
      message: "Employee access granted",
    });
  },
);

module.exports = router;
