// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const Score = require('../models/score');

router.get('/', async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'username') // Populate userId if it exists
      .sort({ score: -1 })
      .limit(10);
    res.render('leaderboard', { 
      scores, 
      username: req.session.user ? req.session.user.username : null, 
      error: null 
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.render('leaderboard', { 
      scores: [], 
      error: 'Unable to load leaderboard', 
      username: req.session.user ? req.session.user.username : null 
    });
  }
});

module.exports = router;