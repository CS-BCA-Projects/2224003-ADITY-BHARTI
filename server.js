const express = require('express');
const app = express();
const dotenv = require('dotenv');
const multer = require("multer");
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const User = require('./models/User'); // Ensure the path is correct

const Book = require('./models/Book');
const Category = require('./models/Category');
const categoryRoutes = require('./routes/category');
const authRoutes = require('./routes/auth'); 
const signRoutes = require('./routes/sign'); 

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net/RishiVerse";

// ✅ **Connect to MongoDB - Only Once**
mongoose.connect(`${MONGODB_URI}/RishiVerse`, {
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
app.use('/category',categoryRoutes);
app.use('/api', require('./routes/sign'));
app.use('/api', require('./routes/auth'));

// ✅ **Error Handling Middleware**
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});




// ✅ **Render Other Pages**
app.get('/collection', (req, res) => res.render('collection'));
app.get('/download', (req, res) => res.render('download'));
app.get('/rishis', (req, res) => res.render('rishis'));


// ✅ **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
