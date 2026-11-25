from author import add,save,write,SOURCE
import json
jobs=json.loads((SOURCE/'additional-prompts-156-167.json').read_text(encoding='utf-8-sig'))
for job in jobs:
 n=job['number'];files=job['files'];first=next(iter(files))
 if n in (156,157,162,163,164,165,166,167):
  add(n,files[first],job['expected'] or 'Actual hardware/resource values are measured; policy inputs remain explicit.',job['teaching'],files={k:v for k,v in files.items() if k!=first})
 elif n==158:
  client=files[first].replace("'http://127.0.0.1:3000/health'","(process.env.HEALTH_URL??'http://127.0.0.1:3000/health')")
  add(n,'''import {createServer} from 'node:http';import {assert,listen,close,spawnNode} from '../../shared/lab.mjs';const server=createServer((q,s)=>s.end('ok')),base=await listen(server);try{const r=await spawnNode(['fetch-pool.mjs'],{env:{...process.env,HEALTH_URL:base+'/health'}});console.log(r.stdout);assert.equal(r.code,0,r.stderr);assert.deepEqual(r.stdout.trim().split('\\n'),['ok','ok']);}finally{await close(server);}''','An actual local fixture supplies two responses to native fetch through a bounded Undici dispatcher; owned connections are closed.',job['teaching'],files={'fetch-pool.mjs':client},deps=['undici'])
 elif n==159:
  client=files[first].replace("'http://127.0.0.1:3000/upload'","(process.env.UPLOAD_URL??'http://127.0.0.1:3000/upload')")
  add(n,'''import {uploadApp} from '../../shared/upload.mjs';import {assert,temp,spawnNode} from '../../shared/lab.mjs';await using lab=await temp();const app=await uploadApp(lab.path);try{await app.listen({port:0,host:'127.0.0.1'});const r=await spawnNode(['upload-client.mjs'],{env:{...process.env,UPLOAD_URL:'http://127.0.0.1:'+app.server.address().port+'/upload'}});console.log(r.stdout);assert.equal(r.code,0,r.stderr);assert.deepEqual(r.stdout.trim().split('\\n'),['true','200']);}finally{await app.close();}''','The actual multipart server accepts the generated File; automatic boundary detection is true and the response is 200.',job['teaching'],files={'upload-client.mjs':client},deps=['fastify','@fastify/multipart'])
 elif n==160:
  add(n,'''import {assert,spawnNode,fs} from '../../shared/lab.mjs';for(const shard of ['1/2','2/2']){const r=await spawnNode(['--test','--test-shard='+shard,'a.test.mjs','b.test.mjs']);console.log(shard,r.stdout);assert.equal(r.code,0,r.stderr);}const junit=await spawnNode(['--test','--test-concurrency=2','--test-reporter=junit','--test-reporter-destination=results.xml','a.test.mjs','b.test.mjs']);assert.equal(junit.code,0,junit.stderr);assert.ok((await fs.readFile('./results.xml','utf8')).includes('<testsuites'));console.log('JUnit artifact written; both shards passed');''','The two real test files execute in separate CI shards and a JUnit artifact is generated.',job['teaching'],files=files)
 elif n==161:
  add(n,'''import {assert,spawnNode} from '../../shared/lab.mjs';for(const args of [['--test','--test-update-snapshots','snapshot.test.mjs'],['--test','snapshot.test.mjs']]){const r=await spawnNode(args);console.log(r.stdout);assert.equal(r.code,0,r.stderr);}''','The snapshot is actually generated and then compared in a separate normal test run.',job['teaching'],files=files)
save()