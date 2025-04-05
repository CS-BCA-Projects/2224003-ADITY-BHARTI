const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  topic: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
  pinned: { type: Boolean, default: false },
});
module.exports = mongoose.model('Message', MessageSchema);
