const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String},
  type: { type: String, enum: ['Book', 'Thesis', 'Research Paper'], required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  culturalExplanation: { type: String, required: true },
  cover: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  file: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', uploadSchema);
