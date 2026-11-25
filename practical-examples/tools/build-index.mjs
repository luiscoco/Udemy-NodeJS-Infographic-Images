import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url),
  catalog = JSON.parse(await readFile(new URL("catalog.json", root), "utf8"));
const report = JSON.parse(
  await readFile(new URL("validation/report.json", root), "utf8").catch(
    () => ' {"lessons":[]}',
  ),
);
const native = JSON.parse(
  await readFile(new URL("validation/native-report.json", root), "utf8").catch(
    () => ' {"lessons":[]}',
  ),
);
const rows = new Map(report.lessons.map((x) => [x.number, x]));
for (const item of native.lessons) {
  if (item.status === "passed") {
    rows.set(item.number, item);
    await writeFile(
      new URL(`lessons/prompt-${item.number}/observed-output.txt`, root),
      `Runtime: ${item.runtime} ${item.platform}\nStatus: ${item.status}\nSTDOUT\n${item.stdout}\nSTDERR\n${item.stderr}`,
    );
  }
}
const escape = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
let cards = "",
  learning =
    "# Learning path — 167 practical lessons\n\nRun from practical-examples with npm run lesson -- NUMBER. Open index.html for searchable source and output.\n\n| Prompt | Lesson | Run requirement |\n|---|---|---|\n";
for (const item of catalog) {
  const number = String(item.number).padStart(3, "0"),
    record = rows.get(item.number),
    status = record?.status ?? "not-run",
    source = await readFile(
      new URL(item.folder + "/" + item.entry, root),
      "utf8",
    ),
    readme = await readFile(new URL(item.folder + "/README.md", root), "utf8"),
    intro = readme
      .split("## Run")[0]
      .replace(/^#.*\n/, "")
      .trim(),
    observed = await readFile(
      new URL(item.folder + "/observed-output.txt", root),
      "utf8",
    ).catch(() => "Not executed; follow the lesson prerequisites.");
  cards += `<article class="card" data-search="${escape(number + " " + item.title + " " + item.mode)}"><div class="badge">Prompt ${number}</div><h2>${escape(item.title)}</h2><p class="status ${status}">${status === "passed" ? "Demo checks passed" : status === "failed" ? "Needs attention" : "Interactive / prerequisite required"} · ${escape(record?.platform ?? item.mode)}</p><p>${escape(intro)}</p><h3>Run</h3><pre>npm run lesson -- ${number}</pre><h3>Expected behavior</h3><p>${escape(item.expected)}</p><p><a href="${item.folder}/README.md">Walkthrough</a> · <a href="${item.folder}/lesson-brief.txt">Full lesson concepts</a> · <a href="../output/nodejs-infographics/prompt-${number}.png">Infographic</a></p><details><summary>Application source</summary><pre>${escape(source)}</pre></details><details><summary>Observed output and validation scope</summary><pre>${escape(observed.slice(0, 14000))}</pre><a href="${item.folder}/observed-output.txt">Full captured output</a></details></article>`;
  learning += `| ${number} | [${item.title}](${item.folder}/README.md) | ${item.mode} |\n`;
}
const passed = [...rows.values()].filter((x) => x.status === "passed").length,
  failed = [...rows.values()].filter((x) => x.status === "failed").length;
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Node.js practical examples · 167 lessons</title><style>body{margin:0;background:#eef3f9;color:#14213d;font:16px/1.6 system-ui}header{padding:32px max(24px,5vw);background:#172342;color:white}h1{margin:0;font-size:clamp(25px,4vw,42px)}header a{color:#b8dcff}main{max-width:1150px;margin:auto;padding:24px}.card{background:white;margin:24px 0;padding:28px;border-radius:16px;box-shadow:0 2px 12px #1723420a}h2{margin:8px 0;font-size:25px}.badge{display:inline-block;background:#7454d8;color:white;border-radius:8px;padding:4px 12px;font-weight:700}.status{font-weight:600}.passed{color:#16724a}.failed{color:#a62532}input{box-sizing:border-box;width:100%;padding:16px;font:inherit;border:1px solid #acb9d0;border-radius:12px}pre{overflow:auto;background:#f2f5fa;border-radius:8px;padding:16px;font:14px/1.6 ui-monospace,monospace}summary{cursor:pointer;font-weight:600;padding:12px 0}a{color:#3f409d}details{border-top:1px solid #e7ebf3}h3{font-size:17px;margin-bottom:6px}</style><header><h1>Node.js practical examples</h1><p>167 numbered lessons · Node.js 26.13.1 · ${passed} recorded demo passes${failed ? " · " + failed + " failures" : ""}</p><p>Read the code, predict the result, then run the application. A pass records the finite demo; optional external exercises are described separately.</p><p><a href="README.md">Getting started</a> · <a href="applications/README.md">Five capstone applications</a> · <a href="validation/report.json">Validation evidence</a></p></header><main><input id="search" aria-label="Filter lessons" placeholder="Search by number, topic, or requirement…"><p id="count">167 lessons</p>${cards}</main><script>document.querySelector('#search').addEventListener('input',e=>{const query=e.target.value.toLowerCase();let count=0;document.querySelectorAll('.card').forEach(card=>{card.hidden=!card.dataset.search.toLowerCase().includes(query);if(!card.hidden)count++;});document.querySelector('#count').textContent=count+' lessons';});</script></html>`;
await writeFile(new URL("index.html", root), html);
await writeFile(new URL("LEARNING-PATH.md", root), learning);
report.lessons = [...rows.values()].sort((a, b) => a.number - b.number);
await writeFile(
  new URL("validation/report.json", root),
  JSON.stringify(report, null, 2),
);
console.log({ lessons: catalog.length, passed, failed });
