const router = require('express').Router();
const { User, Post } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const userData = await User.findAll({
      include: [{ model: Post }], attributes: { exclude: ['password']},
    });
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: Post}], attributes: { exclude: ['password']},
    });

    if (!userData) {
      res.status(404).json({ message: 'No User found with that id!' });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
  }
});





router.post('/login', async (req, res) => {
  try {

    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }


    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
   
    req.session.destroy(() => {
      res.status(204).json({ message: "You are now logged out" });
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;