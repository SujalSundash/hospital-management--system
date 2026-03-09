const express = require("express");
const router = express.Router();
const {
  createTestimonial,
  getTestimonials,
  approveTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

// public
router.post("/testimonial", createTestimonial);
router.get("/testimonial", getTestimonials);

// admin
router.put("/testimonial/:id/approve", approveTestimonial);
router.delete("/testimonial/:id", deleteTestimonial);

module.exports = router;
