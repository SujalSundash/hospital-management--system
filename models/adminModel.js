const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageDoctors: { type: Boolean, default: true },
      manageStaff: { type: Boolean, default: true },
      viewAuditLogs: { type: Boolean, default: true }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
