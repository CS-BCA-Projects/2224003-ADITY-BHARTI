const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
          return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, username, profession, study });

      await newUser.save();
      req.session.user = newUser; // ✅ Save user in session
      console.log("User saved, redirecting to profile...");

      res.json({ message: "Signup successful!" });
      
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;  // ✅ Corrected this line
