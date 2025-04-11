// mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'adity.sahibganj@gmail.com',
    pass: 'drnn vlie dskv qcxy' // Use App Password here
  }
});

function sendSignupEmail(toEmail, username) {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: toEmail,
    subject: 'Welcome to Rishiverse!',
    html: `
      <h2>Hello ${username},</h2>
      <p>Thank you for signing up to Rishiverse. We're excited to have you with us!</p>
      <p>Explore, read, and contribute to the ancient knowledge of India.</p>
      <br>
      <p>- Team Rishiverse</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendSignupEmail };
