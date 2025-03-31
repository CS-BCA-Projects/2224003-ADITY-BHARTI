const express = require('express');
const router = express.Router();
//const Category = require('../models/Category');
//const Book = require('../models/Book')

router.get("/", async (req, res) => {
    try {
      
        const categories = await Category
        .aggregate([
            {
                $lookup: {
                    from: "books", // Reference Book collection
                    localField: "_id",
                    foreignField: "genre",
                    as: "books"
                }
            }
        ]);

        console.log("📚 Categories with Books:", categories);
        res.render("category", { categories });
    } catch (error) {
        console.error("❌ Error fetching categories:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to get books by category name
router.get("/books/:categoryName", async (req, res) => {
    const { categoryName } = req.params;
    try {
        const category = await Category.findOne({ name: categoryName });
        if (!category) return res.status(404).send("Category not found");

        const books = await Book.find({ genre: category._id });
        res.render("category_book", { categoryName, books }); // Render EJS page
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch books", details: err.message });
    }
});

module.exports = router;