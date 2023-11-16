const { User, Comment, Post } = require("../../models"); // Import the models
const router = require("express").Router(); // Import the Express.js router
const withAuth = require("../../auth"); // Import the withAuth middleware

router.get("/", async (req, res) => { // GET all comments in the database and sends them back as JSON
    try {
      const comments = await Comment.findAll();
      res.status(200).json(comments);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get("/:id", async (req, res) => { // GET a single comment by its ID and sends it back as JSON
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
  router.put("/:id", withAuth, async (req, res) => { // PUT update a comment by its ID and sends it back as JSON. Will add functionality in a future update
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
  
  router.delete("/:id", withAuth, async (req, res) => { // DELETE a comment by its ID and sends it back as JSON. Will add functionality in a future update
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
