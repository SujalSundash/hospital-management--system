// models/testimonialModel.js
const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: String,
      default: "Customer",
      trim: true,
    },
    review: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    photo: {
      type: String,
      default: "", // URL or /uploads/filename.jpg
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);