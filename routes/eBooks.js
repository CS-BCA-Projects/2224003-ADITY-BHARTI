const express = require('express');
const router = express.Router();
const Upload = require('../models/upload');

router.get('/', async (req, res) => {
  try {
    const uploads = await Upload.find({}).sort({ createdAt: -1 });

    // Process uploads to ensure correct URL format
    uploads.forEach(upload => {
      if (upload.cover && upload.cover.url) {
        upload.cover = { url: upload.cover.url }; // Cloudinary URL for cover
      } else {
        upload.cover = { url: '/uploads/' + (upload.cover || 'default-cover.jpg') }; // Fallback for local or missing cover
      }
      if (upload.file && upload.file.url) {
        upload.file = { url: upload.file.url }; // Cloudinary URL for file
      } else {
        upload.file = { url: '/uploads/' + (upload.file || 'default-file.pdf') }; // Fallback for local or missing file
      }
    });

    res.render('eBook', { uploads });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/delete', async (req, res) => {
  try {
    const { deleteAction, selectedIds } = req.body;

    if (deleteAction === 'all') {
      await Upload.deleteMany({});
    } else if (deleteAction === 'selected' && Array.isArray(selectedIds)) {
      await Upload.deleteMany({ _id: { $in: selectedIds } });
    }

    res.redirect('/eBook');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting books');
  }
});

module.exports = router;