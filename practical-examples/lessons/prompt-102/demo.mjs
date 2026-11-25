import assert from "node:assert/strict";
const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  ),
  nonce = crypto.getRandomValues(new Uint8Array(12)),
  aad = new TextEncoder().encode("record:v1"),
  plain = new TextEncoder().encode("hello");
const options = { name: "AES-GCM", iv: nonce, additionalData: aad };
const encrypted = await crypto.subtle.encrypt(options, key, plain);
console.log(
  new TextDecoder().decode(
    await crypto.subtle.decrypt(options, key, encrypted),
  ),
);
const changed = new Uint8Array(encrypted.slice(0));
changed[0] ^= 1;
await assert.rejects(crypto.subtle.decrypt(options, key, changed));
console.log("tampered ciphertext rejected");
