import { MongoClient } from "mongodb";
import { randomUUID } from "node:crypto";
import { localURL } from "../../shared/env.mjs";
import assert from "node:assert/strict";
const client = new MongoClient(
  localURL(process.env.MONGODB_URL, "mongodb://127.0.0.1:57017").href,
  { serverSelectionTimeoutMS: 2000 },
);
const name = "course_" + randomUUID().replaceAll("-", "");
try {
  await client.connect();
  const db = client.db(name);
  await db.createCollection("products", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["sku", "price"],
        properties: {
          sku: { bsonType: "string" },
          price: { bsonType: "number", minimum: 0 },
        },
      },
    },
  });
  const products = db.collection("products");
  await products.createIndex({ sku: 1 }, { unique: true });
  await products.updateOne(
    { sku: "demo-1" },
    { $setOnInsert: { price: 10 } },
    { upsert: true },
  );
  console.log(await products.findOne({ sku: "demo-1" }));
  await assert.rejects(products.insertOne({ sku: "demo-1", price: 20 }), {
    code: 11000,
  });
  console.log(
    (await products.find({ sku: "demo-1" }).explain("executionStats"))
      .executionStats,
  );
  await db.dropDatabase();
} finally {
  await client.close();
}
