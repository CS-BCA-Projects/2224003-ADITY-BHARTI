// routes/quiz.js
const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');
const Score = require('../models/score');
const UserAnswer = require('../models/userAnswer');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

router.get('/', isAuthenticated, (req, res) => {
  res.render('quiz', { username: req.session.user.username });
});

router.get('/data', isAuthenticated, async (req, res) => {
  try {
    const { level } = req.query;
    if (!level) {
      return res.status(400).json({ error: 'Level is required' });
    }

    const quizzes = await Quiz.find({ level }).populate('questions');
    if (!quizzes.length) {
      return res.status(404).json({ error: `No quizzes found for level: ${level}` });
    }

    const formatted = quizzes.flatMap(q =>
      q.questions.map((question, index) => ({
        text: question.questionText,
        options: question.options,
        correct: question.correctAnswer,
        fact: question.fact,
        questionIndex: index
      }))
    );

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ error: 'Error fetching quiz data' });
  }
});

router.post('/submit', isAuthenticated, async (req, res) => {
  try {
    const { score, level, answers } = req.body;
    const userId = req.session.user._id;

    // Save score
    const newScore = new Score({
      userId,
      score,
      level,
      topic: 'Ayurveda'
    });
    await newScore.save();

    // Save user answers
    const quiz = await Quiz.findOne({ level });
    if (quiz) {
      const userAnswer = new UserAnswer({
        quiz: quiz._id,
        user: userId,
        answers: answers.map((ans, idx) => ({
          questionIndex: idx,
          selectedAnswer: ans
        })),
        score,
        level
      });
      await userAnswer.save();
    }

    res.status(200).json({ message: 'Score and answers submitted' });
  } catch (error) {
    console.error('Error saving score/answers:', error);
    res.status(500).json({ error: 'Error saving score/answers' });
  }
});

router.get('/result', async (req, res) => {
  try {
    const { score, level } = req.query;
    const userId = req.session.user ? req.session.user._id : null;
    const username = req.session.user ? req.session.user.username : null;

    const quiz = await Quiz.findOne({ level }).populate('questions');
    if (!quiz) {
      return res.render('quizResults', {
        error: 'Quiz not found',
        quiz: { title: 'Error', questions: [] },
        score: 0,
        answers: [],
        username
      });
    }

    let answers = new Array(quiz.questions.length).fill(-1);
    if (userId) {
      // Fetch latest user answers for logged-in users
      const userAnswer = await UserAnswer.findOne({ level, user: userId })
        .sort({ date: -1 })
        .lean();
      if (userAnswer) {
        answers = userAnswer.answers.map(a => a.selectedAnswer);
      }
    }

    res.render('quizResults', {
      quiz: { title: `${level} Quiz`, questions: quiz.questions },
      score: parseInt(score) || 0,
      answers,
      username,
      error: null
    });
  } catch (error) {
    console.error('Error loading results:', error);
    res.render('quizResults', {
      error: 'Unable to load results',
      quiz: { title: 'Error', questions: [] },
      score: 0,
      answers: [],
      username: req.session.user ? req.session.user.username : null
    });
  }
});

module.exports = router;