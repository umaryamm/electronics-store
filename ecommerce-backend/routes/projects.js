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

// ============================================================
// TEMPORARY: auth/admin checks disabled for local dev while
// sorting out Neon DB + JWT flow. RE-ENABLE before deploying
// or before this admin panel is used by anyone but you.
// ============================================================
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
// ============================================================
// END TEMPORARY — original protected versions below, commented:
// router.post("/", auth, admin, createProject);
// router.put("/:id", auth, admin, updateProject);
// router.delete("/:id", auth, admin, deleteProject);
// ============================================================

module.exports = router;