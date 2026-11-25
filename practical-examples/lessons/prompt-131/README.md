# Prompt 131: Native addons with Node-API

Category: Node.js core · Purpose: Integrate native code through a supported addon interface.
Build a minimal native addon using node-addon-api and node-gyp. State the required compiler and Python setup, validate arguments, and verify the addon loads and returns correct results on the target platform.

## Run

From `practical-examples`, install the workspace once with `npm ci`, then run:

```powershell
npm run lesson -- 131
```

Open `demo.mjs` beside this file. Every imported shared helper is supplied in `../../shared/`.

## What students should observe

After native compilation, the addon returns 42 and rejects a nonnumeric argument.

<!-- prompt-concepts:start -->
## Prompt concepts explained with code

### What this application teaches

A Node-API addon exposes compiled native functions to JavaScript. The C++ wrapper validates arguments before converting them and returns a JavaScript Number through the addon API.

### Follow the implementation

From [native.cc, lines 1-4](native.cc#L1) (source excerpt; run the full application using the command above):

```cpp
#include <napi.h>
Napi::Value Twice(const Napi::CallbackInfo& info){Napi::Env env=info.Env();if(info.Length()!=1||!info[0].IsNumber()){Napi::TypeError::New(env,"Expected one number").ThrowAsJavaScriptException();return env.Undefined();}return Napi::Number::New(env,info[0].As<Napi::Number>().DoubleValue()*2);}
Napi::Object Init(Napi::Env env,Napi::Object exports){exports.Set("twice",Napi::Function::New(env,Twice));return exports;}
NODE_API_MODULE(addon,Init)
```

From [demo.mjs, lines 13-15](demo.mjs#L13) (source excerpt; run the full application using the command above):

```javascript
console.log(addon.twice(21));
assert.equal(addon.twice(21), 42);
assert.throws(() => addon.twice("21"), TypeError);
```

### Why this produces the observed result

Loading the `.node` artifact requires a compatible local build and platform toolchain. The demo verifies the numeric result and a TypeError for invalid input; the recorded native pass is Linux Docker evidence.

Compare the behavior described above with [the captured run](observed-output.txt). That file records one validation run; timing, generated paths, ports, and identifiers can differ on your machine. Read the assertions in [demo.mjs](demo.mjs) to see which outcomes the demo actually checks.

### Student exercise

Inspect the native wrapper's type check and call it with a string. Explain why the JavaScript-facing validation is still necessary even though C++ itself has numeric types.

<!-- prompt-concepts:end -->

## Walkthrough and experiments

Windows requires Visual Studio C++ Build Tools and Python; macOS requires Xcode CLI tools; Linux requires make and a supported compiler. Node-API ABI stability does not remove OS/architecture constraints.

## Requirements and validation

Execution mode: **native-tooling**. The catalog and `validation/report.json` distinguish actually executed examples from examples requiring services or native tooling. Expected output above is a teaching target, not an execution claim. Measurements, ports, process IDs, timestamps and generated identifiers vary.

## Lesson references

- [Infographic](../../../output/nodejs-infographics/prompt-131.png)
- [Original lesson and curated constraints](lesson-brief.txt)
