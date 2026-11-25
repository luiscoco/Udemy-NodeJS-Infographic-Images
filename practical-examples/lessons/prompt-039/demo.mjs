import semver from "semver";
import assert from "node:assert/strict";
for (const [range, yes, no] of [
  ["1.2.3", "1.2.3", "1.2.4"],
  ["^1.2.3", "1.9.0", "2.0.0"],
  ["~1.2.3", "1.2.9", "1.3.0"],
  ["^0.2.3", "0.2.9", "0.3.0"],
]) {
  console.log(
    range,
    yes,
    semver.satisfies(yes, range),
    no,
    semver.satisfies(no, range),
  );
  assert.ok(semver.satisfies(yes, range));
  assert.ok(!semver.satisfies(no, range));
}
