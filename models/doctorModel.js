const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    // Personal Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    profileImage: {
      type: String, // URL to profile picture
    },

    // Professional Info
    specialization: {
      type: String,
      required: true,
    },
    qualifications: {
      type: [String], // e.g., ["MBBS", "MD"]
      required: true,
    },
    experience: {
      type: Number, // years of experience
      required: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },
    fees: {
      type: Number, // consultation fees
      required: true,
    },

    // Availability
    availableDays: {
      type: [String], // e.g., ["Monday", "Wednesday", "Friday"]
      required: true,
    },
    availableTimes: {
      start: { type: String }, // "09:00 AM"
      end: { type: String },   // "05:00 PM"
    },

    // Other
    rating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link doctor to a user account
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
