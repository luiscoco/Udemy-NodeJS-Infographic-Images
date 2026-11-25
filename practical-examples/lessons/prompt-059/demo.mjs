import assert from "node:assert/strict";
const url = new URL("/search", "https://example.org");
url.searchParams.append("tag", "node js");
url.searchParams.append("tag", "streams");
console.log(
  url.searchParams.getAll("tag"),
  url.href,
  new URL("../docs", "https://example.org/course/one").href,
);
assert.deepEqual(url.searchParams.getAll("tag"), ["node js", "streams"]);
assert.throws(() => new URL("not a URL"), TypeError);
