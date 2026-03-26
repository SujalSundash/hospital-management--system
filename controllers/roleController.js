const mongoose = require("mongoose");
const Role = require("../models/Role");
const Permission = require("../models/permission");

/**
 * @desc    Create new role
 * @route   POST /api/roles
 * @access  Admin
 */
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body; // permissions = ["create_appointment", "view_appointment"]

    // 1. Find permission IDs from the Permission collection
    const permissionDocs = await Permission.find({
      name: { $in: permissions }
    });

    const permissionIds = permissionDocs.map(p => p._id);

    // 2. Create the role
    const role = await Role.create({
      name,
      permissions: permissionIds
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Admin
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    res.status(200).json({
      count: roles.length,
      roles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get role by ID
 * @route   GET /api/roles/:id
 * @access  Admin
 */
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid role ID",
      });
    }

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Update role
 * @route   PUT /api/roles/:id
 * @access  Admin
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid role ID",
      });
    }

    const role = await Role.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc    Delete role
 * @route   DELETE /api/roles/:id
 * @access  Admin
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid role ID",
      });
    }

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    res.status(200).json({
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {createRole, getAllRoles, getRoleById , updateRole, deleteRole  }