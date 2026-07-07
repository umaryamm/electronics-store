// routes/cart.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require("../controller/cartController");

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:itemId", auth, updateCartItem);
router.delete("/:itemId", auth, removeCartItem);
router.delete("/", auth, clearCart);

module.exports = router;