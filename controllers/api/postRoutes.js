const { User, Comment, Post } = require("../../models");
const router = require("express").Router();
const withAuth = require("../../auth");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [Comment],
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => { // GET a single post by its ID and renders the post page with the post found.
  try {
    const logInStatus = req.session.logged_in;
    const postData = await Post.findByPk(Number(req.params.id), {
      include: [
        { model: Comment, include: [{ model: User }] },
        { model: User },
      ],
    });
    const posts = [postData].map((post) => post.get({ plain: true }));
    if (!postData) {
      return res.status(400).json({ message: "Post not found" });
    } else res.render("post", { posts, logInStatus });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post("/:id", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      post_id: Number(req.params.id),
      user_id: req.session.user_id,
    });
    res.redirect(req.get("referer"));
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", withAuth, async (req, res) => {
  try {
    const findPost = await Post.findByPk(Number(req.params.id));
    console.log(req.session.user_id);
    console.log(findPost.user_id);
    console.log(findPost);
    if (findPost.user_id !== req.session.user_id) {
      res.status(403).json({ message: "That post is not yours." });
      return;
    }

    const updatedPost = await Post.update(req.body, {
      where: {
        id: Number(req.params.id),
      },
    });
    if (updatedPost[0] === 0) {
      res.status(404).json({ message: "Post not found" });
    } else res.redirect(req.get("referer"));
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", withAuth, async (req, res) => {
  try {
    const posts = await Post.findByPk(Number(req.params.id));
    if (posts.user_id !== req.session.user_id) {
      res.status(403).json({ message: "That post is not yours." });
      return;
    }
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      await posts.destroy();
      res.status(200).json({ message: "Post deleted." });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
