// models/userAnswer.js
const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    questionIndex: Number,
    selectedAnswer: Number
  }],
  score: { type: Number, required: true },
  level: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);