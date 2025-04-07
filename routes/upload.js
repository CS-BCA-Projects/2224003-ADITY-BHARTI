const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Upload = require('../models/upload');

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

router.post('/', upload.fields([{ name: 'cover' }, { name: 'file' }]), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files); // <-- log the received files

    const newUpload = new Upload({
      title: req.body.title,
      author: req.body.author,
      type: req.body.type,
      cover: req.files.cover[0].filename,
      file: req.files.file[0].filename,
      uploadedBy: req.session.user._id
    });
    await newUpload.save();
    res.redirect('/myCollections');
  } catch (err) {
    console.error("🔥 Multer error:", err);
    res.status(500).send("Upload failed.");
  }
});



module.exports = router;
