// Browser-only stand-in for server.mjs, used by the static (S3) build.
// Runs the same agent and decision code with the sample store. No keys, no network, no money moves.
import { makeAgent } from "../src/agent.js";
import { sampleStore } from "../src/memory.js";
import { SEED } from "../src/seed.js";
import { parseRequest } from "../src/decide.js";
import PROOF from "virtual:proof";

const store = sampleStore();
const ready = (async () => { for (const t of SEED) await store.remember(t); })();
const sampleChain = {
  ledgerService: { listTransactions: () => ({ responses: (async function* () { yield { transactions: Array(8).fill({}) }; })() }) },
  nameService: { async reverseLookupName() { throw Object.assign(new Error("not found"), { code: "NOT_FOUND" }); } },
};
const samplePay = async () => ({ network: "sample", simulated: { ok: true, ms: 0 }, sent: false, note: "Sample mode: no money moves." });
const state = { chainOn: true };
const history = [];
const agentFor = () => makeAgent({ store, chainClient: state.chainOn ? sampleChain : null, pay: samplePay, chainOffReason: "Tatum checks are switched off" });

const routes = {
  "GET /api/status": async () => ({ mode: "sample", network: "sample", payments: "sample", chainOn: state.chainOn, agentId: null, wallet: null, static: true }),
  "GET /api/history": async () => history,
  "GET /api/proof": async () => PROOF,
  "POST /api/request": async ({ text }) => {
    const r = await agentFor().handle(String(text ?? "").slice(0, 500), `req-${Date.now()}`);
    history.unshift({ at: new Date().toISOString(), kind: "decision", ...r });
    return r;
  },
  "POST /api/answer": async ({ action, request, label, words, max }) => {
    const a = agentFor();
    const req = parseRequest(request.text, request.id);
    const out = { action, memories: [] };
    if (action === "approve") {
      if (req.to) out.memories.push(await a.approvePayee(req.to, label || "approved", words || "Approved by Ngozi"));
      out.payment = state.chainOn ? await samplePay(req) : { sent: false, note: "Chain checks are off, so nothing is sent." };
      if (state.chainOn) out.memories.push(await a.recordPaid(req, words || "approved by Ngozi"));
    } else if (action === "block") out.memories.push(await a.blockPayee(req.to, label || "blocked", words || "Blocked by Ngozi"));
    else if (action === "limit") out.memories.push(await a.setLimit(req.item, Number(max), words || `Never more than ${max} USDC for ${req.item}.`));
    else throw new Error("unknown action");
    history.unshift({ at: new Date().toISOString(), kind: "answer", ...out });
    return out;
  },
  "POST /api/chain": async ({ on }) => { state.chainOn = !!on; return { chainOn: state.chainOn }; },
};

window.STATIC_API = async (path, data) => {
  await ready;
  const fn = routes[`${data ? "POST" : "GET"} ${path}`];
  if (!fn) throw new Error("not found");
  return JSON.parse(JSON.stringify(await fn(data ?? {})));
};
