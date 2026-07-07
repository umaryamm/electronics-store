const express = require("express");
const router  = express.Router();

const auth  = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
} = require("../controller/reviewController");

// Public
router.get("/products/:productId/reviews", getProductReviews);

// User
router.post("/products/:productId/reviews", auth, createReview);
router.put("/reviews/:id",                  auth, updateReview);
router.delete("/reviews/:id",               auth, deleteReview);

module.exports = router;