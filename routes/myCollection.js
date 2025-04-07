const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');

// My Collections page – only for logged-in users
router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const userUploads = await Upload.find({ uploadedBy: req.session.user._id });
    res.render('myCollections', { user: req.session.user, uploads: userUploads });
  } catch (err) {
    console.error('Error fetching user uploads:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
