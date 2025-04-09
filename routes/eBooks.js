const express = require('express');
const router = express.Router();
const Upload = require('../models/upload'); // Your Mongoose model

// GET /ebooks - public route
router.get('/', async (req, res) => {
  try {
    const uploads = await Upload.find({}).sort({ createdAt: -1 }); // fetch all uploads
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
