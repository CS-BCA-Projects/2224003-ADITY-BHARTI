const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: Number, // index of correct option
  fact: String
});

module.exports = mongoose.model('Question', questionSchema);
