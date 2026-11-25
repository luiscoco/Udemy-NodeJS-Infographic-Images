let closing = false;
const timer = setInterval(() => console.log("working"), 1000);
function shutdown() {
  if (closing) return;
  closing = true;
  clearInterval(timer);
  console.log("cleaned up");
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
if (!process.argv.includes("--interactive"))
  setTimeout(() => {
    shutdown();
    shutdown();
  }, 20);
