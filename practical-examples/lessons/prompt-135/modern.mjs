const data = Buffer.from("hello", "utf8");
try {
  console.log(data.toString());
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
