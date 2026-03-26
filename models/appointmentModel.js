const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    patientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    doctorName: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      enum: [
        "Cardiology",
        "Dental",
        "Neurology",
        "Orthopedic",
        "Dermatology",
        "General",
      ],
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // 👇 store approver user id
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);