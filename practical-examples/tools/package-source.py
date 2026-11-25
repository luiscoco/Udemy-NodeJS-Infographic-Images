"""Create a student source archive without credentials or generated dependencies."""
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parents[1]
target = root.parent / "practical-examples-001-167.zip"
excluded_dirs = {
    "node_modules", ".npm-cache", "__pycache__", ".git", "build", "dist",
    "profiles", "reports", ".compile-cache",
}
excluded_suffixes = {".node", ".so", ".dll", ".dylib", ".obj", ".lib", ".exp", ".wasm", ".exe", ".pyc"}
secrets = []
env = root / ".env"
if env.exists():
    for line in env.read_text(encoding="utf-8").splitlines():
        if line.startswith(("DB_PASSWORD=", "JWT_KEY=")):
            value = line.split("=", 1)[1].strip().strip("\"'")
            if value:
                secrets.append(value.encode())
with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root)
        if not path.is_file() or any(part in excluded_dirs for part in relative.parts):
            continue
        if path.name in {".env", ".env.local"} or path.suffix.lower() in excluded_suffixes:
            continue
        if "lab/output" in relative.as_posix() and path.suffix == ".txt":
            continue
        data = path.read_bytes()
        assert not any(secret in data for secret in secrets), f"Credential found in {relative}"
        archive.writestr("practical-examples/" + relative.as_posix(), data)
with zipfile.ZipFile(target) as archive:
    names = set(archive.namelist())
    for number in range(1, 168):
        for name in ("demo.mjs", "README.md", "lesson-brief.txt", "observed-output.txt"):
            assert f"practical-examples/lessons/prompt-{number:03}/{name}" in names
    for name in ("index.html", "README.md", "catalog.json", "package-lock.json"):
        assert "practical-examples/" + name in names
    report = json.loads(archive.read("practical-examples/validation/report.json"))
    assert len(report["lessons"]) == 167
    assert all(item["status"] == "passed" for item in report["lessons"])
    assert archive.testzip() is None
    print(f"Packaged {len(names)} source and evidence files; 167 lesson demos passed.")
print(f"Archive: {target.name} ({target.stat().st_size:,} bytes)")
