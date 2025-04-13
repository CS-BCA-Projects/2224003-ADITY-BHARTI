// models/quiz.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [String], // 4 options
  correctAnswer: { type: Number, required: true }, // index of correct option (0 to 3)
  fact: { type: String, required: true } // shown after answering
});

const quizSchema = new mongoose.Schema({
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true },
  questions: [questionSchema]  // store multiple questions per level
});

module.exports = mongoose.model('Quiz', quizSchema);