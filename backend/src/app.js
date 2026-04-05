import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

import userRoutes from "./modules/user/user.routes.js";
import { protect } from "./middlewares/auth.middleware.js";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Teamflow is running!");
});

app.get("/api/protected", protect, (req, res) => {
  res.send("This is a protected route. User ID: " + req.user._id);
});

app.use("/api/auth", userRoutes);

export default app;
