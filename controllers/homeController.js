const router = require("express").Router();
const {Post} = require("../models");

router.get('/', async (req, res) => {
    try {
        // const logInStatus = req.session.logged_in;
        const postData = await Post.findall({
            attributes: {include: ["title"], exclude: ["body"]},
            order: [["createdAt", "DES"]]
        });
            const posts = postData.map((post) => post.get({ plain: true }));

            res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Interal server error"})
    }
});


module.exports = router;