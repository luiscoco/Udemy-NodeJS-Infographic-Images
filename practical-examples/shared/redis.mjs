import { createClient } from "redis";
import { randomUUID } from "node:crypto";
import { localURL } from "./env.mjs";
export function redisConnection() {
  const url = localURL(process.env.REDIS_URL, "redis://127.0.0.1:56379");
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    password: url.password ? decodeURIComponent(url.password) : undefined,
    maxRetriesPerRequest: null,
  };
}
export async function redisLab() {
  const url = localURL(process.env.REDIS_URL, "redis://127.0.0.1:56379");
  const client = createClient({
    url: url.href,
    socket: { connectTimeout: 2000, reconnectStrategy: false },
  });
  client.on("error", () => {});
  await client.connect();
  const prefix = "course:" + randomUUID() + ":";
  return {
    client,
    prefix,
    async [Symbol.asyncDispose]() {
      if (client.isOpen) {
        const keys = await client.keys(prefix + "*");
        if (keys.length) await client.del(keys);
        await client.quit();
      }
    },
  };
}
