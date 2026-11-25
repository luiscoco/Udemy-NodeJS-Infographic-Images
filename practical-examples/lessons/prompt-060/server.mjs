import { buildServer } from "../../shared/core-http.mjs";
const server = buildServer();
server.listen(3000, "127.0.0.1", () => console.log("http://127.0.0.1:3000"));
process.on("SIGINT", () => server.close());
