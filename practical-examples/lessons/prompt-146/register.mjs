import { registerHooks } from "node:module";
const aliases = new Map([
  ["@app/config", new URL("./src/config.mjs", import.meta.url).href],
]);
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@app/")) {
      const url = aliases.get(specifier);
      if (!url) throw Error(`Unknown alias: ${specifier}`);
      return { url, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
