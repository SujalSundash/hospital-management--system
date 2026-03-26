require("dotenv").config();
const jwt = require("jsonwebtoken");

// Generate JWT
function generateToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// Decode JWT (NO verification)
function decodeJWT(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

// Verify JWT (recommended for auth)
function verifyJWT(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateToken,
  decodeJWT,
  verifyJWT
};
