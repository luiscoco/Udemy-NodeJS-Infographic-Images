process.on("message", (m) => {
  if (m.type === "double" && process.connected)
    process.send({ id: m.id, value: m.value * 2 }, () => {});
});
process.send?.({ type: "ready" }, () => {});
