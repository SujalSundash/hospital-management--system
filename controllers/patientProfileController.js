const PatientProfile = require("../models/patientProfileModel");

// ================= CREATE PATIENT PROFILE =================
// Role: patient
exports.createPatientProfile = async (req, res) => {
  try {
    const existingProfile = await PatientProfile.findOne({
      user: req.user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Patient profile already exists",
      });
    }

    const profile = await PatientProfile.create({
      user: req.user._id,
      gender: req.body.gender,
      age: req.body.age,
      phone: req.body.phone,
      address: req.body.address,
      bloodGroup: req.body.bloodGroup,
      medicalHistory: req.body.medicalHistory,
      emergencyContact: req.body.emergencyContact,
    });

    res.status(201).json({
      success: true,
      message: "Patient profile created successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY PROFILE =================
// Role: patient
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE MY PROFILE =================
// Role: patient
exports.updateMyProfile = async (req, res) => {
  try {
    const profile = await PatientProfile.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient profile updated",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL PATIENT PROFILES =================
// Role: admin
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await PatientProfile.find().populate(
      "user",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET PATIENT BY ID =================
// Role: admin
exports.getPatientById = async (req, res) => {
  try {
    const patient = await PatientProfile.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
