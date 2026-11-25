# Prompt 65: TCP framing

Category: Node.js core · Purpose: Build protocols that do not confuse chunks with messages.
Implement a length-prefixed TCP client and server using node:net. Test fragmented and combined writes, reject oversized frames, and verify message reconstruction independently of received chunk boundaries.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 065
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Every split point and a real fragmented TCP exchange produce two complete application frames.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

TCP transports ordered bytes, not application messages. One write may arrive in several chunks, and several writes may arrive together.

### Follow the implementation

From [demo.mjs, lines 3-23](demo.mjs#L3) (source excerpt; run the full application using the command above):

```javascript
function frame(text) {
  const payload = Buffer.from(text),
    out = Buffer.alloc(4 + payload.length);
  out.writeUInt32BE(payload.length);
  payload.copy(out, 4);
  return out;
}
function parser(onMessage) {
  let pending = Buffer.alloc(0);
  return (chunk) => {
    if (pending.length + chunk.length > 131080) throw Error("Buffer budget");
    pending = Buffer.concat([pending, chunk]);
    while (pending.length >= 4) {
      const n = pending.readUInt32BE();
      if (n > 65536) throw Error("Frame too large");
      if (pending.length < n + 4) return;
      onMessage(pending.subarray(4, 4 + n).toString());
      pending = pending.subarray(4 + n);
    }
  };
}
```

From [demo.mjs, lines 24-31](demo.mjs#L24) (source excerpt; run the full application using the command above):

```javascript
const input = Buffer.concat([frame("one"), frame("two")]);
for (let i = 0; i <= input.length; i++) {
  const values = [],
    push = parser((x) => values.push(x));
  push(input.subarray(0, i));
  push(input.subarray(i));
  assert.deepEqual(values, ["one", "two"]);
}
```

### Why this produces the observed result

The length-prefixed parser retains incomplete bytes until a whole frame is available and can decode multiple frames from one buffer. Testing split points checks framing independently of the network's chunk choices.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Combine two encoded frames into one input chunk, then split a header across chunks. Both inputs should yield the same messages; explain which parser state makes that possible.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-065.png)
- [Original lesson and curated constraints](lesson-brief.txt)
