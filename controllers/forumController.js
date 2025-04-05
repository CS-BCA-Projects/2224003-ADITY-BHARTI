const Post = require('../models/Post');

exports.getForum = async (req, res) => {
  const posts = await Post.find({}).populate('user').sort({ createdAt: -1 });
  res.render('index', { posts });
};

exports.getNewPostForm = (req, res) => {
  res.render('new');
};

exports.createPost = async (req, res) => {
  const { title, description, category } = req.body;
  const user = req.session.user;

  const newPost = new Post({
    title,
    description,
    category,
    user: user._id,
  });
  await newPost.save();
  res.redirect('/forum/post/' + newPost._id);
};

exports.getSinglePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId)
      .populate('user')
      .populate('comments.user');

    if (!post) return res.status(404).send("Post not found");

    res.render('post', { post, currentUser: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postComment = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const userId = req.session.user._id;
  let image = null;

  if (req.file) {
    image = '/uploads/' + req.file.filename;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      content,
      user: userId,
      image,
    };

    post.comments.push(comment);
    await post.save();

    res.json({ success: true, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
};
