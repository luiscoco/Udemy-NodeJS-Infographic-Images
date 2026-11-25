import { connect } from "node:net";
try {
  const socket = connect(9, "127.0.0.1");
  socket.on("error", (error) => {
    console.error(error.code);
    process.exitCode = 1;
  });
} catch (error) {
  console.error(error.code);
  process.exitCode = 1;
}
