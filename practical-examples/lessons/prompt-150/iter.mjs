import { from, pull, text } from "node:stream/iter";
const upper = (chunks) =>
  chunks === null
    ? null
    : chunks.map((c) =>
        new TextEncoder().encode(new TextDecoder().decode(c).toUpperCase()),
      );
console.log(await text(pull(from("hello, iterable streams"), upper)));
