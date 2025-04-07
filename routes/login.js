const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /login
router.get('/', (req, res) => {
    res.render('login');
});

// POST /login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    console.log("BODY FOUND : ", { email, password });

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log("USER FOUND : ", user);

        const isMatch = await user.isPasswordCorrect(password);

        console.log("PASSWORD MATCH : ", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Save session
        req.session.user = {
            _id: user._id,
            email: user.email,
            name: user.name
        };

        res.status(200).json({ message: 'Login successful', redirectUrl: '/profile' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
