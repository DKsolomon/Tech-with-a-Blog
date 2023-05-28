const router = require('express').Router();
const { User, Post,  Comment } = require('../../models');

router.get('/', async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [{ model: User, attributes: ['username'] }, {model: Comment, attributes: ['content'], order: [['id', 'ASC']] }],
      });
      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [{ model: User, attributes: ['username'] }, {model: Comment, attributes: ['content'], order: [['id', 'ASC']] }],
      });

      if (!postData) {
        res.status(404).json({ message: 'No Post found with that id!' });
        return;
      }

      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.post('/', async (req, res) => {
    try {
      const postData = await Post.create(req.body);
      res.status(200).json(postData);
    } catch (err) {
      res.status(400).json(err);
    }
  });


  router.delete('/:id', async (req, res) => {
    try {
      const postId = req.params.id;

      await Comment.destroy({
        where: { post_id: postId, },
      });
  
      const deletedPostCount = await Post.destroy({
        where: {id: postId,},
      });

      if (deletedPostCount === 0) {
        res.status(404).json({ message: 'No post found with that id!' });
        return;
      }
  
      res.json({ message: 'Post and associated comments deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.put('/:id', async (req, res) => {
  try {
    const postData = await Post.update(req.body, {
      where: { id: req.params.id, },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with that id!' });
      return;
    }

    res.status(200).json({ message: 'Post updated!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

  
  module.exports = router;