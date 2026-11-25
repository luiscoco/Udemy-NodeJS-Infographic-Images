# Prompt 15: Dates, locales, and time zones

Category: JavaScript · Purpose: Present time and numeric values consistently across locales.
Format the same timestamp and currency amount using Intl for Spain and the United States. Specify time zones explicitly and verify examples around a daylight-saving transition without relying on the machine’s default locale.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 015
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

Madrid jumps from 01:30 to 03:30. Currency formatting depends on locale/ICU; it does not convert currency.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A Date represents an instant; a time zone determines how that instant is displayed. The two UTC instants span Madrid's daylight-saving transition, so local clock labels skip an hour.

### Follow the implementation

From [demo.mjs, lines 1-20](demo.mjs#L1) (source excerpt; run the full application using the command above):

```javascript
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
```

### Why this produces the observed result

`Intl.DateTimeFormat` selects an explicit zone, and `Intl.NumberFormat` selects locale-specific currency formatting. Formatting an amount as USD does not perform an exchange-rate conversion.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Display the same two instants in UTC and Europe/Madrid. Keep the numeric amount unchanged while switching currency formats, and explain why its economic value was not converted.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-015.png)
- [Original lesson and curated constraints](lesson-brief.txt)
