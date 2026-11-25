"""Refresh lesson teaching sections from authored notes and exact source excerpts.

Run from any directory with Python 3. No lesson implementation is modified.
"""
from pathlib import Path
import json
import os
import re

ROOT = Path(__file__).resolve().parents[1]
START = "<!-- prompt-concepts:start -->"
END = "<!-- prompt-concepts:end -->"
notes = {}
for line in (ROOT / "tools/readme-notes.txt").read_text(encoding="utf-8").splitlines():
    if line.strip():
        number, concept, reasoning, exercise = line.split("|", 3)
        assert int(number) not in notes
        notes[int(number)] = (concept, reasoning, exercise)
assert sorted(notes) == list(range(1, 168))

# Paths are relative to the lesson unless prefixed with @ (course root).
# Ranges are inclusive source lines, preserved verbatim in Markdown.
selections = {
    3: [("src/add.js",), ("test/add.test.js",)],
    4: [("config.mjs",), ("demo.mjs",)],
    5: [("cli.mjs",)], 6: [("ask.mjs",)],
    7: [("demo.mjs",), ("main.mjs",), ("message.mjs",)],
    18: [("order.cjs",), ("order.mjs",)],
    19: [("pool.mjs",), ("demo.mjs",)],
    25: [("demo.mjs", 2, 19), ("demo.mjs", 33, 37)],
    32: [("demo.mjs", 9, 20), ("demo.mjs", 33, 39)],
    35: [("a.mjs",), ("b.mjs",), ("fixed-a.mjs",), ("shared.mjs",)],
    40: [("demo.mjs", 6, 17), ("demo.mjs", 23, 43)],
    53: [("demo.mjs", 7, 23)],
    54: [("@shared/ndjson.mjs", 34, 61), ("demo.mjs", 5, 9)],
    58: [("demo.mjs", 24, 28), ("demo.mjs", 29, 54)],
    60: [("@shared/core-http.mjs", 8, 28), ("demo.mjs", 6, 16)],
    63: [("demo.mjs", 65, 82)],
    65: [("demo.mjs", 3, 23), ("demo.mjs", 24, 31)],
    68: [("lifecycle.mjs",)],
    70: [("demo.mjs", 16, 23), ("demo.mjs", 39, 56)],
    71: [("worker.mjs",), ("demo.mjs",)],
    74: [("worker.mjs",), ("demo.mjs",)],
    75: [("demo.mjs", 15, 19), ("demo.mjs", 38, 58)],
    78: [("demo.mjs", 5, 32), ("demo.mjs", 34, 42)],
    81: [("@shared/upload.mjs",), ("demo.mjs", 7, 20)],
    82: [("demo.mjs", 3, 33)],
    83: [("demo.mjs", 8, 24), ("demo.mjs", 27, 42)],
    88: [("demo.mjs", 9, 20), ("demo.mjs", 22, 33)],
    90: [("demo.mjs", 25, 39)],
    94: [("demo.mjs", 17, 38)],
    95: [("@shared/outbox.mjs",)],
    96: [("config.mjs",), ("demo.mjs",)],
    97: [("@shared/passwords.mjs",)],
    98: [("demo.mjs", 6, 29), ("demo.mjs", 37, 48)],
    100: [("demo.mjs", 9, 20), ("demo.mjs", 41, 49)],
    101: [("demo.mjs", 13, 27), ("demo.mjs", 31, 48)],
    106: [("config.mjs",), ("config.test.mjs",)],
    107: [("async.test.mjs",)], 109: [("timers.test.mjs",)],
    111: [("discount.mjs",), ("complete.test.mjs",), ("demo.mjs",)],
    113: [("broken.mjs",), ("fixed.mjs",), ("discount.test.mjs",)],
    119: [("demo.mjs", 22, 39)],
    120: [("demo.mjs", 14, 33)],
    122: [("cache.mjs",), ("demo.mjs",)],
    123: [("demo.mjs", 20, 28), ("demo.mjs", 29, 48)],
    124: [("@shared/reliability.mjs", 2, 30), ("demo.mjs",)],
    125: [("@shared/reliability.mjs", 31, 49), ("demo.mjs", 14, 29)],
    126: [("@shared/reliability.mjs", 50, 70), ("demo.mjs", 14, 21)],
    128: [("native.ts",), ("demo.mjs",)],
    129: [("src/index.ts",), ("tsconfig.json",), ("demo.mjs",)],
    130: [("bad.js",), ("fixed.js",), ("demo.mjs", 6, 19)],
    131: [("native.cc",), ("demo.mjs", 13, 15)],
    133: [("cache.mjs",), ("demo.mjs",)],
    135: [("modern.mjs",), ("demo.mjs",)],
    136: [("Dockerfile",), ("demo.mjs", 16, 30)],
    137: [("@../.github/workflows/practical-examples.yml",)],
    138: [("@shared/deployment-demo.mjs", 54, 66)],
    142: [("demo.mjs", 24, 37), ("demo.mjs", 56, 74)],
    143: [("src/index.mjs",), ("demo.mjs",)],
    144: [("demo.mjs", 11, 25)],
    146: [("register.mjs",), ("demo.mjs",)],
    149: [("compare.mjs",)],
    150: [("iter.mjs",), ("classic.mjs",)],
    151: [("@applications/logtool/main.mjs", 34, 58), ("demo.mjs", 24, 39)],
    152: [("@shared/task-api.mjs", 86, 100), ("@shared/task-api.mjs", 134, 144), ("demo.mjs", 51, 61)],
    153: [("@applications/rooms/server.mjs", 67, 91), ("demo.mjs", 65, 75)],
    154: [("@shared/outbox.mjs", 15, 29), ("demo.mjs", 32, 53)],
    155: [("@shared/deployment-demo.mjs", 74, 99)],
    158: [("fetch-pool.mjs",)], 159: [("upload-client.mjs",)],
    160: [("demo.mjs",)],
    161: [("snapshot.test.mjs",), ("demo.mjs",)],
}

