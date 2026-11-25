const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Madrid",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
console.log(
  ["2026-03-29T00:30:00Z", "2026-03-29T01:30:00Z"].map((t) =>
    fmt.format(new Date(t)),
  ),
);
for (const [locale, currency] of [
  ["es-ES", "EUR"],
  ["en-US", "USD"],
])
  console.log(
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(
      1234.5,
    ),
  );
