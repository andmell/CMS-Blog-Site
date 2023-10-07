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

router.get("/:id", async (req, res) => {
  try {
    const posts = await Post.findByPk(Number(req.params.id), {
      include: [Comment],
    });
    if (!posts) {
      return res.status(400).json({ message: "Post not found" });
    } else res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// add withAuth helper
router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// add withAuth helper
router.post("/:id/comments", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      post_id:Number(req.params.id),
      user_id:req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add withAuth helper, and ensure req.session.user_id = post.user_id
router.put("/:id", withAuth, async (req, res) => {
  try {
    const findPost = await Post.findByPk(Number(req.params.id));
    console.log(req.session.user_id);
    console.log(findPost.user_id);
    console.log(findPost);
    if (findPost.user_id !== req.session.user_id) {
      res.status(403).json({ message: "That post is not yours." })
      return;
    }

    const updatedPost = await Post.update(req.body, {
      where: {
        id: Number(req.params.id),
      },
    });
    if (updatedPost[0] === 0) {
      res.status(404).json({ message: "Post not found" });
    } else res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add withAuth helper, and ensure req.session.user_id = post.user_id
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const posts = await Post.findByPk(Number(req.params.id));
    if (posts.user_id !== req.session.user_id) {
      res.status(403).json({ message: "That post is not yours." })
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
