const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    { collection: "categories" } // ✅ Explicitly set the collection name
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;  // ✅ Ensure proper export
