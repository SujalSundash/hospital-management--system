// src/controllers/authController.js
const User = require("../models/userModel");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { generateToken, verifyJWT } = require("../utils/generateToken");
const sendVerificationEmail = require("../utils/sendEmail");
const sendResetEmail = require("../utils/sendResetEmail");

/**
 * =========================
 * REGISTER USER (DEFAULT PATIENT)
 * =========================
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ success: false, message: "User already exists" });

    const patientRole = await Role.findOne({ name: "patient" });
    if (!patientRole)
      return res.status(500).json({ success: false, message: "Default Patient role missing" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: patientRole._id, isVerified: false });

    const verificationToken = generateToken({ id: user._id }, "1d");
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ success: true, message: "Registration successful. Please verify your email." });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    if (!token) return res.status(400).json({ success: false, message: "Verification token missing" });

    const decoded = verifyJWT(token);
    if (!decoded) return res.status(400).json({ success: false, message: "Invalid or expired token" });

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.isVerified) return res.status(200).json({ success: true, message: "Email already verified" });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("VERIFY EMAIL ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password").populate("role");
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ success: false, message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken({ id: user._id, role: user.role.name });
    res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role.name } });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    // Clear cookie if you use HTTP-only cookie for token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * FORGOT PASSWORD
 * Generates a secure reset token, saves its hash and expiry in DB,
 * and sends a reset link to the user's email.
 */
const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD API HIT"); 

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return same response (security)
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with that email, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Correct: pass token (not URL)
    await sendResetEmail(user.email, resetToken);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * RESET PASSWORD
 * Verifies the token, updates the user's password, and clears reset fields.
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    user.password = await bcrypt.hash(password, saltRounds);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// controllers/authController.js

const getMe = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getMe
};