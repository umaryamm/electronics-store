const express = require("express");
const router  = express.Router();

const auth  = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    getBlogPosts,
    getBlogPostById,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
} = require("../controller/blogController");

// Public
router.get("/",    getBlogPosts);
router.get("/:id", getBlogPostById);

// Admin
router.post("/",    auth, admin, createBlogPost);
router.put("/:id",  auth, admin, updateBlogPost);
router.delete("/:id", auth, admin, deleteBlogPost);

module.exports = router;