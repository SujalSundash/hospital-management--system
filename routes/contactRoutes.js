const express = require('express');
const router = express.Router();

const { contactFrom, getUserById, deleteUserById } = require('../controllers/contactController');
const authorize = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware")

// USER route
router.post("/", contactFrom);

// ADMIN routes
router.get("/:id", authorize, roleMiddleware("admin"),
    getUserById);
router.delete("/:id", authorize, roleMiddleware("admin"),
    deleteUserById);
module.exports = router;
