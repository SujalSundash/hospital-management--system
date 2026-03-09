const Newsletter = require("../models/Newsletter");
const sendEmail = require("../utils/sendEmail");

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check existing
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    // save
    const subscriber = await Newsletter.create({ email });

    // optional confirmation email
    await sendEmail(
      email,
      "Newsletter Subscription",
      `🎉 Thank you for subscribing to our newsletter!`
    );

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
      data: subscriber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
