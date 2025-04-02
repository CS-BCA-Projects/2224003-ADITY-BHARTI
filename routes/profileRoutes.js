const express = require("express");
const multer = require("multer");
const User = require('../models/User'); 
//const Book = require("../models/Book");
const router = express.Router();

router.get("/", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login"); // Redirect if user not logged in
    }
    res.render("profile", { user: req.session.user });
});
router.get('/profile', (req, res) => {
        console.log("Session User:", req.session.user); // Debugging
    
        if (!req.session.user) {
            return res.redirect('/signup'); // Redirect only if user is not logged in
        }
    
        res.render('profile', { user: req.session.user });
    });
    
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});




const upload = multer({ storage });

// Get user profile
router.get("/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).populate("books");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Follow a user
router.post("/follow/:username", async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const userToFollow = await User.findOne({ username: req.params.username });

        if (!userToFollow) return res.status(404).json({ error: "User not found" });

        if (!currentUser.following.includes(userToFollow._id)) {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
            await currentUser.save();
            await userToFollow.save();
        }

        res.json({ message: "Followed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Upload a book
router.post("/upload-book", upload.single("book"), async (req, res) => {
    try {
        const newBook = new Book({
            title: req.file.originalname,
            filePath: req.file.path,
            uploadedBy: req.user.id,
        });
        await newBook.save();

        const User = await User.findById(req.user.id);
        User.books.push(newBook._id);
        await User.save();

        res.json({ message: "Book uploaded successfully" });
    } catch (error) {
        res.status(500).json({ error: "Upload failed" });
    }
    
    
});

module.exports = router;
