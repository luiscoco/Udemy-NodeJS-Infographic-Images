import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import prettier from "prettier";
import assert from "node:assert/strict";
const lint = new ESLint({
  overrideConfigFile: fileURLToPath(
    new URL("./eslint.config.mjs", import.meta.url),
  ),
});
const [bad] = await lint.lintText("const unused = 1; missingName();", {
  filePath: "fixture.mjs",
});
console.log(bad.messages.map((x) => ({ rule: x.ruleId, message: x.message })));
assert.ok(bad.errorCount >= 2);
const original = "const x={a:1};console.log(x)",
  formatted = await prettier.format(original, { parser: "babel" });
assert.equal(await prettier.check(original, { parser: "babel" }), false);
assert.equal(await prettier.check(formatted, { parser: "babel" }), true);
console.log(formatted);
