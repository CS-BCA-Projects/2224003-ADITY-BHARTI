// models/Result.js
const mongoose = require('mongoose');
const resultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true }, // in seconds
    answers: [{ questionId: mongoose.Schema.Types.ObjectId, answer: String }]
});

module.exports = mongoose.model('Result', resultSchema);
