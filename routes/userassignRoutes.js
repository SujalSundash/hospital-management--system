const express = require("express");
const router = express.Router();
const { assignRole } = require("../controllers/userassignController");
const { authMiddleware } = require("../middleware/authMiddleware"); // Make sure only logged-in admins can assign roles

router.post("/assign-role", authMiddleware, assignRole);

module.exports = router;
