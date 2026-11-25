from author import write
write('shared/lab.mjs', '''
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
export { assert, fs, join, delay };
export async function temp() {
  const path = await fs.mkdtemp(join(tmpdir(), 'node-course-'));
  return { path, async [Symbol.asyncDispose]() { await fs.rm(path, {recursive:true,force:true}); } };
}
export async function listen(server) {
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
  return `http://127.0.0.1:${server.address().port}`;
}
export async function close(server) {
  server.closeIdleConnections?.();
  await new Promise((resolve,reject) => server.close(error => error ? reject(error) : resolve()));
}
export function spawnNode(args, options={}) {
  return new Promise((resolve,reject) => {
    const child=spawn(process.execPath,args,{cwd:process.cwd(),...options,stdio:['pipe','pipe','pipe'],shell:false});
    let stdout='',stderr='';
    child.stdout.on('data',x=>stdout+=x);child.stderr.on('data',x=>stderr+=x);
    child.once('error',reject);child.once('close',(code,signal)=>resolve({code,signal,stdout,stderr}));
    child.stdin.end(options.input ?? '');
  });
}
export function result(label, value) { console.log(JSON.stringify({check:label,value},(_,x)=>typeof x==='bigint'?x.toString():x)); }
''')
write('package.json', '''{
  "name":"nodejs-practical-examples","version":"1.0.0","private":true,"type":"module",
  "engines":{"node":">=26.13.1 <27"},
  "workspaces":["lessons/*"],
  "scripts":{"lesson":"node tools/run.mjs","catalog":"node tools/run.mjs --list","validate":"node tools/validate.mjs","test":"node --test test/*.test.mjs"}
}''')
write('.node-version','26.13.1')
write('tools/run.mjs', '''
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = new URL('../',import.meta.url);
const catalog=JSON.parse(await readFile(new URL('catalog.json',root),'utf8'));
const requested=process.argv[2];
if (!requested || requested==='--list') {
  for(const item of catalog) console.log(`${String(item.number).padStart(3,'0')}  ${item.title} [${item.mode}]`);
} else {
  const item=catalog.find(x=>x.number===Number(requested));
  if(!item) {console.error('Unknown lesson number');process.exitCode=2;}
  else {
    const child=spawn(process.execPath,[...item.flags,item.entry,...item.args,...process.argv.slice(3)],{cwd:fileURLToPath(new URL(item.folder+'/',root)),stdio:'inherit',shell:false});
    child.on('error',e=>{console.error(e.message);process.exitCode=1;});
    child.on('exit',(code,signal)=>{process.exitCode=code ?? (signal?1:0);});
  }
}
''')
write('tools/validate.mjs', '''
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const items=JSON.parse(await readFile(new URL('catalog.json',root),'utf8'));
const requested=process.argv.slice(2).filter(x=>/^\\d+$/.test(x)).map(Number);
const report=[];
for(const item of items.filter(x=>!requested.length||requested.includes(x.number))) {
  if(item.mode!=='automatic') { report.push({number:item.number,status:'not-run',reason:item.mode});continue; }
  const started=performance.now();
  const record=await new Promise(resolve=>{
    const child=spawn(process.execPath,[...item.flags,item.entry,...item.args],{cwd:fileURLToPath(new URL(item.folder+'/',root)),stdio:['ignore','pipe','pipe'],shell:false});
    let stdout='',stderr='',timedOut=false;
    const timer=setTimeout(()=>{timedOut=true;child.kill();},30000);
    child.stdout.on('data',x=>{stdout+=x;if(stdout.length>500000)child.kill();});
    child.stderr.on('data',x=>stderr+=x);
    child.once('error',e=>{clearTimeout(timer);resolve({code:null,error:e.message});});
    child.once('close',(code,signal)=>{clearTimeout(timer);resolve({code,signal,stdout,stderr,timedOut});});
  });
  const status=record.code===0&&!record.timedOut?'passed':'failed';
  report.push({number:item.number,status,durationMs:Math.round(performance.now()-started),...record});
  console.log(`${String(item.number).padStart(3,'0')} ${status}`);
  await writeFile(new URL(item.folder+'/observed-output.txt',root),`Runtime: ${process.version} ${process.platform} ${process.arch}\\nStatus: ${status}\\nSTDOUT\\n${record.stdout??''}\\nSTDERR\\n${record.stderr??''}`);
}
await mkdir(new URL('validation/',root),{recursive:true});
const old=JSON.parse(await readFile(new URL('validation/report.json',root),'utf8').catch(()=>' {"lessons":[]}'));
const merged=new Map(old.lessons.map(x=>[x.number,x]));for(const row of report)merged.set(row.number,row);
await writeFile(new URL('validation/report.json',root),JSON.stringify({runtime:process.version,platform:process.platform,recordedAt:new Date().toISOString(),lessons:[...merged.values()].sort((a,b)=>a.number-b.number)},null,2));
if(report.some(x=>x.status==='failed'))process.exitCode=1;
''')