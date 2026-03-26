// routes/scheduleRoutes.js
const express = require("express");
const router = express.Router();
const { getSchedule, addEvent, deleteEvent } = require("../controllers/scheduleController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", getSchedule); // anyone can fetch

// Only admin can add events
router.post("/", authMiddleware, roleMiddleware("admin"), addEvent);

router.delete("/:dayId/events/:eventId", authMiddleware, roleMiddleware("admin"), deleteEvent); 
module.exports = router;