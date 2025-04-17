const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');

// My Collections page – only for logged-in users
router.get('/', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    // Fetch the uploads (e.g., books, theses, and research papers)
    const uploads = await Upload.find({ uploadedBy: req.session.user._id });

    uploads.forEach(upload => {
      // Check if the cover or file exists locally or on Cloudinary
      if (upload.cover && upload.cover.url) {
        upload.cover = { url: upload.cover.url };  // Cloudinary URL for cover
      } else {
        upload.cover = { url: '/uploads/' + upload.cover };  // Local path for cover
      }
      if (upload.file && upload.file.url) {
        upload.file = { url: upload.file.url };  // Cloudinary URL for file
      } else {
        upload.file = { url: '/uploads/' + upload.file };  // Local path for PDF file
      }
    });

    res.render('myCollections', { uploads });
  } catch (err) {
    console.error("🔥 Error fetching collections:", err);
    res.status(500).send("Error fetching collections.");
  }
});

module.exports = router;
