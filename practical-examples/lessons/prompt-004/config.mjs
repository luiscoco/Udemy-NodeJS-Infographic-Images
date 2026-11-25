const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("Invalid PORT");
const d = process.env.DEBUG ?? "false";
if (!["true", "false"].includes(d) || !process.env.API_KEY?.trim())
  throw Error("Invalid configuration");
console.log({ port, debug: d === "true" });
