const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Role = require("../models/Role"); // make sure this path is correct


const authorize = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).populate({
      path: "role",
      populate: { path: "permissions" }
    });

    if (!user) return res.status(401).json({ message: "Invalid token" });

    // Assign patient role if missing
    if (!user.role) {
      const patientRole = await Role.findOne({ name: "patient" });
      if (!patientRole)
        return res.status(500).json({
          message: "Default 'patient' role missing. Contact admin."
        });

      user.role = patientRole._id;
      user.isApproved = false;
      await user.save(); // save the updated role
    }

    req.user = user;

    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked by admin",
      });
    }
    console.log("ROLE:", user.role.name);
    // console.log("User:", req.user);


    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = authorize

// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// const authorize = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided"
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).populate("role");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     req.user = user;
//     console.log("ROLE:", user.role.name);

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token"
//     });
//   }
// };
// module.exports = authorize;

// exports.authorize = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Token missing"
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id)
//       .populate("role", "name")
//       .select("-password");

//     req.user = {
//       userId: user._id,
//       role: user.role.name   // 🔥 STRING: patient / doctor / admin
//     };

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token"
//     });
//   }
// };