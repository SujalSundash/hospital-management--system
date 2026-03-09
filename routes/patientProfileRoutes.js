const express = require("express");
const router = express.Router();

const patientProfileController = require("../controllers/patientProfileController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Patient routes
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("patient"),
  patientProfileController.createPatientProfile
);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("patient"),
  patientProfileController.getMyProfile
);

router.put(
  "/update",
  authMiddleware,
  roleMiddleware("patient"),
  patientProfileController.updateMyProfile
);

// Admin routes
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  patientProfileController.getAllPatients
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  patientProfileController.getPatientById
);

module.exports = router;
