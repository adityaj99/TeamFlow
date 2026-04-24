import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
} from "./project.controller.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin"),
  createProject,
);

router.get("/:id", protect, requireActiveOrg, getProjectById);
router.get("/", protect, requireActiveOrg, getProjects);
router.delete("/:id", protect, requireActiveOrg, deleteProject);

export default router;
