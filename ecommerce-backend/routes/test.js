const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

console.log("auth:", typeof auth);
console.log("admin:", typeof admin);

const router = express.Router();

router.get("/admin-only", auth, admin, (req, res) => {
    res.json({
        message: "Welcome Admin!"
    });
});

module.exports = router;