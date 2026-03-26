const mongoose = require("mongoose");
const Role = require("../models/Role");
const Permission = require("../models/permission");

mongoose.connect("mongodb://localhost:27017/hospital-system")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const assignPermission = async () => {
  try {
    // Find permission by name
    const createPerm = await Permission.findOne({ name: "create_appointment" });
    if (!createPerm) throw new Error("Permission not found");

    // Find role
    const role = await Role.findOne({ name: "receptionist" });
    if (!role) throw new Error("Role not found");

    // Push ObjectId (NOT string)
    if (!role.permissions.includes(createPerm._id)) {
      role.permissions.push(createPerm._id);
      await role.save();
      console.log("Permission assigned to role");
    } else {
      console.log("Role already has this permission");
    }

    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

assignPermission();
