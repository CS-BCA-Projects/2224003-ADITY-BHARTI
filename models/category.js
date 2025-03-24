const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // Ensure 'name' is required
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
