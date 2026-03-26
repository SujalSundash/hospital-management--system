const express = require("express");
const router = express.Router();

const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDepartments,
} = require("../controllers/doctorController");

// Middleware (adjust path if different)
const  authorize  = require("../middleware/authMiddleware");
const  roleMiddleware  = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware"); // for image upload

/**
 * @routes
 */

// 🔹 Create Doctor (Admin)
router.post(
  "/",
  authorize,roleMiddleware("admin"),
  upload.single("profileImage"),
  createDoctor
);

// 🔹 Get All Doctors (Public)
router.get("/", getAllDoctors);

// 🔹 Get Departments
router.get("/departments", getDepartments);

// 🔹 Get Single Doctor
router.get("/:id", getDoctorById);

// 🔹 Update Doctor (Admin)
router.put(
  "/:id",
  authorize,
  roleMiddleware("admin"),
  upload.single("profileImage"),
  updateDoctor
);

// 🔹 Delete Doctor (Admin)
router.delete(
  "/:id",
  authorize,
  roleMiddleware("admin"),
  deleteDoctor
);

module.exports = router;