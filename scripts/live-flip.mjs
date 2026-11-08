// Live learning flip: real Walrus Mainnet memories + real Tatum Sui gRPC checks.
// Writes proof/live-flip.json. Every number in the README comes from this file.
import { writeFileSync } from "node:fs";
import { makeAgent } from "../src/agent.js";
import { liveStore } from "../src/memory.js";
import { makeClient } from "../src/chain.js";

const NET = process.env.SUI_NETWORK || "testnet";
const BISI = (process.env.DEMO_CARER_ADDRESS || "0x" + "b1".repeat(32)).toLowerCase();
const run = `flip-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const agent = makeAgent({ store: liveStore(), chainClient: makeClient(NET) });
const steps = [];
const step = async (name, fn) => { const t0 = Date.now(); const r = await fn(); const s = { name, ms: Date.now() - t0, ...summarise(r) }; steps.push(s); console.log(JSON.stringify(s)); return r; };
const summarise = (r) => r?.decision ? { decision: r.decision, reasons: r.reasons, cited: r.cited, chain: r.chain?.ok ? r.chain.facts : { error: r.chain?.error }, wrote: r.memory?.blob_id } : { blob_id: r?.blob_id };
const waitRecall = async (id, q) => { for (let i = 0; i < 24; i++) { const hits = await agent_store.recall(q, 12); if (hits.some((h) => h.blob_id === id)) return i; await new Promise((r) => setTimeout(r, 5000)); } return -1; };
const agent_store = liveStore();

await step("Ngozi approves Bisi's wallet", () => agent.approvePayee(BISI, "Bisi (carer)", "Bisi is Mum's carer. She buys the diesel."));
const paid = await step("Earlier diesel payment on record", () => agent.recordPaid({ item: "diesel", amount: 40, to: BISI, id: `${run}-r0` }));
await waitRecall(paid.blob_id, `diesel ${BISI}`);
const r1 = await step("Monday: 'Diesel 40 USDC'", () => agent.handle(`Diesel for the generator, 40 USDC, pay to ${BISI}`, `${run}-r1`));
const rule = await step("Ngozi: 'too high, never over 25'", () => agent.setLimit("diesel", 25, "Too high. Diesel for Mum's generator is never more than 25 USDC."));
const tries = await waitRecall(rule.blob_id, `diesel limit ${BISI}`);
const r2 = await step("Same request again", () => agent.handle(`Diesel for the generator, 40 USDC, pay to ${BISI}`, `${run}-r2`));
const out = { run, network_for_chain_checks: NET, walrus: "mainnet", rule_recall_polls: tries, flipped: r1.decision === "PAY" && r2.decision === "ASK", steps };
writeFileSync(`proof/${run}.json`, JSON.stringify(out, null, 2));
console.log({ flipped: out.flipped, file: `proof/${run}.json` });
process.exit(0);
