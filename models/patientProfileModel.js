const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"]
    },

    age: {
      type: Number
    },

    phone: {
      type: String
    },

    address: {
      type: String
    },

    bloodGroup: {
      type: String
    },

    medicalHistory: [
      {
        condition: String,
        notes: String
      }
    ],

    emergencyContact: {
      name: String,
      phone: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientProfile", patientProfileSchema);
