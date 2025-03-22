const express = require('express');
const app = express();
const dotenv = require('dotenv');
const multer = require("multer");
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const Book = require('./models/Book');
const Category = require('./models/Category');
const connectDB = require('./DB/a.js'); // Ensuring only one DB connection
const authRoutes = require('./routes/auth'); 
const signRoutes = require('./routes/sign'); 

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net/RishiVerse";

// ✅ **Connect to MongoDB - Only Once**
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ **Middleware**
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// ✅ **Routes Setup**
app.use('/sign', signRoutes);
app.use('/login', authRoutes);
app.use('/api', require('./routes/sign'));
app.use('/api', require('./routes/auth'));

// ✅ **Error Handling Middleware**
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});



// ✅ **File Upload Setup (Multer)**
/*const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }*/
//});
//const upload = multer({ storage: storage });

// ✅ **UPLOAD PAGE**
//app.get("/upload", (req, res) => {
  //  res.render("upload");
//});

// ✅ **FILE UPLOAD**
/*app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { title, author, description } = req.body;
        const filePath = req.file.filename;

        const newBook = new Book({ title, author, description, contentUrl: `/uploads/${filePath}` });
        await newBook.save();

        res.redirect("/books");
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).send("File Upload Failed.");
    }
});*/
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find(); // Fetch all books from MongoDB
        res.render("books", { books });  // Pass books to EJS template
    } catch (err) {
        console.error("❌ Error fetching books:", err);
        res.status(500).send("Internal Server Error");
    }
});
// ✅ **Render Other Pages**
app.get('/collection', (req, res) => res.render('collection'));
app.get('/download', (req, res) => res.render('download'));
app.get('/login', (req, res) => res.render('login'));
app.get('/rishis', (req, res) => res.render('rishis'));
app.get('/category', (req, res) => res.render('category'));

// ✅ **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
