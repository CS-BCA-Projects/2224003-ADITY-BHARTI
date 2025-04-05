const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Message = require('../models/Message');
const Poll = require('../models/Poll');
const router = express.Router();

module.exports = (io) => {
  router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const messages = await Message.find().sort({ pinned: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const polls = await Poll.find();
    const books = await Book.find();
    res.render('chat', { messages, polls, books, page });
  });

  router.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hash });
    await user.save();
    res.redirect('/login');
  });

  router.get('/register', (req, res) => res.send('<form method="POST">Username<input name="username"/><br>Password<input name="password" type="password"/><button>Register</button></form>'));

  router.get('/login', (req, res) => res.send('<form method="POST">Username<input name="username"/><br>Password<input name="password" type="password"/><button>Login</button></form>'));

  router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user._id;
      req.session.username = user.username;
      return res.redirect('/');
    }
    res.send('Login failed');
  });

  router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
  });

  router.post('/message', async (req, res) => {
    const { text, topic } = req.body;
    let imageUrl = '';
    if (req.files && req.files.image) {
      const file = req.files.image;
      imageUrl = '/uploads/' + file.name;
      await file.mv('public' + imageUrl);
    }
    const message = new Message({
      username: req.session.username || 'Guest',
      text,
      topic,
      imageUrl
    });
    await message.save();
    io.emit('chatMessage', message);
    res.redirect('/');
  });

  router.post('/pin/:id', async (req, res) => {
    await Message.findByIdAndUpdate(req.params.id, { pinned: true });
    res.redirect('/');
  });

  router.post('/poll', async (req, res) => {
    const options = req.body.options.split(',').map(opt => ({ text: opt.trim(), votes: 0 }));
    const poll = new Poll({ question: req.body.question, options });
    await poll.save();
    res.redirect('/');
  });

  router.post('/poll/vote/:pollId/:optIndex', async (req, res) => {
    const poll = await Poll.findById(req.params.pollId);
    if (poll && poll.options[req.params.optIndex]) {
      poll.options[req.params.optIndex].votes += 1;
      await poll.save();
    }
    res.redirect('/');
  });

  router.post('/recommend-book', async (req, res) => {
    const { title, author, description } = req.body;
    const book = new Book({
      title,
      author,
      description,
      recommendedBy: req.session.username || 'Anonymous'
    });
    await book.save();
    res.redirect('/');
  });

  return router;
};
