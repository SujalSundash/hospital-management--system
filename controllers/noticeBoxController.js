const Notice = require("../models/noticeBoxModel");

// POST: Create a notice
const createNotice = async (req, res) => {
  try {
    const newNotice = await Notice.create(req.body);

    res.status(201).json({
      message: "Notice created successfully",
      data: newNotice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create notice" });
  }
};

module.exports = createNotice ;
