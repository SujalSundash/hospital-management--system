const Doctor = require("../models/doctorModel");
const slugify = require("slugify"); // optional if you want slug later

/**
 * @desc    Create Doctor
 * @route   POST /api/doctors
 * @access  Admin
 */
const { uploadToCloudinary } = require("../middleware/uploadMiddleware");
 
exports.createDoctor = async (req, res) => {
  try {
    const {
      name, email, phone, gender,
      specialization, qualifications,
      experience, clinicAddress, fees,
      availableDays, availableTimes,
    } = req.body;
 
    if (!name || !email || !phone || !specialization ||
        !qualifications || !experience || !clinicAddress || !fees) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
 
    // ✅ Upload buffer to Cloudinary if file exists
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer); // returns full https URL
    }
 
    const doctor = await Doctor.create({
      name, email, phone, gender,
      specialization, qualifications,
      experience, clinicAddress, fees,
      availableDays, availableTimes,
      profileImage: imageUrl,
      userId: req.user._id,
    });
 
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @desc    Get All Doctors
 * @route   GET /api/doctors
 * @access  Public
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

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

/**
 * @desc    Get Single Doctor
 * @route   GET /api/doctors/:id
 * @access  Public
 */
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

/**
 * @desc    Update Doctor
 * @route   PUT /api/doctors/:id
 * @access  Admin
 */
exports.updateDoctor = async (req, res) => {
  try {
    const updates = req.body;

    // If a new file is uploaded, set relative path
    if (req.file) {
  updates.profileImage = `/uploads/${req.file.filename}`;
}

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
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
      message: "Doctor updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Delete Doctor
 * @route   DELETE /api/doctors/:id
 * @access  Admin
 */
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

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

/**
 * @desc    Get Departments
 * @route   GET /api/doctors/departments
 * @access  Public
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Doctor.distinct("specialization");

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};