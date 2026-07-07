const express = require("express");
const router  = express.Router();

const auth  = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    createOrder,
    getMyOrders,
    getMyOrderById,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updateTrackingNumber,
    deleteOrder
} = require("../controller/orderController");

// Customer
router.post("/",       auth,        createOrder);
router.get("/my",      auth,        getMyOrders);
router.get("/my/:id",  auth,        getMyOrderById);

// Admin
router.get("/",           auth, admin, getAllOrders);
router.get("/:id",        auth, admin, getOrderById);
router.put("/:id/status", auth, admin, updateOrderStatus);
router.put("/:id/tracking", auth, admin, updateTrackingNumber);
router.delete("/:id",     auth, admin, deleteOrder);

module.exports = router;