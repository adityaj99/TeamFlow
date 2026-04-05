import express from "express";
import cors from "cors";
const app = express();

import userRoutes from "./modules/user/user.routes.js";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Teamflow is running!");
});

app.use("/api/auth", userRoutes);

export default app;