evidence = []

def excerpt(readme, spec):
    name, *bounds = spec
    source = (ROOT / name[1:]) if name.startswith("@") else (readme.parent / name)
    source = source.resolve()
    lines = source.read_text(encoding="utf-8").splitlines()
    start, end = bounds if bounds else (1, len(lines))
    assert 1 <= start <= end <= len(lines), (source, start, end, len(lines))
    relative = os.path.relpath(source, readme.parent).replace("\\", "/")
    language = {".ts": "typescript", ".json": "json", ".yaml": "yaml", ".yml": "yaml", ".cc": "cpp", ".c": "c", ".sql": "sql"}.get(source.suffix, "javascript")
    if source.name == "Dockerfile":
        language = "dockerfile"
    snippet = "\n".join(lines[start - 1:end])
    evidence.append({"readme": readme.relative_to(ROOT).as_posix(), "source": os.path.relpath(source, ROOT).replace("\\", "/"), "start": start, "end": end})
    return f"From [{relative}, lines {start}-{end}]({relative}#L{start}) (source excerpt; run the full application using the command above):\n\n```{language}\n{snippet}\n```\n"

for number in range(1, 168):
    readme = ROOT / f"lessons/prompt-{number:03}/README.md"
    text = readme.read_text(encoding="utf-8")
    text = re.sub(re.escape(START) + r".*?" + re.escape(END) + r"\n*", "", text, flags=re.S)
    concept, reasoning, exercise = notes[number]
    snippets = selections.get(number, [("demo.mjs",)])
    section = f"{START}\n## Prompt concepts explained with code\n\n### What this application teaches\n\n{concept}\n\n### Follow the implementation\n\n"
    section += "\n".join(excerpt(readme, spec) for spec in snippets)
    section += f"\n### Why this produces the observed result\n\n{reasoning}\n\nCompare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.\n\n### Student exercise\n\n{exercise}\n\n{END}\n\n"
    anchor = "## Walkthrough and experiments"
    assert anchor in text, readme
    text = text.replace(anchor, section + anchor, 1)
    boilerplate = "Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated."
    text = text.replace(boilerplate, "Use the student exercise above to change one input at a time. Predict the result, run the application, and explain which assertion or output confirms your prediction. Restore your experiment before running the course validation again.")
    readme.write_text(text, encoding="utf-8", newline="\n")

(ROOT / "tools/readme-excerpts.json").write_text(json.dumps(evidence, indent=2) + "\n", encoding="utf-8")
print(f"Updated 167 lesson READMEs with authored explanations and {len(evidence)} source excerpts.")
