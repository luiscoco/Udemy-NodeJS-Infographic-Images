import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { localURL } from "./env.mjs";
export async function pgLab() {
  if (!process.env.DATABASE_URL)
    throw Error("Run node tools/setup.mjs and docker compose up -d db first.");
  const url = localURL(process.env.DATABASE_URL);
  const schema = "lab_" + randomUUID().replaceAll("-", "");
  const admin = new Pool({
    connectionString: url.href,
    max: 1,
    connectionTimeoutMillis: 2000,
    statement_timeout: 5000,
  });
  let pool;
  try {
    await admin.query("CREATE SCHEMA " + schema);
    pool = new Pool({
      connectionString: url.href,
      max: 5,
      connectionTimeoutMillis: 2000,
      statement_timeout: 5000,
      options: "-c search_path=" + schema,
    });
    await pool.query(
      `CREATE TABLE tasks(id BIGSERIAL PRIMARY KEY,title TEXT NOT NULL,owner_id TEXT NOT NULL DEFAULT 'user-a',version INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT now());CREATE TABLE accounts(id INTEGER PRIMARY KEY,balance INTEGER NOT NULL CHECK(balance>=0));INSERT INTO accounts VALUES(1,100),(2,50);CREATE TABLE reports(id TEXT PRIMARY KEY,owner_id TEXT,status TEXT NOT NULL,result JSONB);CREATE TABLE outbox(id TEXT PRIMARY KEY,topic TEXT NOT NULL,payload JSONB NOT NULL,published BOOLEAN NOT NULL DEFAULT false);CREATE TABLE processed_events(id TEXT PRIMARY KEY);CREATE TABLE room_events(id BIGSERIAL PRIMARY KEY,room_id TEXT NOT NULL,payload JSONB NOT NULL);CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);`,
    );
    return {
      pool,
      schema,
      async [Symbol.asyncDispose]() {
        await pool.end();
        try {
          await admin.query("DROP SCHEMA " + schema + " CASCADE");
        } finally {
          await admin.end();
        }
      },
    };
  } catch (e) {
    await pool?.end();
    await admin.end();
    throw e;
  }
}
export async function transaction(pool, work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
