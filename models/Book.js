const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String },
    contentUrl: { type: String } // Link to the book PDF or content
});

module.exports = mongoose.model("Book", bookSchema);
