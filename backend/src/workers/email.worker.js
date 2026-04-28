import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import { sendEmail } from "../utils/email.js";

// console.log("Email worker started");

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { to, subject, html } = job.data;

    await sendEmail({ to, subject, html });

    // console.log(`Email successfully sent to ${to}`);
  },
  { connection: redisConnection },
);

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
