import express from "express";
import { getNotification, markAsRead } from "./notification.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getNotification);
router.patch("/read", protect, markAsRead);

export default router;
