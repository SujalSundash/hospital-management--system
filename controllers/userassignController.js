const User = require("../models/User");
const Role = require("../models/Role");

// Assign a role to a user
const assignRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;

    // Find the role by name
    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(404).json({ message: "Role not found" });

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Assign the role
    user.role = role._id;
    await user.save();

    res.status(200).json({
      message: `Role '${roleName}' has been assigned to user '${user.name}'`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = assignRole;