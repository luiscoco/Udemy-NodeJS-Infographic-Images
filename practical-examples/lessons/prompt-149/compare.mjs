import { bench, suite } from "node:bench";
const parts = Array.from({ length: 1000 }, (_, i) => `item${i}`),
  expected = parts.join(",");
suite("join strings", () => {
  bench("Array.join", { samples: 30, warmup: 10 }, (b) => {
    b.start();
    const result = parts.join(",");
    b.end(1);
    if (result !== expected) throw Error("join mismatch");
  });
  bench("concatenation loop", { samples: 30, warmup: 10 }, (b) => {
    b.start();
    let result = parts[0];
    for (let i = 1; i < parts.length; i++) result += `,${parts[i]}`;
    b.end(1);
    if (result !== expected) throw Error("loop mismatch");
  });
});
