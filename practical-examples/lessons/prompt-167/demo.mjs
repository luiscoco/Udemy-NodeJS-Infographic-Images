import { zstdCompress, zstdDecompress } from "node:zlib";
import { promisify } from "node:util";

const compress = promisify(zstdCompress);
const decompress = promisify(zstdDecompress);
const original = Buffer.from("Node.js\n".repeat(100));
const packed = await compress(original);
const restored = await decompress(packed, { maxOutputLength: 1_024 });
console.log(restored.equals(original));

try {
  await decompress(packed, { maxOutputLength: 32 });
  throw new Error("Expected the size limit to reject");
} catch (error) {
  if (error.code !== "ERR_BUFFER_TOO_LARGE") throw error;
  console.log("limit rejected");
}
