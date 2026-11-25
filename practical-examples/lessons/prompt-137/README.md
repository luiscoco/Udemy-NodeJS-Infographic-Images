# Prompt 137: Continuous integration

Category: Tooling · Purpose: Check changes consistently before delivery.
Create a GitHub Actions workflow that installs from the lockfile, checks formatting, lints, and runs tests. Include appropriate OS coverage and verify an intentionally broken change fails the pipeline.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 137
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

The supplied multi-OS GitHub Actions workflow runs reproducible installation and the real validation commands.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

Continuous integration applies the same install and validation commands to each change in a clean runner. A multi-OS matrix checks assumptions that a single developer machine can hide.

### Follow the implementation

From [../../../.github/workflows/practical-examples.yml, lines 1-22](../../../.github/workflows/practical-examples.yml#L1) (source excerpt; run the full application using the command above):

```yaml
name: Practical examples
on: [push, pull_request]
jobs:
  lessons:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    defaults:
      run:
        working-directory: practical-examples
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '26.13.1'
          cache: npm
          cache-dependency-path: practical-examples/package-lock.json
      - run: npm ci
      - run: npm run check
      - run: npm test
      - run: npm run validate
```

### Why this produces the observed result

The lesson inspects the actual repository workflow and its reproducible install, source checks, tests, and finite demos. Reading the workflow locally is not evidence that a remote job has passed.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Find the working-directory setting and explain why the lockfile path must match it. Add a deliberately failing test locally to understand which CI command should reject it.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

The workflow file is also installed under the repository .github/workflows directory. A remote run only happens after a user-authorized push.

## Requirements and validation

Execution mode: **automatic**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-137.png)
- [Original lesson and curated constraints](lesson-brief.txt)
