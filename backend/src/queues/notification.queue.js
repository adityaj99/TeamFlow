import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

// const notificationQueue = new Queue("notificationQueue", {
//   connection: redisConnection,
// });

const notificationQueue = {
  add: async () => {
    console.log("Queue disabled");
  },
};

export default notificationQueue;
