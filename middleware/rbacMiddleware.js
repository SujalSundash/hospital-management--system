const Admin = require("../models/adminModel");

module.exports = (permission) => {
  return async (req, res, next) => {
    const admin = await Admin.findOne({ user: req.user.id });

    if (!admin || !admin.permissions[permission]) {
      return res.status(403).json({
        success: false,
        message: "Permission denied"
      });
    }

    next();
  };
};
