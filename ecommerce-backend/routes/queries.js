const express = require("express");
const router  = express.Router();

const auth  = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    createQuery,
    getQueries,
    updateQueryStatus,
    deleteQuery
} = require("../controller/queryController");

// Public — anyone submitting the storefront Contact form
router.post("/", createQuery);

// Admin
router.get("/",       auth, admin, getQueries);
router.patch("/:id",  auth, admin, updateQueryStatus);
router.delete("/:id", auth, admin, deleteQuery);

module.exports = router;

