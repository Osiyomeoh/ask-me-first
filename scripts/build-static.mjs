// Builds dist/: the judge page plus a browser bundle that runs the agent in sample mode.
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
const proof = readdirSync("proof").filter((f) => f.endsWith(".json")).map((f) => ({ file: f, data: JSON.parse(readFileSync(`proof/${f}`, "utf8")) }));

await build({
  entryPoints: ["web/static-api.js"], bundle: true, format: "iife", minify: true, outfile: "dist/static-api.js",
  define: { "process.env": "{}" },
  plugins: [{
    name: "browser-stubs",
    setup(b) {
      b.onResolve({ filter: /^virtual:proof$/ }, () => ({ path: "proof", namespace: "v" }));
      b.onLoad({ filter: /.*/, namespace: "v" }, () => ({ contents: JSON.stringify(proof), loader: "json" }));
      // The browser build never talks to Tatum or Walrus; stub the node-only modules.
      b.onResolve({ filter: /^\.\/chain\.js$|^@mysten-incubation\/memwal$/ }, (a) => ({ path: a.path, namespace: "stub" }));
      b.onLoad({ filter: /.*/, namespace: "stub" }, (a) => ({
        contents: a.path === "./chain.js"
          ? `export async function recipientFacts(client, address) { const t0 = Date.now(); let txCount = 0; const call = client.ledgerService.listTransactions(); for await (const r of call.responses) txCount += r.transactions.length; return { address, txCount, capped: false, name: null, ms: Date.now() - t0 }; }`
          : `export const MemWal = { create() { throw new Error("live memory is not available in the static build"); } };`,
        loader: "js",
      }));
    },
  }],
});

// The React app (app/) loads /static-api.js itself when built with VITE_STATIC=1.
execSync("npx vite build --outDir ../dist --emptyOutDir false", { cwd: "app", stdio: "inherit", env: { ...process.env, VITE_STATIC: "1" } });
const html = readFileSync("dist/index.html", "utf8");
for (const p of ["app", "judge", "proof"]) {
  mkdirSync(`dist/${p}`, { recursive: true });
  writeFileSync(`dist/${p}/index.html`, html);
}
console.log("built dist/ (static, sample mode)");
