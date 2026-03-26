const express = require("express");

const {
  createAppointment,
  getAllAppointments,
  getSingleAppointment,
  approveAppointment,
  rejectAppointment,
  getMyAppointments
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// CREATE APPOINTMENT (Only logged-in users / patient)
router.post("/", authMiddleware, createAppointment);


// GET ALL APPOINTMENTS (Admin & Doctor)
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin", "doctor"),
  getAllAppointments
);

router.get("/me", authMiddleware, getMyAppointments);

// GET SINGLE APPOINTMENT
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "doctor"),
  getSingleAppointment
);


// APPROVE APPOINTMENT (Doctor / Admin)
router.patch(
  "/approve/:id",
  authMiddleware,
  roleMiddleware("admin", "doctor"),
  approveAppointment
);


// REJECT APPOINTMENT (Doctor / Admin)
router.patch(
  "/reject/:id",
  authMiddleware,
  roleMiddleware("admin", "doctor"),
  rejectAppointment
);


module.exports = router;