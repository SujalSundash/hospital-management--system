const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Please verify your account first"
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  res.json({ message: "Login successful" });
};
