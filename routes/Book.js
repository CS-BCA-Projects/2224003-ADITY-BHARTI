const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/Book");

const router = express.Router();

// Storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload book route
router.post("/upload", upload.single("bookFile"), async (req, res) => {
    try {
        const newBook = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            filePath: req.file.path,
            fileType: path.extname(req.file.originalname)
        });

        await newBook.save();
        res.redirect("/");
    } catch (error) {
        res.status(500).send("Error uploading book");
    }
});
router.get("/book/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render("bookDetails", { book });
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).send("Server Error");
    }
});

router.get("/category/:genre", async (req, res) => {
    try {
        const books = await Book.find({ genre: req.params.genre });
        res.render("category", { books, genre: req.params.genre });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Server Error");
    }
});
module.exports = router;
