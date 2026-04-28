import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";

import "./notification.worker.js";
import "./email.worker.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Worker mongoDb connected");
  })
  .catch((err) => {
    console.error("Failed to connect worker MongoDB", err);
  });

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Worker is alive, healthy, and processing queues!");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = 10000;

server.listen(PORT, () => {
  console.log(
    `Native HTTP dummy server listening on port ${PORT} to satisfy Render`,
  );
  console.log(
    "All background workers are up and listening to Upstash Redis...",
  );
});
