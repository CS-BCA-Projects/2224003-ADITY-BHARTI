const express = require('express');
const app = express();
const session = require("express-session");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const User = require('./models/User');
const categoryRoutes = require('./routes/category');
const authRoutes = require('./routes/auth'); 
const signRoutes = require('./routes/signup'); 
const profileRoutes = require('./routes/profileRoutes');

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
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/signup'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/signup', signRoutes);
app.use('/login', authRoutes);
app.use('/category', categoryRoutes);
app.use('/profile', profileRoutes);

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    res.render('profile', { user: req.session.user });
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
app.get('/collection', (req, res) => res.render('collection'));
app.get('/download', (req, res) => res.render('download'));
app.get('/', (req, res) => res.render('rishis'));



// ✅ **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


