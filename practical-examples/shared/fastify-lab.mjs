export async function inspectApp(app, check) {
  try {
    await app.ready();
    await check();
    if (process.argv.includes("--serve")) {
      await app.listen({
        port: Number(process.env.PORT ?? 3000),
        host: "127.0.0.1",
      });
      console.log("Listening on", app.server.address());
      await new Promise((resolve) => {
        process.once("SIGINT", resolve);
        process.once("SIGTERM", resolve);
      });
    }
  } finally {
    await app.close();
  }
}
