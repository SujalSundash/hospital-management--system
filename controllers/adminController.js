const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Role = require("../models/Role");
const Patient = require("../models/patientProfileModel");
const Appointment = require("../models/appointmentModel")
/**
 * =========================
 * CREATE FIRST ADMIN (BOOTSTRAP)
 * =========================
 * Used only once when system has no admin
 */
exports.bootstrapAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole)
      return res.status(500).json({ success: false, message: "Admin role missing" });

    user.role = adminRole._id; // ✅ ObjectId
    user.isApproved = true;
    await user.save();

    const admin = await Admin.create({
      user: user._id
    });

    res.status(201).json({
      success: true,
      message: "Admin bootstrapped successfully",
      admin
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * =========================
 * PROMOTE USER TO ADMIN
 * =========================
 */
exports.createAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole)
      return res.status(500).json({ success: false, message: "Admin role missing" });

    user.role = adminRole._id; // ✅ ObjectId
    user.isApproved = true;
    await user.save();

    const admin = await Admin.create({
      user: user._id
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * =========================
 * GET ALL ADMINS
 * =========================
 */
exports.getAllAdmins = async (req, res) => {
  const admins = await Admin.find()
    .populate("user", "name email role");

  res.json({ success: true, admins });
};

/**
 * =========================
 * UPDATE ADMIN PERMISSIONS
 * =========================
 */
exports.updateAdminPermissions = async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(
    req.params.id,
    { permissions: req.body },
    { new: true }
  );

  if (!admin)
    return res.status(404).json({ success: false, message: "Admin not found" });

  res.json({ success: true, admin });
};

/**
 * =========================
 * REMOVE ADMIN ROLE
 * =========================
 */
exports.removeAdmin = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin)
    return res.status(404).json({ success: false, message: "Admin not found" });

  const patientRole = await Role.findOne({ name: "patient" });
  if (!patientRole)
    return res.status(500).json({ success: false, message: "Patient role missing" });

  await User.findByIdAndUpdate(admin.user, {
    role: patientRole._id,
    isApproved: false
  });

  await admin.deleteOne();

  res.json({ success: true, message: "Admin removed successfully" });
};


// ================= GET ALL PATIENTS (ADMIN) =================
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

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

// ================= APPROVE / REJECT PATIENT =================
exports.approvePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.isApproved = true;
    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient approved successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= BLOCK / UNBLOCK PATIENT =================
exports.toggleBlockPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.isBlocked = !patient.isBlocked;
    await patient.save();

    res.status(200).json({
      success: true,
      message: patient.isBlocked
        ? "Patient blocked"
        : "Patient unblocked",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET total registered users
exports.getTotalUsers = async (req, res) => {
  try {
    // Extra safety (even though middleware exists)
    if (req.user.role.name !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only"
      });
    }

    // Find patient role (default user role)
    const patientRole = await Role.findOne({ name: "patient" });

    if (!patientRole) {
      return res.status(500).json({
        success: false,
        message: "Patient role not found in system"
      });
    }

    // 2️Count registered users (patients)
    const totalUsers = await User.countDocuments({
      role: patientRole._id
    });

    res.status(200).json({
      success: true,
      totalUsers
    });

  } catch (error) {
    console.error("ADMIN COUNT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users count",
      error: error.message
    });
  }
};


//Get Doctors Count

exports.getDashboardCounts = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role.name !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only"
      });
    }

    //  Fetch roles
    const [patientRole, doctorRole] = await Promise.all([
      Role.findOne({ name: "patient" }),
      Role.findOne({ name: "doctor" })
    ]);

    if (!patientRole || !doctorRole) {
      return res.status(500).json({
        success: false,
        message: "Required roles not found (patient / doctor)"
      });
    }

    // Count users by role
    const [totalPatients, totalDoctors, totalAppointments, pendingAppointments, completedAppointments] = await Promise.all([
      User.countDocuments({ role: patientRole._id }),
      User.countDocuments({ role: doctorRole._id }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "Pending" }),
      Appointment.countDocuments({ status: "Completed" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        completedAppointments
      }
    });

  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard counts",
      error: error.message
    });
  }
};