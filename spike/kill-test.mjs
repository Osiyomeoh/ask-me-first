// Kill test: can a correction written to Mainnet be recalled quickly, from differently worded text?
import { MemWal } from "@mysten-incubation/memwal";
const { MEMWAL_KEY: key, MEMWAL_ACCOUNT_ID: accountId, TATUM_API_KEY: tatum } = process.env;
if (!key || !accountId || !tatum) { console.error("Missing keys in .env"); process.exit(1); }
const namespace = `spike-${Date.now()}`;
const m = MemWal.create({ key, accountId, serverUrl: "https://relayer.memory.walrus.xyz", namespace });
const t0 = Date.now();
const saved = await m.rememberAndWait("Correction from Ngozi: diesel for the Lagos house should never cost more than 25 USDC; 40 was too high.");
console.log("write_ms", Date.now() - t0, "blob_id", saved.blob_id);
const start = Date.now(); let hit, tries = 0;
while (Date.now() - start < 300000 && !hit) {
  tries++;
  const r = await m.recall({ query: "Request to pay 38 USDC for generator fuel at Mum's home", limit: 3 });
  hit = r.results.find((x) => x.blob_id === saved.blob_id);
  if (!hit) await new Promise((s) => setTimeout(s, 5000));
}
console.log(hit ? { recall_after_write_ms: Date.now() - start, tries, distance: hit.distance } : "KILL: not recalled within 5 minutes");
const res = await fetch("https://sui-mainnet.gateway.tatum.io", { method: "POST",
  headers: { "content-type": "application/json", "x-api-key": tatum },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "sui_getLatestCheckpointSequenceNumber", params: [] }) });
console.log("tatum_status", res.status, "checkpoint", (await res.json()).result);
