const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyUser
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyUser);

// Protected route (any logged-in user)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Admin-only route
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// Multiple roles example
router.get("/manager", authMiddleware, roleMiddleware("admin", "manager"), (req, res) => {
  res.json({ message: "Welcome, admin or manager!" });
});

module.exports = router;
