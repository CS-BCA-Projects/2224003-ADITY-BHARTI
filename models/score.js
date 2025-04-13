const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  level: String,
  topic: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
