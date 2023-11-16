const router = require('express').Router();
const withAuth = require('../../auth')
const {User, Post, Comment} = require('../../models')

router.get('/', withAuth, (req, res) => { // GET all posts in the database and renders the dashboard with the posts found. 
    const logInStatus = req.session.logged_in;
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'body', 'created_at'],
        include: [
            {
                model: Comment, // Include the Comment model for the post
                attributes: ['id', 'body', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User, // Include the User model for the post to load the user who created the post
                attributes: ['username']
            }
        ],
    }).then(postData => {
        const posts = postData.map(post => post.get({plain: true})); //mapping through all posts and serializing them so that they can be rendered to the page
        res.render('dashboard', {posts, logInStatus});
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});
router.post("/", withAuth, async (req, res) => { // POST a new post to the database and refreshes the page once posted.
    try {
      const newPost = await Post.create({
        ...req.body,
        user_id: req.session.user_id,
      });
      res.redirect(req.get('referer'));
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;