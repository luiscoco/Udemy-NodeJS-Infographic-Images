# Next run (prepared 2026-11-25)

State file: `series-state.json`. Backup of the previous version: `series-state.backup-2026-11-25.json`.
`specs` now covers prompts 2–155. 138 was rewritten and 143–155 were added; the readable copy is `specs-draft-138-155.txt`.

## 1. Reload the store
- seriesStyle = series-state.json `style`
- seriesRefs = series-state.json `refs`
- curatedSpecs = series-state.json `specs`
- seriesCompleted = series-state.json `completed` (1–137)
- nodeItems = source-prompts.json

## 2. Generate new images
Run generate(n) for n = 138, 143, 144, … 155 and for 139–142, one at a time.
That is 138–155: 18 images.

## 3. Re-correct existing images
Edit the existing PNG, using the image plus the `-correction-2.txt` note:
- 025: broken demo.mjs syntax, and a stale duplicate panel
- 093: garbled redelivery line and wrong attempts wording
- 050: `debunce` typo
- 083: curly or degree-sign quotes in res.write; "(req close)"

Optional cosmetic fixes: 053 ("esccessful"), and 019 (uses 'fixture' instead of 'password').

## 4. Check each image before marking it done
- Commands are single lines, with no PowerShell backslash continuations.
- Code matches the spec character for character: quotes, commas, spelling.
- Outputs are labeled illustrative; measurements are placeholders.
- Footer sources are real URLs. The logo is clear of the title.
- Any new deviation from the docx goes in compatibility-notes.txt.
