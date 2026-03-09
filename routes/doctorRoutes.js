const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const authorize = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * ================= PUBLIC / AUTHENTICATED =================
 */

// Get all doctors (Admin, Doctor, Patient)
router.get(
  "/",
  authorize,
  doctorController.getDoctors
);

// Get single doctor
router.get(
  "/:id",
  authorize,
  doctorController.getDoctorById
);

/**
 * ================= ADMIN ONLY =================
 */

// Create doctor with multiple images
router.post(
  "/",
  authorize,
  roleMiddleware("admin"),
  upload.array("images", 5), // 👈 multiple images
  doctorController.createDoctor
);

// Delete doctor
router.delete(
  "/:id",
  authorize,
  roleMiddleware("admin"),
  doctorController.deleteDoctor
);

/**
 * ================= ADMIN OR DOCTOR =================
 */

// Update doctor profile (with images)
router.put(
  "/:id",
  authorize,
  roleMiddleware("admin", "doctor"),
  upload.array("images", 5),
  doctorController.updateDoctor
);

router.put(
  "/approve/:id",
  authorize,
  roleMiddleware("admin"),
  doctorController.approveDoctor
);

router.put(
  "/block/:id",
  authorize,
  roleMiddleware("admin"),
  doctorController.blockDoctor
);

router.put(
  "/unblock/:id",
  authorize,
  roleMiddleware("admin"),
  doctorController.unblockDoctor
);



module.exports = router;
