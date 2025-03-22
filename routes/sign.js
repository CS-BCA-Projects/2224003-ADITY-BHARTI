const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const { body, validationResult } = require('express-validator'); // Import express-validator

// Adjust the path as needed

router.post('/signup', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('profession').notEmpty().withMessage('Profession is required.'),
    body('feildofworkstudy').notEmpty().withMessage('Field of work/study is required.')
], async (req, res) => { // Added `async` here
   const { email, password, profession, feildofworkstudy } = req.body;
   const errors = validationResult(req); // Validate input
   if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() }); // Return validation errors
   }
   console.log(email, password, profession, feildofworkstudy);
   try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const newUser = new User({ email, password, profession, feildofworkstudy });
        await newUser.save();  // `await` now works properly inside async function

        res.status(201).json({ 
            message: 'User registered successfully!',
            user: { email: newUser.email }
        });
    } catch (error) {
        console.error('Error saving user:', error.message); // Improved logging
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
