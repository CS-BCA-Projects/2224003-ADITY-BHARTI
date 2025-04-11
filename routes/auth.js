const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendOTP = require('../utils/sendOTP');
const bcrypt = require('bcrypt');

// GET forgot-password page
router.get('/forgot-password', (req, res) => {
  res.render('forgotPassword', { error: null });
});

// POST to send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.render('forgotPassword', { error: 'Email not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOTP(email, otp);
  res.render('verifyOTP', { email, message: null, error: null });
});

// POST to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
    return res.render('verifyOTP', { email, message: null, error: 'Invalid or expired OTP' });
  }

  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.render('resetPassword', { email, error: null });
});

// POST to reset password
router.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate({ email }, { password: hashed });
  res.send('✅ Password updated! <a href="/login">Go to Login</a>');
});

// POST to resend OTP
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.send('User not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOTP(email, otp);
  res.render('verifyOTP', { email, message: 'OTP resent successfully!', error: null });
});

module.exports = router;
