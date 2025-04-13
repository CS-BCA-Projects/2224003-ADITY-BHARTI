// routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Upload = require('../models/upload');
const Quiz = require('../models/quiz');
const Question = require('../models/Question');
const isAdmin = require('../middleware/isAdmin');

// Admin Dashboard
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    const uploads = await Upload.find({});
    res.render('admin', { users, uploads });
  } catch (error) {
    res.status(500).send('Error fetching dashboard data');
  }
});

// Delete a user
router.post('/delete-user/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin'); // You can also add a flash message here if needed
  } catch (error) {
    res.status(500).send('Error deleting user');
  }
});

// Delete an upload
router.post('/delete-upload/:id', isAdmin, async (req, res) => {
  try {
    await Upload.findByIdAndDelete(req.params.id);
    res.redirect('/admin'); // Same as above, add feedback if necessary
  } catch (error) {
    res.status(500).send('Error deleting upload');
  }
});

// Admin form to add quiz
router.get('/add-quiz', (req, res) => {
  res.render('admin/addQuiz'); // Create this EJS page
});

// Handle quiz creation
router.post('/add-quiz', async (req, res) => {
  try {
    const { title, description, level, category, questions } = req.body;

    // Parse and save questions
    const savedQuestions = [];
    for (let q of questions) {
      const question = new Question({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        fact: q.fact
      });
      const savedQ = await question.save();
      savedQuestions.push(savedQ._id);
    }

    const quiz = new Quiz({ title, description, level, category, questions: savedQuestions });
    await quiz.save();

    res.send('Quiz created successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating quiz');
  }
});
module.exports = router;
