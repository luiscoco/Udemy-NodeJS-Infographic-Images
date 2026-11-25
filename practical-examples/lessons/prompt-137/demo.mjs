import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const workflow = await readFile(
  new URL("../../../.github/workflows/practical-examples.yml", import.meta.url),
  "utf8",
);
console.log(workflow);
for (const command of [
  "npm ci",
  "npm run check",
  "npm test",
  "npm run validate",
])
  assert.ok(workflow.includes(command));
console.log(
  "Workflow is supplied; remote CI execution is not implied by local inspection.",
);
