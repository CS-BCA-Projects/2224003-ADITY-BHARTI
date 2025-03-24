const express = require('express');
const router = express.Router();
const { body} = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', (req, res) => res.render('signup')); // Renders Signup Page

router.post('/', [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('Profession').notEmpty().withMessage('Profession is required.'),
    body('Study').notEmpty().withMessage('Field of work/study is required.')
], async (req, res) => {
  
  
    const { email, password, Profession, Study } = req.body;

     try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword, Profession, Study });

        res.status(201).json({ 
            message: 'User registered successfully!',
            user: { email: newUser.email }
        });

    } catch (error) {
        console.error('Error saving user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
