import { channel } from "node:diagnostics_channel";
import assert from "node:assert/strict";
const start = channel("course.operation.start"),
  done = channel("course.operation.done"),
  events = [];
const listener = (value) => events.push(value);
start.subscribe(listener);
done.subscribe(listener);
function operation(value) {
  if (start.hasSubscribers) start.publish({ phase: "start", value });
  try {
    return value * 2;
  } finally {
    if (done.hasSubscribers) done.publish({ phase: "done" });
  }
}
console.log(operation(3));
start.unsubscribe(listener);
done.unsubscribe(listener);
console.log(operation(4), events);
assert.equal(events.length, 2);
