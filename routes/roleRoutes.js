const express = require("express");
const router = express.Router();

const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

// CREATE ROLE
router.post("/create", createRole);

// GET ALL ROLES
router.get("/get", getAllRoles);

// GET ROLE BY ID
router.get("/:id", getRoleById);

// UPDATE ROLE
router.put("/:id", updateRole);

// DELETE ROLE
router.delete("/:id", deleteRole);

module.exports = router;
