const express = require('express');
const router = express.Router();
const Recommendation = require('../models/Recommendation');
const Post = require('../models/Post');

// Recommend a book
router.post('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).send('Post not found');
        
        const recommendation = new Recommendation({
            post: req.params.postId,
            user: req.user._id,
            bookTitle: req.body.bookTitle
        });
        await recommendation.save();
        res.redirect('/forum');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get recommendations for a post
router.get('/:postId', async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ post: req.params.postId }).populate('user', 'name');
        res.json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
