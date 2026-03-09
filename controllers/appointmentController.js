const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

exports.createAppointment = async (req, res) => {
  try {
    const { doctor, department, phone, date, reason } = req.body;

    // 🔐 Only PATIENT can create
    if (!req.user.role || req.user.role.name !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can create appointments"
      });
    }

    // ✅ Validate doctor exists & is doctor
    const doctorUser = await User.findById(doctor).populate("role");
    if (!doctorUser || doctorUser.role.name !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      department,
      phone,
      date: new Date(date),
      reason
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment
    });

  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};




/* ===============================
   DOCTOR VIEW OWN APPOINTMENTS
================================ */
exports.getDoctorAppointments = async (req, res) => {
  if (req.user.role.name !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const appointments = await Appointment.find({
    doctor: req.user._id
  }).populate("patient", "name email");

  res.json({ success: true, appointments });
};

/* ===============================
   PATIENT VIEW OWN APPOINTMENTS
================================ */
exports.getPatientAppointments = async (req, res) => {
  if (req.user.role.name !== "patient") {
    return res.status(403).json({ message: "Access denied" });
  }

  const appointments = await Appointment.find({
    patient: req.user._id
  }).populate("doctor", "name email");

  res.json({ success: true, appointments });
};

/* ===============================
   DOCTOR CONFIRM APPOINTMENT
================================ */
exports.confirmAppointment = async (req, res) => {
  if (req.user.role.name !== "doctor") {
    return res.status(403).json({ message: "Only doctor allowed" });
  }

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  if (appointment.doctor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not your appointment" });
  }

  appointment.status = "Confirmed";
  await appointment.save();

  res.json({ success: true, appointment });
};

/* ===============================
   ADMIN UPDATE STATUS
================================ */
exports.adminUpdateStatus = async (req, res) => {
  if (req.user.role.name !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  const { status } = req.body;
  const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  appointment.status = status;
  await appointment.save();

  res.json({ success: true, appointment });
};
