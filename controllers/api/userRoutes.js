const {User, Comment, Post} = require("../../models");
const router = require("express").Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
    //   include: [{ model: Comment }]
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => { // POST a new user to the database and redirects to the homepage once posted.
    try {
        const user = await User.create(req.body);
        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.logged_in = true;
            res.redirect('/');
        });
    } catch (err) {
        res.status(400).json(err);
    }
})

router.get('/:id/dashboard', async (req, res) => { // GET a single user by its ID and renders the dashboard with the user found. Typically used for the user to view their own dashboard.
  try {
    const logInStatus = req.session.logged_in;
    const user = await User.findByPk(req.params.id, {
      include: [Post],
    });
    res.render('dashboard', { logInStatus, user, partials: { header: 'header' } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/login', async (req, res) => { // POST a login request to the database and redirects to the homepage once logged in.
  try {
    const userInfo = await User.findOne({
      where: { username: req.body.username },
    }); 
    if (!userInfo) {
      res
        .status(400)
        .json({ message: "Wrong username or password, please try again!" }); 
      return;
    }
    const validPassword = userInfo.checkPassword(req.body.password); 

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userInfo.id; 
      req.session.logged_in = true;
      if (req.session.logged_in) {
        res.redirect('/');
      }
    });
  } catch (err) {
    res.status(400).json(err);
  }
})

router.post('/logout', (req, res) => { // POST a logout request to the database and redirects to the homepage once logged out.
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
