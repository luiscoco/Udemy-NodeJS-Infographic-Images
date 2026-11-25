import { assert, spawnNode } from "../../shared/lab.mjs";
const r = await spawnNode(["--import", "./register.mjs", "main.mjs"]);
console.log(r.stdout, r.stderr);
assert.equal(r.code, 0, r.stderr);
assert.ok(r.stdout.includes("course-app function"));
assert.ok(r.stderr.includes("Unknown alias: @app/missing"));
