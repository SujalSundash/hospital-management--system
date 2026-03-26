const mongoose = require("mongoose");
const Contact = require("../models/ContactModel");

// USER: Submit contact
const contactFrom = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const savedContact = await Contact.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Contact submitted successfully",
      data: savedContact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ADMIN: Get contact by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const contact = await Contact.findById(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.status(200).json({ success: true, data: contact });
};

// ADMIN: Delete contact
const deleteUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  res.status(200).json({
    success: true,
    message: "Contact deleted successfully",
  });
};

module.exports = { contactFrom, getUserById, deleteUserById };
