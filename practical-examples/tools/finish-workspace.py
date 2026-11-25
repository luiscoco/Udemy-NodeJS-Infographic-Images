from author import write, ROOT
import json
p=ROOT/'package.json';package=json.loads(p.read_text());package['scripts'].update({'setup':'node tools/setup.mjs','check':'node tools/check.mjs','validate:services':'node tools/validate.mjs --services','validate:docker':'node tools/validate.mjs --docker','api':'node applications/task-api/server.mjs','worker':'node applications/report-worker/main.mjs','rooms':'node applications/rooms/main.mjs','logtool':'node applications/logtool/main.mjs','index':'node tools/build-index.mjs'})
# Build-only teaching tools are not runtime dependencies of the deployed API.
for name in ['typescript','@types/node','eslint','@eslint/js','prettier','esbuild','fast-check','node-gyp','node-addon-api','semver','wabt']:
 if name in package.get('dependencies',{}):package.setdefault('devDependencies',{})[name]=package['dependencies'].pop(name)
p.write_text(json.dumps(package,indent=2)+'\n')
write('tools/setup.mjs', '''
import {randomBytes} from 'node:crypto';import {writeFile,readFile} from 'node:fs/promises';
const target=new URL('../.env',import.meta.url),password=randomBytes(24).toString('hex'),key=randomBytes(32).toString('hex');
try{await writeFile(target,`JWT_KEY=${key}\\nDB_PASSWORD=${password}\\nDATABASE_URL=postgres://course:${password}@127.0.0.1:55432/course_lab\\nREDIS_URL=redis://127.0.0.1:56379\\nMONGODB_URL=mongodb://127.0.0.1:57017\\n`,{flag:'wx',mode:0o600});console.log('Created local .env; credentials were not printed.');}catch(e){if(e.code!=='EEXIST')throw e;let text=await readFile(target,'utf8');if(!text.match(/^JWT_KEY=(.+)$/m)){text=text.replace(/^JWT_KEY=.*\\r?\\n?/m,'');await writeFile(target,text+'JWT_KEY='+key+'\\n',{mode:0o600});console.log('Added missing local JWT key; other configuration preserved.');}else console.log('Existing local configuration preserved.');}
''')
write('tools/check.mjs', '''
import {readdir,readFile} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),catalog=JSON.parse(await readFile(new URL('catalog.json',root),'utf8'));assert.equal(catalog.length,167);assert.deepEqual(catalog.map(x=>x.number),Array.from({length:167},(_,i)=>i+1));
const files=[];async function walk(relative){for(const entry of await readdir(new URL(relative,root),{withFileTypes:true})){if(['node_modules','dist','build','profiles','reports','.compile-cache','__pycache__'].includes(entry.name))continue;const path=relative+entry.name;if(entry.isDirectory())await walk(path+'/');else if(/\\.(mjs|cjs|js)$/.test(entry.name)&&path!=='lessons/prompt-002/bad.mjs')files.push(path);}}
for(const name of ['lessons/','shared/','applications/','tools/','test/'])await walk(name);
let index=0;const failures=[];await Promise.all(Array.from({length:8},async()=>{while(index<files.length){const file=files[index++];const result=await new Promise(resolve=>{const child=spawn(process.execPath,['--check',fileURLToPath(new URL(file,root))],{stdio:['ignore','pipe','pipe']});let error='';child.stderr.on('data',x=>error+=x);child.on('close',code=>resolve({code,error}));});if(result.code)failures.push({file,...result});}}));
if(failures.length){console.error(failures);process.exitCode=1;}else console.log(`Catalog: 167 consecutive lessons; syntax: ${files.length} application/source files passed. Intentional invalid parser fixture excluded.`);
''')
write('test/streams.test.mjs', '''
import test from 'node:test';import assert from 'node:assert/strict';import {Readable,Writable} from 'node:stream';import {pipeline} from 'node:stream/promises';import {NDJSON} from '../shared/ndjson.mjs';
async function run(chunks,options){let output='';const transform=new NDJSON(options);await pipeline(Readable.from(chunks),transform,new Writable({write(chunk,encoding,done){output+=chunk;done();}}));return{output,counts:transform.counts};}
test('every UTF-8 split and incomplete final line are preserved',async()=>{const text='{"level":"info","text":"café 😀"}',bytes=Buffer.from(text);for(let split=0;split<=bytes.length;split++){const result=await run([bytes.subarray(0,split),bytes.subarray(split)]);assert.equal(JSON.parse(result.output).text,'café 😀');assert.equal(result.counts.accepted,1);}});
test('empty, malformed and overlong record policies',async()=>{assert.equal((await run([])).output,'');assert.equal((await run(['bad\\n{"ok":true}'],{malformed:'count'})).counts.malformed,1);await assert.rejects(run(['bad']),SyntaxError);await assert.rejects(run(['x'.repeat(65)],{maxLength:64}),/Record too long/);});
''')
write('test/reliability.test.mjs', '''
import test from 'node:test';import assert from 'node:assert/strict';import {admission,breaker,retry} from '../shared/reliability.mjs';
test('admission rejects overflow and releases failed slots',async()=>{const gate=admission({maxActive:1,maxQueued:1});let release;const first=gate.submit(()=>new Promise(r=>release=r)),second=gate.submit(async()=>{throw Error('fixture');});const rejection=assert.rejects(second,/fixture/);await assert.rejects(gate.submit(async()=>{}),/OVERLOADED/);release();await first;await rejection;assert.equal(gate.stats().active,0);});
test('half-open breaker admits a single probe',async()=>{let now=1,release;const call=breaker(async wait=>{if(wait)return new Promise(r=>release=r);throw Error('down');},()=>now);for(let i=0;i<3;i++)await assert.rejects(call(false));now+=1001;const probe=call(true);await assert.rejects(call(true),/OPEN/);release('up');assert.equal(await probe,'up');});
test('retry never calls an operation after pre-cancellation',async()=>{const controller=new AbortController();controller.abort();let calls=0;await assert.rejects(retry(async()=>calls++,controller.signal));assert.equal(calls,0);});
''')
write('tools/format.mjs', '''
import prettier from 'prettier';import {readdir,readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);let count=0;async function walk(relative){for(const item of await readdir(new URL(relative,root),{withFileTypes:true})){if(['node_modules','.npm-cache','dist','build','profiles','reports','.compile-cache','__pycache__','validation'].includes(item.name))continue;const path=relative+item.name;if(item.isDirectory())await walk(path+'/');else if(/\\.(mjs|cjs|js|ts|json|yaml|yml|md)$/.test(item.name)&&!path.endsWith('observed-output.txt')&&path!=='lessons/prompt-002/bad.mjs'&&item.name!=='package-lock.json'){const file=new URL(path,root),source=await readFile(file,'utf8');await writeFile(file,await prettier.format(source,{filepath:file.pathname}));count++;}}}await walk('');console.log('Formatted',count,'teaching/source files.');
''')
write('lessons/prompt-131/build.ps1','$ErrorActionPreference="Stop"\nnpm exec -- node-gyp rebuild --directory $PSScriptRoot\nif ($LASTEXITCODE -ne 0) { throw "Native build failed" }')
write('lessons/prompt-131/build.sh','#!/bin/sh\nset -eu\ncd "$(dirname "$0")"\nnpm exec -- node-gyp rebuild --directory "$PWD"')
write('lessons/prompt-147/build.ps1','$ErrorActionPreference="Stop"\nPush-Location -LiteralPath $PSScriptRoot\ntry { cl /LD add.c /Fe:mylib.dll; if ($LASTEXITCODE -ne 0) { throw "Native build failed" } } finally { Pop-Location }')
write('lessons/prompt-147/build.sh','#!/bin/sh\nset -eu\ncd "$(dirname "$0")"\ncase "$(uname -s)" in Darwin) cc -dynamiclib -o mylib.dylib add.c ;; *) cc -shared -fPIC -o mylib.so add.c ;; esac')
p=ROOT/'applications/rooms/server.mjs';s=p.read_text().replace('key,namespace})','key,namespace,port=0})').replace("http.listen(0,'127.0.0.1'","http.listen(port,'127.0.0.1'");p.write_text(s)
write('applications/rooms/main.mjs', '''
import {Pool} from 'pg';import {roomServer} from './server.mjs';import {localURL} from '../../shared/env.mjs';
if(!/^[a-f0-9]{64}$/i.test(process.env.JWT_KEY??''))throw Error('Run tools/setup.mjs');const pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,options:'-c search_path=course_app',connectionTimeoutMillis:2000});const server=await roomServer({pool,redisURL:localURL(process.env.REDIS_URL,'redis://127.0.0.1:56379').href,key:Buffer.from(process.env.JWT_KEY,'hex'),namespace:'course-live-room:',port:Number(process.env.ROOM_PORT??8080)});console.log('Room server:',server.url);let stopping=false;async function stop(){if(stopping)return;stopping=true;await server.close();await pool.end();}process.once('SIGINT',stop);process.once('SIGTERM',stop);
''')
write('applications/rooms/client.mjs', '''
import WebSocket from 'ws';import {SignJWT} from 'jose';import {createInterface} from 'node:readline';import '../../shared/env.mjs';
if(!/^[a-f0-9]{64}$/i.test(process.env.JWT_KEY??''))throw Error('Local development ticket requires the lab .env');const token=await new SignJWT({sub:'local-student',rooms:['room-a']}).setProtectedHeader({alg:'HS256'}).setIssuer('https://course.example').setAudience('rooms').setExpirationTime('5m').sign(Buffer.from(process.env.JWT_KEY,'hex'));const socket=new WebSocket((process.env.ROOM_URL??'ws://127.0.0.1:8080')+'/room-a',{headers:{authorization:'Bearer '+token}}),rl=createInterface({input:process.stdin,output:process.stdout});socket.on('message',raw=>{const event=JSON.parse(raw);if(event.type==='ready')socket.send(JSON.stringify({type:'resume',after:process.argv[2]??'0'}));else console.log(event);});socket.on('error',e=>console.error(e.message));socket.on('close',()=>rl.close());rl.on('line',text=>{if(socket.readyState===1)socket.send(JSON.stringify({type:'message',text}));});rl.on('close',()=>socket.close());console.log('Type messages. The ticket is generated only for this local development lab and is never printed.');
''')
write('applications/README.md', '''# Complete practical applications

- **logtool**: bounded UTF-8/NDJSON streaming, filtering, malformed-record policy, cancellation, atomic file output and measured RSS. Run npm run logtool -- --input FILE --output FILE --malformed count.
- **task-api**: Fastify validation, real PostgreSQL users/tasks, versioned scrypt passwords, jose JWT verification, owner-scoped SQL, optimistic concurrency, transactional batches, readiness and liveness. Run npm run setup; start root Docker services; run node applications/task-api/migrate.mjs; npm run api.
- **rooms**: authenticated WebSocket upgrades, two-instance Redis fan-out after PostgreSQL persistence, replay cursors and bounded buffers. After migration and local services, npm run rooms, then node applications/rooms/client.mjs in three terminals. Set ROOM_PORT for a second server and ROOM_URL for its client. The local development client can issue its own short-lived fixture ticket because it runs on the teaching machine with the lab key; a production/browser client must obtain a ticket from an authenticated membership service and must never receive a signing key.
- **report-worker**: transactional outbox relay, BullMQ attempt/backoff budget, bounded worker concurrency and a database-enforced idempotent business effect. Run npm run worker alongside the task API. POST /reports is authenticated; GET /reports/:id exposes only the owner’s result.
- **deployment**: deployment/compose.yaml packages the API/worker with two replicas, NGINX, PostgreSQL, Redis, metrics, traces and coordinated shutdown. Prompt 155 exercises the full system. Read ../deployment/README.md.

Prompts 151–155 run assertions against these implementations rather than printing prewritten success messages. Other lesson folders show smaller, focused applications and controlled failures. These are classroom applications with explicit limitations, not a claim of production certification.
''')
# Preserve earlier service passes when an automatic-only run skips them.
p=ROOT/'tools/validate.mjs';s=p.read_text().replace("for(const row of report)merged.set(row.number,row);","for(const row of report){if(row.status==='not-run'&&merged.get(row.number)?.status==='passed')continue;merged.set(row.number,{...row,recordedAt:new Date().toISOString()});}");p.write_text(s)