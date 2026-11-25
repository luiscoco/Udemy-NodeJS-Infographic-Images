import { parseArgs } from "node:util";
try {
  const { values } = parseArgs({
    options: { input: { type: "string" }, help: { type: "boolean" } },
  });
  if (values.help) console.log("Usage: --input NAME");
  else {
    if (!values.input) throw Error("Missing input");
    console.log(JSON.stringify({ input: values.input }));
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
