// routes/testimonialRoutes.js
const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  getFeaturedTestimonials,
  getAllAdmin,
  approveTestimonial,
  toggleFeatured,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ── PUBLIC ──────────────────────────────────────────
router.get("/", getTestimonials);                          // all approved
router.get("/featured", getFeaturedTestimonials);          // featured only (homepage)
router.post("/", upload.single("photo"), createTestimonial); // submit review

// ── ADMIN ────────────────────────────────────────────
router.get("/admin/all", authMiddleware, roleMiddleware("admin"), getAllAdmin);
router.patch("/approve/:id", authMiddleware, roleMiddleware("admin"), approveTestimonial);
router.patch("/feature/:id", authMiddleware, roleMiddleware("admin"), toggleFeatured);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteTestimonial);

module.exports = router;