const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authMiddleware");

const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  confirmAppointment,
  adminUpdateStatus
} = require("../controllers/appointmentController");

router.post("/create", authorize, createAppointment);
router.get("doctor", authorize, getDoctorAppointments);
router.get("patient", authorize, getPatientAppointments);
router.put("/:id/confirmd", authorize, confirmAppointment);
router.put("/:id/status", authorize, adminUpdateStatus);

module.exports = router;
