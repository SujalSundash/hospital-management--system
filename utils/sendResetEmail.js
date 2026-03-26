const transporter = require("./transporter");

async function sendResetEmail(recipientEmail, token) {
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const subject = "Reset Your Password";

  const html = `
    <h2>Password Reset</h2>
    <p>Click the button below to reset your password:</p>

    <a href="${resetURL}" 
       style="display:inline-block;padding:10px 20px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
       Reset Password
    </a>

    <p>This link expires in 1 hour.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: recipientEmail,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Reset email sent to:", recipientEmail);
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
  }
}

module.exports = sendResetEmail;