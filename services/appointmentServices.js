const Appointment = require("../models/appointmentModel");

const createAppointmentService = async ({
  patient,
  doctor,
  appointmentDate,
  timeSlot
}) => {
  const exists = await Appointment.findOne({
    doctor,
    appointmentDate,
    timeSlot
  });

  if (exists) {
    throw new Error("Time slot already booked");
  }

  return await Appointment.create({
    patient,
    doctor,
    appointmentDate,
    timeSlot
  });
};

const approveAppointmentService = async (id, status) => {
  return await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

const getAppointmentsByUserService = async (userId, role) => {
  if (role === "doctor") {
    return Appointment.find({ doctor: userId }).populate("patient");
  }
  return Appointment.find({ patient: userId }).populate("doctor");
};

const getAllAppointmentsService = async () => {
  return Appointment.find()
    .populate("patient", "name email")
    .populate("doctor", "name email");
};

module.exports = {
  createAppointmentService,
  approveAppointmentService,
  getAppointmentsByUserService,
  getAllAppointmentsService
};
