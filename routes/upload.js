const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('../models/upload');
const culturalKeywords = require('../utils/cultural');
const cloudinary = require('../config/cloudinary');
const uploadOnCloudinary = require('../config/cloudinary');

// Temporary disk storage before uploading to Cloudinary
const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: tempStorage });

// Render upload form
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('upload', { user: req.session.user });
});

// Handle form submission
router.post('/', upload.fields([{ name: 'cover' }, { name: 'file' }]), async (req, res) => {
  try {
    // 🛡️ Check session
    if (!req.session.user) {
      return res.status(401).send(`
        <h2 style="color:red;">Unauthorized</h2>
        <p>Please login to upload a book.</p>
        <a href="/login">Login</a>
      `);
    }

    const { title, author, type, culturalKeywords: userInput } = req.body;

    // ✅ Cultural validation
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

    // ✅ Upload files to Cloudinary
    const coverPath = req.files.cover[0].path;
    const filePath = req.files.file[0].path;

    const coverUpload = await uploadOnCloudinary(coverPath);

    const fileUpload = await uploadOnCloudinary(filePath);
    if (!fileUpload) {
      return res.status(500).send("File upload failed.");
    }
    console.log("Cover upload:", coverUpload);
    console.log("File upload:", fileUpload);
    
    // ✅ Delete local files
    fs.unlink(coverPath, err => {
      if (err) console.error("❌ Error deleting cover:", err);
    });
    fs.unlink(filePath, err => {
      if (err) console.error("❌ Error deleting file:", err);
    });

    // ✅ Save to MongoDB
    
    const newUpload = new Upload({
      title,
      author,
      type,
      uploadedBy: req.session.user._id,
      culturalExplanation: userInput,
      cover: {
        url: coverUpload.secure_url,
        public_id: coverUpload.public_id
      },
      file: {
        url: fileUpload.secure_url,
        public_id: fileUpload.public_id
      }
    });

    await newUpload.save();
    res.redirect('/myCollections');

  } catch (err) {
    console.error("🔥 Upload error:", err);
    res.status(500).send("Upload failed.");
  }
});

module.exports = router;
