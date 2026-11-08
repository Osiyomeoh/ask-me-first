// Ask Me First web server. `npm start` (live if keys are in .env, otherwise sample mode).
import http from "node:http";
import { readFileSync, readdirSync } from "node:fs";
import { makeAgent } from "./src/agent.js";
import { storeFromEnv } from "./src/memory.js";
import { SEED } from "./src/seed.js";
import { makeClient } from "./src/chain.js";
import { makePayer, signerFromEnv } from "./src/pay.js";
import { parseRequest } from "./src/decide.js";

const NET = process.env.SUI_NETWORK || "testnet";
const store = storeFromEnv();
// Sample mode starts with the same two memories `npm run seed` writes live.
if (store.mode === "sample") for (const t of SEED) await store.remember(t);
let chainClient = null;
try { chainClient = store.mode === "live" ? makeClient(NET) : null; } catch {}
const signer = store.mode === "live" ? signerFromEnv() : null;
const realPay = chainClient && signer ? makePayer({ client: chainClient, signer, network: NET }) : null;
const samplePay = async (req) => ({ network: "sample", simulated: { ok: true, ms: 0 }, sent: false, note: "Sample mode: no money moves." });

// Sample mode uses a fake chain so the whole story runs without keys.
const sampleChain = {
  ledgerService: { listTransactions: () => ({ responses: (async function* () { yield { transactions: Array(8).fill({}) }; })() }) },
  nameService: { async reverseLookupName() { throw Object.assign(new Error("not found"), { code: "NOT_FOUND" }); } },
};
const state = { chainOn: true };
const agentFor = () => makeAgent({
  store,
  chainClient: !state.chainOn ? null : store.mode === "live" ? chainClient : sampleChain,
  pay: realPay ?? samplePay,
  chainOffReason: state.chainOn ? "no Tatum key" : "Tatum checks are switched off",
});
const history = [];

const json = (res, code, body) => { res.writeHead(code, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };
const body = (req) => new Promise((ok) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => { try { ok(JSON.parse(s || "{}")); } catch { ok({}); } }); });

const routes = {
  "GET /api/status": async () => ({ mode: store.mode, network: NET, payments: realPay ? "testnet" : "sample", chainOn: state.chainOn, agentId: process.env.MEMWAL_AGENT_ID ?? null, wallet: signer?.toSuiAddress() ?? null }),
  "GET /api/history": async () => history,
  "GET /api/proof": async () => readdirSync("proof").filter((f) => f.endsWith(".json")).map((f) => ({ file: f, data: JSON.parse(readFileSync(`proof/${f}`, "utf8")) })),
  "POST /api/request": async ({ text }) => {
    const r = await agentFor().handle(String(text ?? "").slice(0, 500), `req-${Date.now()}`);
    history.unshift({ at: new Date().toISOString(), kind: "decision", ...r });
    return r;
  },
  // Her answers. Each one is written to Walrus Memory.
  "POST /api/answer": async ({ action, request, label, words, max }) => {
    const a = agentFor();
    const req = parseRequest(request.text, request.id);
    const out = { action, memories: [] };
    if (action === "approve") {
      if (req.to) out.memories.push(await a.approvePayee(req.to, label || "approved", words || "Approved by Ngozi"));
      if (state.chainOn) out.payment = await (realPay ?? samplePay)(req);
      else out.payment = { sent: false, note: "Chain checks are off, so nothing is sent." };
      if (out.payment?.sent || out.payment?.network === "sample") out.memories.push(await a.recordPaid(req, words || "approved by Ngozi"));
    } else if (action === "block") {
      out.memories.push(await a.blockPayee(req.to, label || "blocked", words || "Blocked by Ngozi"));
    } else if (action === "limit") {
      out.memories.push(await a.setLimit(req.item, Number(max), words || `Never more than ${max} USDC for ${req.item}.`));
    } else return { error: "unknown action" };
    history.unshift({ at: new Date().toISOString(), kind: "answer", ...out });
    return out;
  },
  "POST /api/chain": async ({ on }) => { state.chainOn = !!on; return { chainOn: state.chainOn }; },
};

const pages = { "/": "web/index.html", "/judge": "web/index.html", "/proof": "web/index.html" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const key = `${req.method} ${url.pathname}`;
  try {
    if (routes[key]) return json(res, 200, await routes[key](req.method === "POST" ? await body(req) : {}));
    if (pages[url.pathname]) { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); return res.end(readFileSync(pages[url.pathname])); }
    json(res, 404, { error: "not found" });
  } catch (e) {
    console.error(e);
    json(res, 500, { error: String(e?.message ?? e).slice(0, 300) });
  }
}).listen(process.env.PORT || 3000, () => console.log(`Ask Me First on http://localhost:${process.env.PORT || 3000} (${store.mode}, payments: ${realPay ? NET : "sample"})`));
