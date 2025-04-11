const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Upload = require('../models/upload');
const culturalKeywords = require('../utils/cultural');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Render upload page
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('upload', { user: req.session.user });
});

// Handle upload with cultural criteria check
router.post('/', upload.fields([{ name: 'cover' }, { name: 'file' }]), async (req, res) => {
  try {
    const { title, author, type, culturalKeywords: userInput } = req.body;

    // Check if the explanation includes at least one cultural keyword
    const isValid = culturalKeywords.some(keyword =>
      userInput.toLowerCase().includes(keyword)
    );

    if (!isValid) {
      return res.status(400).send(`
        <h2 style="color:red;">Upload rejected</h2>
        <p>Your description must mention at least one element of Ancient Indian Culture.</p>
        <a href="/upload">Go back</a>
      `);
    }

    const newUpload = new Upload({
      title,
      author,
      type,
      cover: req.files.cover[0].filename,
      file: req.files.file[0].filename,
      uploadedBy: req.session.user._id,
      culturalExplanation: userInput // Optional, you can save the reasoning too
    });

    await newUpload.save();
    res.redirect('/myCollections');

  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).send("Upload failed.");
  }
});

module.exports = router;
