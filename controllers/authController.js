const User = require("../models/userModel");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const { generateToken, verifyJWT } = require("../utils/generateToken");
const sendVerificationEmail = require("../utils/sendEmail");

/**
 * =========================
 * REGISTER USER (DEFAULT PATIENT)
 * =========================
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Get default Patient role
    const patientRole = await Role.findOne({ name: "patient" });
    if (!patientRole) {
      return res.status(500).json({
        success: false,
        message: "Default Patient role not found. Please seed roles.",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: patientRole._id,
      isVerified: false,
    });

    // 6. Send verification email
    const verificationToken = generateToken(
      { id: user._id },
      "1d"
    );

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * =========================
 * VERIFY EMAIL
 * =========================
 */
const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token missing",
      });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Email already verified",
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * =========================
 * LOGIN USER
 * =========================
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user = await User.findOne({ email })
      .select("+password")
      .populate("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.role) {
      const defaultRole = await Role.findOne({ name: "patient" }); 
      if (defaultRole) {
        user.role = defaultRole;
        user.roleAssigned = true; 
      } else {
        return res.status(500).json({
          success: false,
          message: "User role is not assigned and default role missing. Contact admin.",
        });
      }
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken({
      id: user._id,
      role: user.role.name,
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.name,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



module.exports = {
  registerUser,
  verifyUser,
  loginUser,
};
