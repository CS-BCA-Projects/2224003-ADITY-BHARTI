// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Upload = require('../models/upload');
const isAdmin = require('../middleware/isAdmin');

// Admin Dashboard
router.get('/', isAdmin, async (req, res) => {
  const users = await User.find({});
  const uploads = await Upload.find({});
  res.render('admin', { users, uploads });
});

// Delete a user
router.post('/delete-user/:id', isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Delete an upload
router.post('/delete-upload/:id', isAdmin, async (req, res) => {
  await Upload.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

module.exports = router;
