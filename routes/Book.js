const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  type: { type: String, enum: ['Book', 'Thesis', 'Research Paper'] },
  filePath: String,
  coverImagePath: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
