import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_URL || "redis://127.0.0.1:6379";

const isSecure = redisUrl.startsWith("rediss://");

const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  tls: isSecure ? { rejectUnauthorized: false } : undefined,
});

redisConnection.on("connect", () => {
  console.log(` Redis connected! (Secure TLS: ${isSecure})`);
});

export default redisConnection;
