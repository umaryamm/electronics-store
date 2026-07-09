const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require("../controller/projectController");

// Public
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Admin
router.post("/", auth, admin, createProject);
router.put("/:id", auth, admin, updateProject);
router.delete("/:id", auth, admin, deleteProject);

module.exports = router;