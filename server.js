const express = require('express');
const app = express();
const session = require("express-session");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const Category = require('./models/Category');
const Book = require('./models/Book');
const User = require('./models/User');
const categoryRoutes = require('./routes/category');
const loginRoutes = require('./routes/login');
const signRoutes = require('./routes/signup');
const profileRoutes = require('./routes/profileRoutes');
const templeRoutes = require('./routes/temples');
const uploadRoute = require('./routes/upload'); // adjust path if needed
const myCollectionRoute = require('./routes/myCollections');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://adity07:mongoose123@cluster0.nt08p.mongodb.net/RishiVerse?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes Setup
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/signup'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/signup', signRoutes);
app.use('/login', loginRoutes);
app.use('/category', categoryRoutes);
app.use('/profile', profileRoutes);
app.use('/temples', templeRoutes);
app.use('/upload', uploadRoute);
app.use('/myCollections', myCollectionRoute);

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('/login', { user: req.session.user });
  }
});
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Get logged-in user info
app.get("/me", (req, res) => {
  if (req.session.user) {
    res.json({ User: req.session.user });
  } else {
    res.json({ User: null });
  }
});

// ✅ **Error Handling Middleware**
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});




// ✅ **Render Other Pages**

app.get('/download', (req, res) => res.render('download'));
app.get('/rishis', (req, res) => res.render('rishis'));
app.get('/agrarian', (req, res) => res.render('agrarian'));
app.get('/theNorth', (req, res) => res.render('theNorth'));
app.get('/fort', (req, res) => res.render('fort'));
app.get('/dance', (req, res) => res.render('dance'));
app.get('/caves', (req, res) => res.render('caves'));
app.get('/festival', (req, res) => res.render('festival'));
app.get('/audioBooks', (req, res) => res.render('audioBooks'));
app.get('/paintings', (req, res) => res.render('paintings'));
app.get('/historic-cities', (req, res) => res.render('historic-cities'));
// ✅ **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


