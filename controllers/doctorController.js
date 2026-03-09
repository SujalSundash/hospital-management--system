const Doctor = require("../models/doctorModel");
const cloudinary = require("../config/cloudinary");

// Default avatar
const DEFAULT_AVATAR =
  "https://res.cloudinary.com/demo/image/upload/v1690000000/default-avatar.png";

// helper: extract public_id from Cloudinary URL
const getPublicId = (url) => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  return "doctors/" + filename.split(".")[0];
};

// ================= CREATE DOCTOR =================
// Only ADMIN
exports.createDoctor = async (req, res) => {
  try {
    req.body.userId = req.user._id;

    // multiple images
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.path);
    } else {
      images = [DEFAULT_AVATAR]; // default avatar
    }

    const doctor = await Doctor.create({
      ...req.body,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL DOCTORS =================
// Admin & Patient
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SINGLE DOCTOR =================
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE DOCTOR =================
// Admin OR doctor owner
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      doctor.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // If new images uploaded → delete old ones
    if (req.files && req.files.length > 0) {
      if (doctor.images && doctor.images.length > 0) {
        for (const img of doctor.images) {
          if (!img.includes("default-avatar")) {
            const publicId = getPublicId(img);
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }

      req.body.images = req.files.map((file) => file.path);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE DOCTOR =================
// Only ADMIN
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // delete images from Cloudinary
    if (doctor.images && doctor.images.length > 0) {
      for (const img of doctor.images) {
        if (!img.includes("default-avatar")) {
          const publicId = getPublicId(img);
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isApproved = true;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.blockDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isBlocked = true;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor blocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.unblockDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    doctor.isBlocked = true;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor unblocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

