const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const { MongoClient } = require("mongodb");
const MONGODB_URI = process.env.MONGODB_URI;

const path = require('path');

const connectDB = require('./DB/a.js');
const authRoutes = require('./routes/auth'); 
const signRoutes = require('./routes/sign'); 
const PORT = process.env.PORT || 5000;
const client = new MongoClient(MONGODB_URI);
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));



// Routes
app.use('/api', signRoutes);
app.use('/auth', authRoutes);

// app.use('/api', require('./routes/sign'));
// app.use('/api', require('./routes/auth'));

// Render views
app.get('/category', (req, res) => res.render('category'));
app.get('/collection', (req, res) => res.render('collection'));
app.get('/download', (req, res) => res.render('download'));
app.get('/login', (req, res) => res.render('login'));
app.get('/rishis', (req, res) => res.render('rishis'));
app.get('/signup', (req, res) => res.render('signup'));

// Redirect POST requests
// app.post('/signup', (req, res) => res.redirect(307, '/api/signup'));
// app.post('/login', (req, res) => res.redirect(307, '/auth/login'));

// Database connection
connectDB();

app.post('/Insertbooks', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("RishiVerse");
        const books = database.collection("books");

        // Get book data from the request body
        const bookData = req.body;

        // Insert into MongoDB
        const result = await books.insertOne(bookData);
        res.status(201).json({ message: "Book inserted", bookId: result.insertedId });
    } catch (error) {
        console.error("Error inserting book:", error.message);

        res.status(500).json({ error: "Failed to insert book" });
    } finally {
        await client.close();
    }
});

app.get('/books', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("RishiVerse");
        const books = database.collection("books");

        const allBooks = await books.find({}).toArray();
        res.status(200).json(allBooks);
    } catch (error) {
        console.error("Error fetching books:", error.message);

        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
