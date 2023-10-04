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


module.exports = router;
