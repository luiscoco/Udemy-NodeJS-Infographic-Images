from pathlib import Path
import json, textwrap
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'output/nodejs-infographics'
ITEMS = {x['number']: x for x in json.loads((SOURCE/'source-prompts.json').read_text(encoding='utf-8-sig'))}
SPECS = json.loads((SOURCE/'series-state.json').read_text(encoding='utf-8-sig'))['specs']
CATALOG = {}

def write(path, text):
    target = ROOT/path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(textwrap.dedent(text).strip()+'\n', encoding='utf-8')

def add(n, code, expected, notes='', files=None, flags=None, args=None, mode='automatic', deps=None):
    folder=f'lessons/prompt-{n:03d}'
    write(folder+'/demo.mjs', code)
    for name, value in (files or {}).items(): write(folder+'/'+name, value)
    flags=flags or []; args=args or []
    item=ITEMS[n]
    manifest={'number':n,'title':item['title'],'folder':folder,'entry':'demo.mjs','flags':flags,'args':args,'mode':mode,'expected':expected,'dependencies':deps or []}
    CATALOG[str(n)]=manifest
    write(folder+'/package.json', json.dumps({'name':f'@node-course/prompt-{n:03d}','version':'1.0.0','private':True,'type':'module','scripts':{'start':'node '+ ' '.join(flags+['demo.mjs']+args)}},indent=2))
    write(folder+'/README.md', f'''# Prompt {n}: {item['title']}

{item['body']}

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- {n:03d}
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

{expected}

## Walkthrough and experiments

{notes or 'Follow the values through the implementation. Change one input, predict the result, then run again. Assertions intentionally stop the example when its contract is violated.'}

## Requirements and validation

Execution mode: **{mode}**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-{n:03d}.png)
- [Original lesson and curated constraints](lesson-brief.txt)
''')
    write(folder+'/lesson-brief.txt', item['body']+'\n\n'+SPECS.get(str(n),''))

def save():
    path=ROOT/'catalog.json'
    old=json.loads(path.read_text()) if path.exists() else []
    merged={str(x['number']):x for x in old}; merged.update(CATALOG)
    write('catalog.json',json.dumps(sorted(merged.values(),key=lambda x:x['number']),indent=2))