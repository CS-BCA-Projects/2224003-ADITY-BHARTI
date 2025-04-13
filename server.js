const express = require('express');
const app = express();
const session = require("express-session");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const Book = require('./models/book');
const User = require('./models/User');
const loginRoutes = require('./routes/login');
const signRoutes = require('./routes/signup');
const profileRoutes = require('./routes/profileRoutes');
const templeRoutes = require('./routes/temples');
const uploadRoute = require('./routes/upload'); // adjust path if needed
const myCollectionRoute = require('./routes/myCollections');
const eBooksRoute = require('./routes/eBooks');
const adminRoutes = require('./routes/admin');
const isAdmin = require('./middleware/isAdmin');
const authRoutes = require('./routes/auth');
dotenv.config({ path: './.env' });
const quizRoutes = require('./routes/quiz');
const leaderboardRoutes = require('./routes/leaderboard');
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
  id: "user_id",
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// After session and login middleware
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // makes `user` available in all EJS views
  next();
});

// Routes Setup
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/signup'));
app.use('/api', require('./routes/profileRoutes'));
app.use('/signup', signRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/temples', templeRoutes);
app.use('/upload', uploadRoute);
app.use('/myCollections', myCollectionRoute);
app.use('/eBook', eBooksRoute);
app.use('/uploads', express.static('uploads'));
app.use('/admin', adminRoutes);
app.use('/', authRoutes); 
app.use('/quiz', quizRoutes);
app.use('/leaderboard', leaderboardRoutes);


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
app.get('/', (req, res) =>
   res.render('rishis'));
app.get('/agrarian', (req, res) => res.render('agrarian'));
app.get('/theNorth', (req, res) => res.render('theNorth'));
app.get('/fort', (req, res) => res.render('fort'));
app.get('/dance', (req, res) => res.render('dance'));
app.get('/caves', (req, res) => res.render('caves'));
app.get('/festival', (req, res) => res.render('festival'));
app.get('/audioBooks', (req, res) => res.render('audioBooks'));
app.get('/paintings', (req, res) => res.render('paintings'));
app.get('/historic-cities', (req, res) => res.render('historic-cities'));
app.get('/admin', isAdmin, (req, res) => {res.render('admin'); });
app.get('/ayurveda', (req, res) => {res.render('ayurveda'); });
app.get('/scientist', (req, res) => {res.render('scientist'); });
app.get('/flipbook/:filename', (req, res) => {
  const filename = req.params.filename;
  res.render('flipbook', { pdfFile: filename });
});
// ✅ **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


