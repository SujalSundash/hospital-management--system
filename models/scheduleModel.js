// models/scheduleModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  clinic: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "Checkup", "Consultation"
  time: { type: String, required: true }, // e.g., "08:00"
  doctor: { type: String, required: true },
});

const daySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., "Monday"
  events: [eventSchema],
});

module.exports = mongoose.model("ScheduleDay", daySchema);