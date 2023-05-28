const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {

    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }]
    });
    const posts = postData.map((post) => post.get({ plain: true }));


    res.render('homepage', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get('/dashboard', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }], 
      where: { user_id: req.session.user_id },
      
    });
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('dashboard', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/posts/:id', async (req, res) => {
  try {

    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }]
    });
    const post = postData.get({ plain: true });

    const commentData = await Comment.findAll({
      include: [{ model: User, attributes: ['username'] }],
      where: { post_id: req.params.id},
     
    });

    const comments = commentData.map((comment) => comment.get({ plain: true }));
    
    res.render('post', { post, comments, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', async (req, res) => {
  
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  
  res.render('signup');
  
});

module.exports = router;