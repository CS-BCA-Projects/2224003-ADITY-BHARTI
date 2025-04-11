const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendSignupEmail } = require('../utils/mailer'); // adjust path if needed

router.get('/', (req, res) => res.render('signup')); // Render Signup Page

// Signup Route
router.post('/', async (req, res) => {
  console.log("Received Data:", req.body); // Debugging: See what data is coming

  const { email, password, username, profession, study } = req.body;

  if (!email || !password || !username || !profession || !study) {
      return res.status(400).json({ message: 'Please fill out all fields' });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists',redirectUrl :'/login' });
      }

      const newUser = await User.create({ email, password, username, profession, study });
      await sendSignupEmail(email, username);
      req.session.user = newUser; 
      res.json({ message: "Signup successful!" , redirectUrl :'/' });
      
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;  // ✅ Corrected this line
