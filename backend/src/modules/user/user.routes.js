import express from "express";
import {
  getProfile,
  login,
  logout,
  register,
  updateProfile,
} from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { attachOrg } from "../../middlewares/attachOrg.middleware.js";
import { requireActiveOrg } from "../../middlewares/org.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/profile", protect, attachOrg, getProfile);
router.patch("/profile", protect, updateProfile);

export default router;
