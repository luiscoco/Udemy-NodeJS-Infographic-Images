import { readFile } from "node:fs";
setTimeout(() => console.log("outer timeout"), 0);
setImmediate(() => console.log("outer immediate"));
readFile(new URL(import.meta.url), () => {
  setTimeout(() => console.log("I/O timeout"), 0);
  setImmediate(() => console.log("I/O immediate"));
});
