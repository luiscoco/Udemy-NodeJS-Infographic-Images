import { createInterface } from "node:readline/promises";
if (process.argv.includes("--yes")) console.log("Confirmed");
else if (!process.stdin.isTTY) {
  console.error("Noninteractive: use --yes");
  process.exitCode = 1;
} else {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const abort = new AbortController();
  rl.on("SIGINT", () => abort.abort());
  try {
    console.log(
      /^y(es)?$/i.test(
        await rl.question("Continue? [y/N] ", { signal: abort.signal }),
      )
        ? "Confirmed"
        : "Cancelled",
    );
  } catch (e) {
    if (e.name !== "AbortError") throw e;
    console.log("Cancelled");
  } finally {
    rl.close();
  }
}
