const express = require("express");
const router  = express.Router();

const auth  = require("../middleware/auth");
const admin = require("../middleware/admin");

const { getDashboardStats } = require("../controller/statsController");

// Admin — live dashboard insight counts
router.get("/dashboard", auth, admin, getDashboardStats);

module.exports = router;
