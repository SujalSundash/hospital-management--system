const Appointment = require("../models/appointmentModel");


// CREATE APPOINTMENT (PATIENT)
exports.createAppointment = async (req, res) => {
  try {
    const { patientName, patientEmail, doctorName, department, appointmentDate, reason } = req.body;

    const appointment = await Appointment.create({
      patientName,
      patientEmail,
      doctorName,
      department,
      appointmentDate,
      reason
    });

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// GET ALL APPOINTMENTS (ADMIN / DOCTOR)
exports.getAllAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ user: userId })
      .populate("doctor", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET SINGLE APPOINTMENT
exports.getSingleAppointment = async (req, res) => {
  try {

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// APPROVE APPOINTMENT (ADMIN / DOCTOR)
exports.approveAppointment = async (req, res) => {
  try {

    // check role
    if (!req.user || !["doctor", "admin"].includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: "Only doctor or admin can approve appointments"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        approvedBy: req.user._id
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment approved successfully",
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// REJECT APPOINTMENT
exports.rejectAppointment = async (req, res) => {
  try {

    // check role
    if (!req.user || !["doctor", "admin"].includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: "Only doctor or admin can reject appointments"
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        approvedBy: req.user._id
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
      data: appointment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};