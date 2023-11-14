const router = require('express').Router();
const withAuth = require('../../auth')
const {User, Post, Comment} = require('../../models')

router.get('/', withAuth, (req, res) => {
    const logInStatus = req.session.logged_in;
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'body', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'body', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ],
    }).then(postData => {
        const posts = postData.map(post => post.get({plain: true}));
        res.render('dashboard', {posts, logInStatus});
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;