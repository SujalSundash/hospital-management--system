// controllers/scheduleController.js
const ScheduleDay = require("../models/scheduleModel");

// GET: fetch full schedule
const getSchedule = async (req, res) => {
  try {
    const schedule = await ScheduleDay.find().sort({ day: 1 }); // optional: sort by day order
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ success: false, message: "Failed to fetch schedule" });
  }
};

// POST: add a new event to a day
const addEvent = async (req, res) => {
  try {
    const { day, clinic, type, time, doctor } = req.body;

    if (!day || !clinic || !type || !time || !doctor) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let scheduleDay = await ScheduleDay.findOne({ day });

    if (!scheduleDay) {
      // If day doesn't exist, create it
      scheduleDay = new ScheduleDay({ day, events: [] });
    }

    scheduleDay.events.push({ clinic, type, time, doctor });
    await scheduleDay.save();

    res.status(201).json({ success: true, data: scheduleDay });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ success: false, message: "Failed to add event" });
  }
};


const deleteEvent = async (req, res) => {
  try {
    const { dayId, eventId } = req.params;
    const scheduleDay = await ScheduleDay.findById(dayId);
 
    if (!scheduleDay) {
      return res.status(404).json({ success: false, message: "Day not found" });
    }
 
    scheduleDay.events = scheduleDay.events.filter(
      (e) => e._id.toString() !== eventId
    );
    await scheduleDay.save();
 
    res.status(200).json({ success: true, message: "Event deleted", data: scheduleDay });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
};
 
module.exports = { getSchedule, addEvent,deleteEvent };