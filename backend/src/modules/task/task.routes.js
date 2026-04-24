import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import { allowRoles } from "../../middlewares/rbac.middleware.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "./task.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireActiveOrg,
  allowRoles("owner", "admin", "manager"),
  createTask,
);

router.get("/", protect, requireActiveOrg, getTasks);

router.patch("/:id/status", protect, requireActiveOrg, updateTaskStatus);
router.patch("/:id", protect, requireActiveOrg, updateTask);
router.delete("/:id", protect, requireActiveOrg, deleteTask);

export default router;
