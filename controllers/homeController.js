const router = require("express").Router();
const {Post, User} = require("../models");

router.get('/', async (req, res) => { // GET all posts in the database and renders the homepage with the posts found.
    try {
        const logInStatus = req.session.logged_in;
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            
            ],
            order: [["createdAt", "DESC"]]
        });
            const posts = postData.map((post) => post.get({ plain: true }));

            res.render('homepage', {logInStatus, posts});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Interal server error"})
    }
});
router.get('/login', async (req,res) => { // GET the login page and renders it.
    res.render('login', {layout: 'main'}); 
  });

router.get('/register', async (req, res) => { // GET the register page and renders it.
    res.render('register', {layout: 'main'});
})

module.exports = router;