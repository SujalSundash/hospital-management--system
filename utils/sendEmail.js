const transporter = require("./transporter");

async function sendVerifyEmail(recipientEmail, token) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

  const subject = "Verify Your Email Address";

  const html = `
    <h2>Email Verification</h2>
    <p>Welcome! Please verify your email by clicking the button below:</p>
    
    <a href="${verifyUrl}" 
       style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;text-decoration:none;border-radius:5px;">
       Verify Email
    </a>

    <p>This link will expire in 1 day.</p>
    <p>If you did not create this account, please ignore this email.</p>
  `;

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: recipientEmail,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
}

module.exports = sendVerifyEmail;