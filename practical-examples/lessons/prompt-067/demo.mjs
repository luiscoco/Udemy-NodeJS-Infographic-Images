import { lookup, resolve4, resolve6 } from "node:dns/promises";
console.log("OS localhost lookup:", await lookup("localhost", { all: true }));
if (process.argv.includes("--network"))
  for (const [name, resolve] of [
    ["A", resolve4],
    ["AAAA", resolve6],
  ]) {
    try {
      console.log(name, await resolve("example.org"));
    } catch (e) {
      console.log(e.code);
    }
  }
else
  console.log(
    "Use --network for live DNS record queries; addresses depend on your resolver.",
  );
