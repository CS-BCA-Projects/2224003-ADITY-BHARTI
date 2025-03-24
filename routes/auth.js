const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')

router.get("/",async(req,res) => {
    res.render('login')
})
// Login route
router.post('/', async (req, res) => {
    const { Email, Password } = req.body;

    // Check if email and password exist in the request
    if (!Email || !Password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email: Email });
         console.log()
        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email ' });
        }

        res.status(200).json({ message: 'Login successful' ,redirectUrl :'/home' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
