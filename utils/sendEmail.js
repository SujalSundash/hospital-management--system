const transporter = require("./transporter");


async function sendVerificationEmail(recipientEmail, token) {


  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${token}`

  const subject = "Verify your email"

  const html = `<a href="${verificationUrl}">Verify your email</a>`
  
  const mailOptions = {
    from:process.env.SMTP_EMAIL,
    to:recipientEmail,
    subject,
    html,
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error(`Error sending error`, error)
  }
}

module.exports = sendVerificationEmail