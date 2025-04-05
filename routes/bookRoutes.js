const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Book = require("../models/book");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Check if content is related to Indian culture
const isIndianCultureRelated = (title, description) => {
    const keywords = ["India", "Vedic", "Mahabharata", "Ramayana", "Bhagavad Gita", "Sanskrit", "Ayurveda", "Dharma"];
    return keywords.some(keyword => (title + " " + description).toLowerCase().includes(keyword.toLowerCase()));
};

// Upload book route
router.post("/upload", upload.single("book"), async (req, res) => {
    try {
        const { title, author, description, category } = req.body;
        const userId = req.user._id; // Assume authentication is set up

        if (!isIndianCultureRelated(title, description)) {
            fs.unlinkSync(req.file.path); // Delete file
            return res.status(400).send("Only books related to Indian culture are allowed.");
        }

        const newBook = new Book({
            userId,
            title,
            author,
            description,
            category,
            filePath: req.file.path
        });

        await newBook.save();
        res.redirect("/profile");

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch uploaded books for profile
router.get("/profile", async (req, res) => {
    try {
        const userId = req.user._id; 
        const books = await Book.find({ userId });
        res.render("profile", { books });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
