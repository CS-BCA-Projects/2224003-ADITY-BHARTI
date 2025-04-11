// utils/sendOTP.js
const nodemailer = require('nodemailer');

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adity.sahibganj@gmail.com',
      pass: 'drnn vlie dskv qcxy', // App password from Gmail
    },
  });

  const mailOptions = {
    from: 'adity.sahibganj@gmail.com',
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ OTP sent to', email);
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
  }
}

module.exports = sendOTP;
