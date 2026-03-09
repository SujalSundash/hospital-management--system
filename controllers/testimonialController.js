const testimonialModel = require("../models/testimonialModel");

// CREATE testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialModel.create(req.body);
    res.status(201).json({
      success: true,
      message: "Testimonial submitted for approval",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET approved testimonials (public)
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find({ isApproved: true });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// APPROVE testimonial (admin)
exports.approveTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialModel.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Testimonial approved",
      testimonial,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    await testimonialModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
