import { parseArgs } from "node:util";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { rename, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NDJSON } from "../../shared/ndjson.mjs";
const controller = new AbortController();
process.once("SIGINT", () => controller.abort(Error("Interrupted")));
let partial;
try {
  const { values } = parseArgs({
    options: {
      input: { type: "string" },
      output: { type: "string" },
      level: { type: "string", default: "info" },
      malformed: { type: "string", default: "fail" },
      "max-length": { type: "string", default: "4096" },
    },
  });
  const levels = { debug: 0, info: 1, warn: 2, error: 3 },
    maxLength = Number(values["max-length"]);
  if (
    !(values.level in levels) ||
    !["fail", "skip", "count"].includes(values.malformed) ||
    !Number.isInteger(maxLength) ||
    maxLength < 1 ||
    maxLength > 1000000
  ) {
    process.exitCode = 2;
    throw Error(
      "Usage: --input FILE --output FILE --level info --malformed fail|skip|count --max-length 4096",
    );
  }
  const transform = new NDJSON({
    maxLength,
    malformed: values.malformed,
    filter: (row) =>
      typeof row === "object" &&
      row !== null &&
      (levels[row.level] ?? -1) >= levels[values.level],
  });
  const input = values.input ? createReadStream(values.input) : process.stdin;
  let output = process.stdout;
  if (values.output) {
    partial = values.output + "." + randomUUID() + ".tmp";
    output = createWriteStream(partial, { flags: "wx" });
  }
  await pipeline(input, transform, output, { signal: controller.signal });
  if (values.output) {
    await rename(partial, values.output);
    partial = undefined;
  }
  const summary = JSON.stringify({
    ...transform.counts,
    peakRssKiB: process.resourceUsage().maxRSS,
  });
  if (values.output) console.log(summary);
  else console.error(summary);
} catch (error) {
  if (partial) await rm(partial, { force: true });
  console.error(
    controller.signal.aborted
      ? "Interrupted; incomplete output removed"
      : error.message,
  );
  process.exitCode = controller.signal.aborted ? 130 : process.exitCode || 1;
}
