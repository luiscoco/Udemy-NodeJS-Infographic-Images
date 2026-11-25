import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const run = promisify(scrypt),
  options = { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 };
export async function hashPassword(password) {
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 256
  )
    throw Error("Password length must be 8..256");
  const salt = randomBytes(16).toString("hex");
  return (
    "v1:" +
    salt +
    ":" +
    (await run(password, salt, 64, options)).toString("hex")
  );
}
export async function verifyPassword(password, stored) {
  if (
    typeof password !== "string" ||
    password.length > 256 ||
    !/^v1:[0-9a-f]{32}:[0-9a-f]{128}$/.test(stored)
  )
    return false;
  const [, salt, hex] = stored.split(":");
  return timingSafeEqual(
    await run(password, salt, 64, options),
    Buffer.from(hex, "hex"),
  );
}
