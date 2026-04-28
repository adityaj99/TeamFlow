import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
  updatePassword,
  updateProfile,
} from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { attachOrg } from "../../middlewares/attachOrg.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.get("/profile", protect, attachOrg, getProfile);
router.patch("/profile", protect, updateProfile);
router.put("/change-password", protect, updatePassword);

export default router;
