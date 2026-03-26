const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyUser,
  logout,
  forgotPassword,
  resetPassword,
  getMe
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.get("/me", authMiddleware, getMe);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyUser);
router.post("/logout", authMiddleware, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


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
