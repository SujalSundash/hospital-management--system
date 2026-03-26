// controllers/noticeBoxController.js
const Notice = require("../models/noticeBoxModel");

// GET: Fetch all notices (any user can access)
const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
};

// POST: Create a notice (admin only, roleMiddleware ensures only admins reach here)
const createNotice = async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

    // Validate required fields
    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "title, description and date are required",
      });
    }

    const newNotice = await Notice.create({ title, description, date, priority });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: newNotice,
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
};

module.exports = { getAllNotices, createNotice };