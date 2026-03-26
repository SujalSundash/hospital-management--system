// controllers/testimonialController.js
const Testimonial = require("../models/testimonialModel");

// POST: Create testimonial (public)
exports.createTestimonial = async (req, res) => {
  try {
    const { name, post, review, rating } = req.body;

    // Validate required fields
    if (!name || !review) {
      return res.status(400).json({
        success: false,
        message: "name and review are required",
      });
    }

    // Handle photo from multer upload OR URL string
    const photo = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.photo || "";

    const testimonial = await Testimonial.create({
      name,
      post,
      review,
      photo,
      rating,
      // isApproved defaults to false — needs admin approval
    });

    res.status(201).json({
      success: true,
      message: "Testimonial submitted for approval",
      data: testimonial, //consistent "data" key
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: All approved testimonials (public)
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,          
      count: testimonials.length,
      data: testimonials,    
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: Featured testimonials only (homepage)
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      isApproved: true,
      isFeatured: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET: All testimonials including unapproved (admin only)
exports.getAllAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH: Approve testimonial (admin)
exports.approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    // Added not found check
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial approved",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH: Toggle featured (admin)
exports.toggleFeatured = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${testimonial.isFeatured ? "featured" : "unfeatured"}`,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE: Delete testimonial (admin)
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    // Added not found check
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};