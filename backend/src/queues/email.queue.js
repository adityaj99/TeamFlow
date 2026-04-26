import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export default emailQueue;
