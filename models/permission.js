const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    group:{
      type:String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
