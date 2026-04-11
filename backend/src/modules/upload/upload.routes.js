import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import { uploadFile } from "./upload.controller.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

export default router;
