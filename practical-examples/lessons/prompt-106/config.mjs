export function port(value) {
  if (!/^\d+$/.test(String(value))) throw Error("Invalid port");
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 65535) throw Error("Invalid port");
  return n;
}
