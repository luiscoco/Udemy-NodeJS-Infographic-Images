import { assert, fs, temp, join, spawnNode } from "../../shared/lab.mjs";
import { npm } from "../../shared/npm.mjs";
await using lab = await temp();
const lib = join(lab.path, "lib"),
  consumer = join(lab.path, "consumer");
await fs.mkdir(lib);
await fs.mkdir(consumer);
await fs.mkdir(join(lib, "src"));
await fs.writeFile(
  join(lib, "package.json"),
  JSON.stringify({
    name: "course-demo-lib",
    version: "1.0.0",
    type: "module",
    exports: { ".": "./src/index.js" },
    imports: { "#utils": "./src/utils.js" },
  }),
);
await fs.writeFile(join(lib, "src/utils.js"), "export const answer=42;");
await fs.writeFile(join(lib, "src/index.js"), "export {answer} from '#utils';");
let r = await npm(["pack", "--json", "--ignore-scripts"], { cwd: lib });
assert.equal(r.code, 0, r.stderr);
const tar = join(lib, JSON.parse(r.stdout)[0].filename);
await fs.writeFile(
  join(consumer, "package.json"),
  '{"private":true,"type":"module"}',
);
r = await npm(
  ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund", tar],
  { cwd: consumer },
);
assert.equal(r.code, 0, r.stderr);
await fs.writeFile(
  join(consumer, "test.mjs"),
  "import {answer} from 'course-demo-lib';console.log(answer);try{await import('course-demo-lib/src/utils.js');throw Error('must reject');}catch(e){if(e.code!=='ERR_PACKAGE_PATH_NOT_EXPORTED')throw e;console.log(e.code);}",
);
r = await spawnNode(["test.mjs"], { cwd: consumer });
console.log(r.stdout);
assert.equal(r.code, 0, r.stderr);
