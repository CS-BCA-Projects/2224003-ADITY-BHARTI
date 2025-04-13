// routes/user.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const Question = require('../models/Question');
const UserAnswer = require('../models/UserAnswer'); // Model to save user answers

// View all quizzes for users
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.render('user/quizList', { quizzes });
  } catch (error) {
    res.status(500).send('Error fetching quizzes');
  }
});

// View a specific quiz and its questions
router.get('/quiz/:quizId', async (req, res) => {
  const quizId = req.params.quizId;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    res.render('user/takeQuiz', { quiz });
  } catch (error) {
    res.status(500).send('Error fetching quiz details');
  }
});

// User submits answers for the quiz
router.post('/quiz/:quizId/submit', async (req, res) => {
  const quizId = req.params.quizId;
  const { answers } = req.body; // This will be an array of answers submitted by the user

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    // Save the user's answers
    const userAnswers = new UserAnswer({
      quiz: quizId,
      user: req.session.user._id, // assuming you're using session-based user authentication
      answers
    });

    await userAnswers.save();

    // Evaluate the quiz (check answers)
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    res.render('user/quizResults', { quiz, score });
  } catch (error) {
    res.status(500).send('Error submitting answers');
  }
});

module.exports = router;
