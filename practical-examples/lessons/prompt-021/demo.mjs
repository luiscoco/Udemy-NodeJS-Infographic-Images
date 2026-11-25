import { createServer } from "node:http";
import { listen, close } from "../../shared/lab.mjs";
const timer = setInterval(() => {}, 1000);
const server = createServer((q, s) => s.end("ok"));
await listen(server);
console.log(process.getActiveResourcesInfo());
clearInterval(timer);
await close(server);
console.log("closed; natural process exit");
