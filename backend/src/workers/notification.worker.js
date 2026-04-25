import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import Notification from "../modules/notification/notification.model.js";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Worker mongodb connected");
  })
  .catch((err) => {
    console.error("Failed to connect worker MongoDB", err);
  });

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { userId, orgId, type, message, relatedId } = job.data;

    const noti = await Notification.create({
      user: userId,
      organization: orgId,
      type,
      message,
      relatedId,
    });

    console.log("notification:", noti);
  },
  {
    connection: redisConnection,
  },
);

worker.on("completed", (job) => {
  console.log(`job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`job failed: ${err}`);
});
