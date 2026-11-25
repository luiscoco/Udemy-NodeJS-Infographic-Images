import assert from "node:assert/strict";
const original = { server: { port: 0 }, nested: { enabled: true } };
const configured = {
  ...original,
  server: {
    ...original.server,
    port: original.server.port ?? 3000,
    tls: original.server.tls ?? false,
  },
};
console.log(original, configured);
assert.equal(configured.server.port, 0);
assert.equal(original.server.tls, undefined);
const shallow = { ...original };
shallow.nested.enabled = false;
assert.equal(original.nested.enabled, false);
console.log("shallow copy shares nested object");
