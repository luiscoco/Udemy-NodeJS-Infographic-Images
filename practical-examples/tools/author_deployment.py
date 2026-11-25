from author import write
write('applications/task-api/schema.sql', '''
CREATE SCHEMA IF NOT EXISTS course_app;
SET search_path=course_app;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tasks(id BIGSERIAL PRIMARY KEY,title TEXT NOT NULL,owner_id TEXT NOT NULL REFERENCES users(id),version INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY,owner_id TEXT NOT NULL,status TEXT NOT NULL,result JSONB);
CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,topic TEXT NOT NULL,payload JSONB NOT NULL,published BOOLEAN NOT NULL DEFAULT false);
CREATE TABLE IF NOT EXISTS processed_events(id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS room_events(id BIGSERIAL PRIMARY KEY,room_id TEXT NOT NULL,payload JSONB NOT NULL);
''')
write('applications/task-api/migrate.mjs', '''
import {Pool} from 'pg';import {readFile} from 'node:fs/promises';import '../../shared/env.mjs';
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:1,connectionTimeoutMillis:5000});try{await pool.query(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));console.log('Additive course schema ready.');}finally{await pool.end();}
''')
write('applications/task-api/instrumentation.mjs', '''
import {NodeSDK} from '@opentelemetry/sdk-node';import {ConsoleSpanExporter} from '@opentelemetry/sdk-trace';
export const sdk=new NodeSDK({traceExporter:new ConsoleSpanExporter()});await sdk.start();
''')
write('applications/task-api/server.mjs', '''
import {Pool} from 'pg';import {randomUUID} from 'node:crypto';import {Registry,Counter,Histogram} from 'prom-client';import {trace,context,propagation} from '@opentelemetry/api';import {buildTaskApi} from '../../shared/task-api.mjs';import {createReport} from '../../shared/outbox.mjs';import {sdk} from './instrumentation.mjs';import '../../shared/env.mjs';
if(!/^[a-f0-9]{64}$/i.test(process.env.JWT_KEY??''))throw Error('Run tools/setup.mjs to configure JWT_KEY');
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:10,options:'-c search_path=course_app',connectionTimeoutMillis:2000,statement_timeout:3000});
const app=await buildTaskApi({pool,key:Buffer.from(process.env.JWT_KEY,'hex'),logger:true}),registry=new Registry(),requests=new Counter({name:'course_http_requests_total',help:'Requests',labelNames:['route','status'],registers:[registry]}),duration=new Histogram({name:'course_http_duration_seconds',help:'Request duration',labelNames:['route'],registers:[registry]});
app.addHook('onRequest',async req=>{req.courseSpan=trace.getTracer('course-api').startSpan('http.request');req.courseStarted=performance.now();});
app.addHook('onResponse',async(req,reply)=>{const route=req.routeOptions.url??'unmatched';requests.inc({route,status:String(reply.statusCode)});duration.observe({route},(performance.now()-req.courseStarted)/1000);req.log.info({traceId:req.courseSpan.spanContext().traceId,route,status:reply.statusCode},'request complete');req.courseSpan.end();});
app.get('/instance',async()=>({instance:process.env.HOSTNAME??String(process.pid)}));app.get('/metrics',async(q,r)=>r.type(registry.contentType).send(await registry.metrics()));
app.post('/reports',{preHandler:app.authenticate},async(q,r)=>{const requestId=q.headers['idempotency-key']??randomUUID();if(!/^[a-zA-Z0-9_-]{1,80}$/.test(requestId))return r.code(400).send({error:'Invalid idempotency key'});const id=q.user.sub+'-'+requestId;await createReport(pool,id,q.user.sub);return r.code(202).send({id});});
app.get('/reports/:id',{preHandler:app.authenticate},async(q,r)=>{const row=(await pool.query('SELECT id,status,result FROM reports WHERE id=$1 AND owner_id=$2',[q.params.id,q.user.sub])).rows[0];return row??r.code(404).send({error:'Not found'});});
await app.listen({port:Number(process.env.PORT??3000),host:process.env.HOST??'0.0.0.0'});let stopping=false;async function shutdown(signal){if(stopping)return;stopping=true;app.courseState.stopping=true;app.log.info({signal},'shutting down');const deadline=setTimeout(()=>process.exit(1),10000);deadline.unref();try{await app.close();await pool.end();await sdk.shutdown();clearTimeout(deadline);}catch{process.exitCode=1;}}
process.once('SIGTERM',shutdown);process.once('SIGINT',shutdown);
''')
write('applications/report-worker/main.mjs', '''
import {Pool} from 'pg';import {Queue,Worker} from 'bullmq';import {publishResult} from '../../shared/outbox.mjs';import {redisConnection} from '../../shared/redis.mjs';import {sdk} from '../task-api/instrumentation.mjs';
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,options:'-c search_path=course_app',connectionTimeoutMillis:2000,statement_timeout:3000});const connection=redisConnection();const queue=new Queue('reports',{connection:{...connection,maxRetriesPerRequest:1,enableOfflineQueue:false}});const worker=new Worker('reports',async job=>{if(process.env.FAIL_FIRST_ATTEMPT==='1'&&job.attemptsMade===0)throw Error('Controlled transient failure');return publishResult(pool,job.data.eventId,job.data.reportId);},{connection,concurrency:2});worker.on('error',()=>console.error('Worker connection unavailable'));let stopping=false,timer,polling;
async function relay(){const client=await pool.connect();try{await client.query('BEGIN');const rows=(await client.query('SELECT * FROM outbox WHERE published=false ORDER BY id LIMIT 10 FOR UPDATE SKIP LOCKED')).rows;for(const event of rows){await queue.add('generate',{eventId:event.id,...event.payload},{jobId:event.id,attempts:3,backoff:{type:'exponential',delay:1000}});await client.query('UPDATE outbox SET published=true WHERE id=$1',[event.id]);}await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}
function schedule(){if(stopping)return;polling=relay().catch(()=>console.error('Outbox relay will retry')).finally(()=>{if(!stopping)timer=setTimeout(schedule,250);});}schedule();
async function shutdown(){if(stopping)return;stopping=true;clearTimeout(timer);const deadline=setTimeout(()=>process.exit(1),10000);deadline.unref();try{await polling;await worker.close();await queue.close();await pool.end();await sdk.shutdown();clearTimeout(deadline);}catch{process.exitCode=1;}}
process.once('SIGTERM',shutdown);process.once('SIGINT',shutdown);
''')
write('deployment/Dockerfile', '''
FROM node:26.13.1-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY lessons ./lessons
RUN npm ci --omit=dev
FROM node:26.13.1-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node shared ./shared
COPY --chown=node:node applications ./applications
USER node
EXPOSE 3000
CMD ["node","applications/task-api/server.mjs"]
''')
write('.dockerignore','node_modules\n.npm-cache\n.env\nvalidation\nlessons/**/observed-output.txt\nlessons/**/profiles\nlessons/**/dist\ntools/__pycache__')
write('deployment/compose.yaml', '''
name: node-course-deployment
x-app: &app
  build:
    context: ..
    dockerfile: deployment/Dockerfile
  image: node-course-application:local
  environment: &env
    DATABASE_URL: postgres://course:${DB_PASSWORD:?Run setup}@db:5432/course_lab
    REDIS_URL: redis://redis:6379
    JWT_KEY: ${JWT_KEY:?Run setup}
  stop_grace_period: 20s
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: course
      POSTGRES_DB: course_lab
      POSTGRES_PASSWORD: ${DB_PASSWORD:?Run setup}
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U course -d course_lab"]
      interval: 2s
      timeout: 3s
      retries: 30
  redis:
    image: redis:7
    command: ["redis-server", "--appendonly", "yes"]
    volumes: ["redisdata:/data"]
  migrate:
    <<: *app
    command: ["node", "applications/task-api/migrate.mjs"]
    depends_on:
      db:
        condition: service_healthy
  api1:
    <<: *app
    depends_on:
      migrate:
        condition: service_completed_successfully
  api2:
    <<: *app
    depends_on:
      migrate:
        condition: service_completed_successfully
  worker:
    <<: *app
    command: ["node", "applications/report-worker/main.mjs"]
    depends_on:
      migrate:
        condition: service_completed_successfully
      redis:
        condition: service_started
  nginx:
    image: nginx:stable
    ports: ["127.0.0.1:58080:80"]
    volumes: ["./nginx.conf:/etc/nginx/conf.d/default.conf:ro"]
    depends_on: [api1, api2]
volumes:
  pgdata:
  redisdata:
''')
write('deployment/nginx.conf', '''
upstream course_api { server api1:3000; server api2:3000; }
server { listen 80; location / { proxy_pass http://course_api; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; } }
''')
write('deployment/prometheus.yml','scrape_configs:\n  - job_name: course-api\n    static_configs:\n      - targets: ["api1:3000", "api2:3000"]')
write('shared/deployment-demo.mjs', '''
import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';import {randomUUID} from 'node:crypto';import assert from 'node:assert/strict';import './env.mjs';
export async function deploymentDemo(mode){const env=fileURLToPath(new URL('../.env',import.meta.url)),compose=fileURLToPath(new URL('../deployment/compose.yaml',import.meta.url));const docker=args=>execFileSync('docker',['compose','--env-file',env,'-f',compose,...args],{encoding:'utf8',maxBuffer:20*1024*1024});const base='http://127.0.0.1:58080';async function ready(){for(let i=0;i<120;i++){try{const r=await fetch(base+'/ready');await r.body?.cancel();if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,500));}throw Error('Deployment readiness deadline');}let started=false;try{docker(['up','-d','--build']);started=true;await ready();const credentials={email:randomUUID()+'@course.invalid',password:'public-fixture-password'};let response=await fetch(base+'/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(credentials)});assert.equal(response.status,201);await response.body?.cancel();response=await fetch(base+'/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(credentials)});assert.equal(response.status,200);const headers={authorization:'Bearer '+(await response.json()).token,'content-type':'application/json'};response=await fetch(base+'/tasks',{method:'POST',headers,body:JSON.stringify({title:'persistent Compose task'})});assert.equal(response.status,201);const task=await response.json();docker(['up','-d','--force-recreate','--no-deps','api1']);await ready();response=await fetch(base+'/tasks/'+task.id,{headers});assert.equal(response.status,200);assert.equal((await response.json()).title,'persistent Compose task');console.log('task survived API container replacement');const instances=new Set();for(let i=0;i<20;i++){const r=await fetch(base+'/instance');if(r.ok)instances.add((await r.json()).instance);else await r.body?.cancel();}console.log('Observed replica identities:',[...instances]);if(mode==='full'){response=await fetch(base+'/reports',{method:'POST',headers});assert.equal(response.status,202);const report=await response.json();let completed=false;for(let i=0;i<100;i++){const r=await fetch(base+'/reports/'+report.id,{headers}),body=await r.json();if(body.status==='complete'){completed=true;assert.equal(body.result.total,42);break;}await new Promise(r=>setTimeout(r,200));}assert.ok(completed,'worker must publish result');const metrics=await(await fetch(base+'/metrics')).text();assert.ok(metrics.includes('course_http_requests_total'));console.log('BullMQ report completed; Prometheus metrics exposed; trace IDs are in API JSON logs.');}}finally{if(started)docker(['down','--remove-orphans']);}}
''')
# Add trusted auth decorator for the standalone report routes.
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'shared/task-api.mjs';s=p.read_text();s=s.replace("const titleBody=", "app.decorate('authenticate',auth);\n const titleBody=");p.write_text(s)
# Extend setup without ever printing generated secrets.
p=Path(__file__).resolve().parents[1]/'tools/setup.mjs';s=p.read_text();s=s.replace("const password=randomBytes", "const jwtKey=randomBytes(32).toString('hex');const password=randomBytes");s=s.replace('DB_PASSWORD=${password}', 'JWT_KEY=${jwtKey}\\nDB_PASSWORD=${password}');p.write_text(s)
write('deployment/README.md', '''# Local deployment rehearsal

From practical-examples:

```powershell
node tools/setup.mjs
docker compose --env-file .env -f deployment/compose.yaml up -d --build
```

The API is at http://127.0.0.1:58080. Register using POST /register with email/password, login using POST /login, then send the returned Bearer token to /tasks and /reports. POST /reports returns 202 and a report ID; GET /reports/:id eventually returns complete with a result. No real account credentials are needed. This is a local teaching deployment.

Two API replicas each cap their pg pool at 10, the worker caps its pool at 5, and the one-shot migrator uses 1. Allocate at least those connections plus administrative headroom; this is configuration arithmetic, not a measurement. NGINX does not provide a strict alternating-response contract.

Readiness requires PostgreSQL and becomes 503 while stopping. Redis availability is required for worker delivery but the API can persist requests into its transactional outbox while Redis is unavailable. Rehearse a dependency outage with docker compose --env-file .env -f deployment/compose.yaml stop db and restore it with up -d db. Liveness and readiness have separate meanings.

Stop with docker compose --env-file .env -f deployment/compose.yaml down. Named data volumes remain. Do not use down -v unless intentionally deleting this isolated classroom database. API replacement uses up -d --force-recreate --no-deps api1.

/metrics exposes low-cardinality route/status metrics. prometheus.yml scrapes each replica separately instead of treating NGINX as one process. JSON request logs carry the same traceId exported by the OpenTelemetry console exporter. For a production collector, configure a compatible OTLP exporter and deployment-specific authentication; no external endpoint is silently enabled.

Shutdown stops admission, drains HTTP/jobs, closes pg/Redis, then flushes telemetry with a 10-second deadline below the 20-second Compose grace period. Repeat POST /reports with the same Idempotency-Key to demonstrate per-owner idempotency. Failed jobs remain visible for inspection. The worker is bounded at concurrency 2; one-shot retries have an explicit attempt budget.

Before a patch upgrade run the complete lesson tests on the new runtime, rebuild the immutable image, canary it and retain the previous artifact. Roll back application code while keeping additive database changes until the rollback window closes. Prompt 142 supplies an actual separate-database backup/restore rehearsal; record your own restore time and recovery target.
''')