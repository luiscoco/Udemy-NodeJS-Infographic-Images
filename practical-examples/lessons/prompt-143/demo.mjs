import { handler } from "./src/index.mjs";
import { assert, spawnNode } from "../../shared/lab.mjs";
const first = await handler({ name: "course" }),
  warm = await handler({ name: "course" });
console.log({ first, warm });
assert.equal(first.invocations, 1);
assert.equal(warm.invocations, 2);
const fresh = await spawnNode([
  "--input-type=module",
  "--eval",
  "import {handler} from './src/index.mjs';console.log(JSON.stringify(await handler({name:'course'})));",
]);
assert.equal(JSON.parse(fresh.stdout).invocations, 1);
console.log("fresh process counter=1; same environment counter=2");
