from author import write
write('README.md', '''# Node.js practical examples — 167 lessons

Every numbered course prompt has an application folder under `lessons/prompt-001` through `lessons/prompt-167`. Each folder contains executable source, a lesson-specific walkthrough, expected behavior, the original brief, and a package script. The five complete capstones are also available under `applications/`.

## Start a lesson

Use **Node.js 26.13.1**, matching `.node-version`. From this folder:

```powershell
npm ci
npm run catalog
npm run lesson -- 001
npm run lesson -- 060
npm run lesson -- 076 --serve
```

`--serve` keeps supported Fastify lesson APIs running on loopback port 3000 after their finite checks. Most demos intentionally finish after showing their results. The persistent task API, rooms and background worker have their own entry points under `applications/`.

On the current Windows workspace, `./run-course.ps1 001` can use the isolated verified runtime in `../.tools` without changing the system-wide Node installation. On another machine configure Node with your version manager first. Runtime binaries and node_modules are not part of the source package.

Open **index.html** for a searchable lesson browser with source code, exact run commands, expected behavior and recorded output. [LEARNING-PATH.md](LEARNING-PATH.md) lists all lessons in order. Infographic links assume this folder remains next to the repository's existing output directory; the applications do not require the images to run.

## Database and queue lessons

```powershell
npm run setup
docker compose up -d db redis mongo
npm run lesson -- 086
npm run lesson -- 093
npm run lesson -- 152
npm run lesson -- 153
npm run lesson -- 154
```

Setup generates a git-ignored `.env` with fresh local credentials and never prints them. Services bind only to loopback ports 55432 (PostgreSQL), 56379 (Redis), and 57017 (MongoDB). Each PostgreSQL demo creates a uniquely named schema and removes only that schema. MongoDB/Redis fixtures use owned, uniquely named namespaces. These are disposable classroom services; do not point them at a production database.

Stop them with `docker compose stop db redis mongo`. Named data volumes remain. Read [applications/README.md](applications/README.md) and [deployment/README.md](deployment/README.md) for the standalone task API, room clients, worker, two-replica NGINX deployment and restore rehearsal.

## Validation

```powershell
npm run check
npm test
npm run validate
npm run validate:services
npm run validate:docker
node tools/validate-native-docker.mjs
npm run index
```

- `check` verifies 167 consecutive catalog entries and parses application sources, excluding the intentionally invalid parser fixture in Prompt 2.
- `test` checks meaningful stream boundaries, malformed/overlong records, queue overflow, cancellation and half-open recovery.
- `validate` executes finite self-checking demos with deadlines. Measurements and output are captured per lesson in `observed-output.txt` and centrally in `validation/report.json`.
- `--services` includes PostgreSQL/Redis/MongoDB and the Docker-based restore rehearsal. Docker services must already be running.
- `--docker` runs the image/deployment rehearsals and shuts their owned test deployment down afterward, preserving named volumes.
- Native Docker validation compiles and executes Node-API and FFI against the pinned Linux runtime. A Linux pass does not certify the Windows compiler/ABI; Windows students rebuild with their own toolchain.

**Passed means the finite demo actually exited successfully and its embedded checks passed.** It does not mean every optional experiment, remote GitHub Actions job, AWS SAM invocation or production rollout was executed. Prompt 7 intentionally remains an interactive watch/edit exercise. Prompt 145 runs a real WASI file reader assembled from supplied WAT; the equivalent C/WASI SDK route is supplied separately and is not mislabeled as compiled locally. All evidence and unrun prerequisites are explicit in the validation records.

## How to teach each example

1. Read its README and predict the result before running it.
2. Run the numbered demo and inspect the actual output alongside the infographic.
3. Open `demo.mjs` and its supplied fixtures; shared helpers are visible under `shared/`.
4. Follow the controlled failure case. Expected failures are caught and asserted; unhandled contract failures make the demo fail.
5. Change one input or invariant and explain the new behavior. Restore the lesson before running the validation suite again.

External frameworks, databases and build tools are identified as ecosystem/tooling dependencies. Experimental Node APIs retain their labels in the lesson briefs. Lockfiles record resolved package versions. The npm audit report is recorded under validation; advisory reachability and dependency changes require review rather than blind force-upgrades.

## Compatibility findings from executable examples

- SQLite's large-integer INSERT must enable `setReadBigInts(true)` as well as the SELECT because `run()` returns `lastInsertRowid`.
- The installed OpenTelemetry SDK 3 SimpleSpanProcessor accepts `{ exporter }`, and tests flush pending exports before inspecting them.
- BullMQ 6 requires an explicitly installed Redis backend client for connection-option construction; this workspace declares ioredis.
- Migration catch-up copies all authoritative old-column values after old writers drain, including non-null stale derived values.
- Compiler diagnostics require a nonzero exit status, not one assumed numeric code across all TypeScript/npm versions.

These practical corrections are documented here without silently rewriting the existing infographic images.
''')
write('run-course.ps1', '''param([string]$Lesson="--list", [Parameter(ValueFromRemainingArguments=$true)][string[]]$LessonArgs)
$ErrorActionPreference="Stop"
$runtime=Join-Path $PSScriptRoot "../.tools/node-v26.13.1-win-x64/node.exe"
if (-not (Test-Path -LiteralPath $runtime)) { $runtime=(Get-Command node).Source }
$version=& $runtime --version
if ($version -ne "v26.13.1") { throw "Select Node.js 26.13.1 with your version manager first." }
$previousPath=$env:PATH
Push-Location -LiteralPath $PSScriptRoot
try { $env:PATH=(Split-Path $runtime)+";"+$env:PATH; & $runtime tools/run.mjs $Lesson @LessonArgs } finally { $env:PATH=$previousPath; Pop-Location }
''')
write('run-course.sh','#!/bin/sh\nset -eu\ncd "$(dirname "$0")"\nexec node tools/run.mjs "$@"')
write('tools/build-index.mjs', '''
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),catalog=JSON.parse(await readFile(new URL('catalog.json',root),'utf8'));const report=JSON.parse(await readFile(new URL('validation/report.json',root),'utf8').catch(()=>' {"lessons":[]}'));const native=JSON.parse(await readFile(new URL('validation/native-report.json',root),'utf8').catch(()=>' {"lessons":[]}'));const rows=new Map(report.lessons.map(x=>[x.number,x]));for(const item of native.lessons){if(item.status==='passed'){rows.set(item.number,item);await writeFile(new URL(`lessons/prompt-${item.number}/observed-output.txt`,root),`Runtime: ${item.runtime} ${item.platform}\\nStatus: ${item.status}\\nSTDOUT\\n${item.stdout}\\nSTDERR\\n${item.stderr}`);}}
const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');let cards='',learning='# Learning path — 167 practical lessons\\n\\nRun from practical-examples with npm run lesson -- NUMBER. Open index.html for searchable source and output.\\n\\n| Prompt | Lesson | Run requirement |\\n|---|---|---|\\n';
for(const item of catalog){const number=String(item.number).padStart(3,'0'),record=rows.get(item.number),status=record?.status??'not-run',source=await readFile(new URL(item.folder+'/'+item.entry,root),'utf8'),readme=await readFile(new URL(item.folder+'/README.md',root),'utf8'),intro=readme.split('## Run')[0].replace(/^#.*\\n/,'').trim(),observed=await readFile(new URL(item.folder+'/observed-output.txt',root),'utf8').catch(()=>'Not executed; follow the lesson prerequisites.');cards+=`<article class="card" data-search="${escape(number+' '+item.title+' '+item.mode)}"><div class="badge">Prompt ${number}</div><h2>${escape(item.title)}</h2><p class="status ${status}">${status==='passed'?'Demo checks passed':status==='failed'?'Needs attention':'Interactive / prerequisite required'} · ${escape(record?.platform??item.mode)}</p><p>${escape(intro)}</p><h3>Run</h3><pre>npm run lesson -- ${number}</pre><h3>Expected behavior</h3><p>${escape(item.expected)}</p><p><a href="${item.folder}/README.md">Walkthrough</a> · <a href="${item.folder}/lesson-brief.txt">Full lesson concepts</a> · <a href="../output/nodejs-infographics/prompt-${number}.png">Infographic</a></p><details><summary>Application source</summary><pre>${escape(source)}</pre></details><details><summary>Observed output and validation scope</summary><pre>${escape(observed.slice(0,14000))}</pre><a href="${item.folder}/observed-output.txt">Full captured output</a></details></article>`;learning+=`| ${number} | [${item.title}](${item.folder}/README.md) | ${item.mode} |\\n`;}
const passed=[...rows.values()].filter(x=>x.status==='passed').length,failed=[...rows.values()].filter(x=>x.status==='failed').length;
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Node.js practical examples · 167 lessons</title><style>body{margin:0;background:#eef3f9;color:#14213d;font:16px/1.6 system-ui}header{padding:32px max(24px,5vw);background:#172342;color:white}h1{margin:0;font-size:clamp(25px,4vw,42px)}header a{color:#b8dcff}main{max-width:1150px;margin:auto;padding:24px}.card{background:white;margin:24px 0;padding:28px;border-radius:16px;box-shadow:0 2px 12px #1723420a}h2{margin:8px 0;font-size:25px}.badge{display:inline-block;background:#7454d8;color:white;border-radius:8px;padding:4px 12px;font-weight:700}.status{font-weight:600}.passed{color:#16724a}.failed{color:#a62532}input{box-sizing:border-box;width:100%;padding:16px;font:inherit;border:1px solid #acb9d0;border-radius:12px}pre{overflow:auto;background:#f2f5fa;border-radius:8px;padding:16px;font:14px/1.6 ui-monospace,monospace}summary{cursor:pointer;font-weight:600;padding:12px 0}a{color:#3f409d}details{border-top:1px solid #e7ebf3}h3{font-size:17px;margin-bottom:6px}</style><header><h1>Node.js practical examples</h1><p>167 numbered lessons · Node.js 26.13.1 · ${passed} recorded demo passes${failed?' · '+failed+' failures':''}</p><p>Read the code, predict the result, then run the application. A pass records the finite demo; optional external exercises are described separately.</p><p><a href="README.md">Getting started</a> · <a href="applications/README.md">Five capstone applications</a> · <a href="validation/report.json">Validation evidence</a></p></header><main><input id="search" aria-label="Filter lessons" placeholder="Search by number, topic, or requirement…"><p id="count">167 lessons</p>${cards}</main><script>document.querySelector('#search').addEventListener('input',e=>{const query=e.target.value.toLowerCase();let count=0;document.querySelectorAll('.card').forEach(card=>{card.hidden=!card.dataset.search.toLowerCase().includes(query);if(!card.hidden)count++;});document.querySelector('#count').textContent=count+' lessons';});</script></html>`;
await writeFile(new URL('index.html',root),html);await writeFile(new URL('LEARNING-PATH.md',root),learning);report.lessons=[...rows.values()].sort((a,b)=>a.number-b.number);await writeFile(new URL('validation/report.json',root),JSON.stringify(report,null,2));console.log({lessons:catalog.length,passed,failed});
''')