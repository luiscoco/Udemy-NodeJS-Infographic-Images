const cache = new Map(),
  leak = process.argv.includes("--leak");
for (let batch = 0; batch < 8; batch++) {
  for (let i = 0; i < 10000; i++) {
    const key = batch * 10000 + i;
    cache.set(key, { label: "x".repeat(100), key });
    if (!leak && cache.size > 1000) cache.delete(cache.keys().next().value);
  }
  global.gc?.();
  console.log(
    JSON.stringify({
      batch,
      size: cache.size,
      heapUsed: process.memoryUsage().heapUsed,
    }),
  );
}
