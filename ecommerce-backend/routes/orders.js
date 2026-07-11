const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
    checkout,
    getMyOrders,
    getOrderById,
    getShippingOptions,
    updateOrderStatus
} = require("../controller/orderController");

router.get("/shipping-options", getShippingOptions); // public — just pricing info, no sensitive data
router.post("/", auth, checkout);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id/status", auth, admin, updateOrderStatus);

module.exports = router;