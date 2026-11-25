import {
  generateKeyPairSync,
  createPublicKey,
  sign,
  verify,
} from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const pem = publicKey.export({ type: "spki", format: "pem" });
const imported = createPublicKey(pem);
const message = Buffer.from("course:v1");
const signature = sign(null, message, privateKey);

console.log(verify(null, message, imported, signature));
console.log(verify(null, Buffer.from("tampered"), imported, signature));
console.log(imported.asymmetricKeyType);
