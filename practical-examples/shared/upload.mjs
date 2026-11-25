import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import { rm, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
export async function uploadApp(directory) {
  const app = Fastify();
  await mkdir(directory, { recursive: true });
  await app.register(multipart, {
    limits: { fileSize: 1024, files: 1, parts: 2 },
  });
  app.post("/upload", async (q, r) => {
    const part = await q.file();
    if (!part) return r.code(400).send({ error: "File required" });
    const target = join(directory, randomUUID());
    try {
      await pipeline(part.file, createWriteStream(target, { flags: "wx" }));
      if (part.file.truncated) {
        await rm(target, { force: true });
        return r.code(413).send({ error: "Too large" });
      }
      return { stored: true };
    } catch (error) {
      await rm(target, { force: true });
      throw error;
    }
  });
  return app;
}
