const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: String,
  author: String,
  type: { type: String, enum: ['Book', 'Thesis', 'Research Paper'] },
  cover: String,
  file: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', uploadSchema);
