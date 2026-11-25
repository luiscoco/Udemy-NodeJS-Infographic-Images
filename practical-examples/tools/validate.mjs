import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url);
const items = JSON.parse(await readFile(new URL("catalog.json", root), "utf8"));
const requested = process.argv
  .slice(2)
  .filter((x) => /^\d+$/.test(x))
  .map(Number);
const report = [];
for (const item of items.filter(
  (x) => !requested.length || requested.includes(x.number),
)) {
  if (
    item.mode !== "automatic" &&
    !item.verificationEntry &&
    !(
      process.argv.includes("--services") &&
      /postgres|redis|mongodb/.test(item.mode)
    ) &&
    !(process.argv.includes("--native") && item.mode === "native-tooling") &&
    !(process.argv.includes("--docker") && item.mode === "docker")
  ) {
    report.push({ number: item.number, status: "not-run", reason: item.mode });
    continue;
  }
  const started = performance.now();
  const record = await new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      [...item.flags, item.verificationEntry ?? item.entry, ...item.args],
      {
        cwd: fileURLToPath(new URL(item.folder + "/", root)),
        stdio: ["ignore", "pipe", "pipe"],
        shell: false,
      },
    );
    let stdout = "",
      stderr = "",
      timedOut = false;
    const timer = setTimeout(
      () => {
        timedOut = true;
        child.kill();
      },
      item.mode.includes("docker") ? 600000 : 30000,
    );
    child.stdout.on("data", (x) => {
      stdout += x;
      if (stdout.length > 500000) child.kill();
    });
    child.stderr.on("data", (x) => (stderr += x));
    child.once("error", (e) => {
      clearTimeout(timer);
      resolve({ code: null, error: e.message });
    });
    child.once("close", (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal, stdout, stderr, timedOut });
    });
  });
  const status = record.code === 0 && !record.timedOut ? "passed" : "failed";
  report.push({
    number: item.number,
    status,
    durationMs: Math.round(performance.now() - started),
    ...record,
  });
  console.log(`${String(item.number).padStart(3, "0")} ${status}`);
  await writeFile(
    new URL(item.folder + "/observed-output.txt", root),
    `Runtime: ${process.version} ${process.platform} ${process.arch}\nStatus: ${status}\nSTDOUT\n${record.stdout ?? ""}\nSTDERR\n${record.stderr ?? ""}`,
  );
}
await mkdir(new URL("validation/", root), { recursive: true });
const old = JSON.parse(
  await readFile(new URL("validation/report.json", root), "utf8").catch(
    () => ' {"lessons":[]}',
  ),
);
const merged = new Map(old.lessons.map((x) => [x.number, x]));
for (const row of report) {
  if (row.status === "not-run" && merged.get(row.number)?.status === "passed")
    continue;
  merged.set(row.number, { ...row, recordedAt: new Date().toISOString() });
}
await writeFile(
  new URL("validation/report.json", root),
  JSON.stringify(
    {
      runtime: process.version,
      platform: process.platform,
      recordedAt: new Date().toISOString(),
      lessons: [...merged.values()].sort((a, b) => a.number - b.number),
    },
    null,
    2,
  ),
);
if (report.some((x) => x.status === "failed")) process.exitCode = 1;
