const { User, Comment, Post } = require("../../models");
const router = require("express").Router();
const withAuth = require("../../auth");

router.get("/", async (req, res) => {
    try {
      const comments = await Comment.findAll();
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const comments = await Comment.findByPk(Number(req.params.id));
      if (!comments) {
        return res.status(400).json({ message: "Comment not found" });
      } else res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  // Add withAuth helper, and ensure req.session.user_id = post.user_id
  router.put("/:id", withAuth, async (req, res) => {
    try {
      const comments = await Comment.findByPk(Number(req.params.id));
      if (comments.user_id !== req.session.user_id) {
        res.status(403).json({ message: "That comment is not yours." })
        return;
      }
      const updatedComment = await Comment.update(req.body, {
        where: {
          id: Number(req.params.id),
        },
      });
      
      res.status(200).json(updatedComment);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Add withAuth helper, and ensure req.session.user_id = post.user_id
  router.delete("/:id", withAuth, async (req, res) => {
    try {
      const comments = await Comment.findByPk(Number(req.params.id));
      if (comments.user_id !== req.session.user_id) {
        res.status(403).json({ message: "That comment is not yours." })
        return;
      }
      if (!comments) {
        return res.status(400).json({ message: "Comment not found" });
      } else {
        await comments.destroy();
        res.status(200).json({ message: "Comment deleted." });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
