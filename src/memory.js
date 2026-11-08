// Walrus Memory: everything Ngozi has told Ask Me First, stored as structured lines.
// Live mode writes to Walrus Mainnet through the relayer. Sample mode is an
// in-process store with the same interface, clearly labelled, for no-key demos and tests.
import { MemWal } from "@mysten-incubation/memwal";

export const NAMESPACE = process.env.MEMWAL_NAMESPACE || "ask-me-first";
const TAG = "[ask-me-first]";

// ---- record format -------------------------------------------------------
// RULE  item=<item> max=<usdc> | <her words>
// PAYEE address=<0x..> label=<who> status=approved|blocked | <her words>
// PAID  item=<item> amount=<usdc> to=<0x..> request=<id> | <note>
export function format(kind, fields, words = "") {
  const kv = Object.entries(fields).map(([k, v]) => `${k}=${String(v).replace(/\s+/g, "_")}`).join(" ");
  return `${TAG} ${kind} ${kv} | ${words}`.trim();
}

export function parse(text) {
  const m = String(text).match(/\[ask-me-first\]\s+(RULE|PAYEE|PAID)\s+([^|]*)\|?\s*(.*)$/s);
  if (!m) return null;
  const fields = {};
  for (const [, k, v] of m[2].matchAll(/(\w+)=(\S+)/g)) fields[k] = v.replace(/_/g, " ");
  return { kind: m[1], ...fields, words: m[3].trim() };
}

// ---- stores --------------------------------------------------------------
export function liveStore(env = process.env) {
  const mw = MemWal.create({
    key: env.MEMWAL_KEY,
    accountId: env.MEMWAL_ACCOUNT_ID,
    serverUrl: env.MEMWAL_SERVER_URL || "https://relayer.memory.walrus.xyz",
    namespace: NAMESPACE,
  });
  return {
    mode: "live",
    async remember(text) {
      const t0 = Date.now();
      const r = await mw.rememberAndWait(text);
      return { blob_id: r.blob_id, text, ms: Date.now() - t0 };
    },
    async recall(query, limit = 10) {
      // Recent corrections outrank old ones: blend similarity with recency.
      const r = await mw.recall({ query, limit, scoringWeights: { semantic: 1, recency: 0.5, recencyHalfLifeDays: 14 } });
      return r.results.map((x) => ({ blob_id: x.blob_id, text: x.text, distance: x.distance, created_at: x.created_at }));
    },
  };
}

export function sampleStore(seed = []) {
  const items = [];
  let n = 0;
  const add = (text) => { const m = { blob_id: `sample-${++n}`, text, created_at: new Date(Date.now() + n).toISOString() }; items.push(m); return m; };
  seed.forEach(add);
  const words = (s) => new Set(String(s).toLowerCase().match(/[a-z0-9]+/g) ?? []);
  return {
    mode: "sample",
    async remember(text) { const m = add(text); return { ...m, ms: 0 }; },
    async recall(query, limit = 10) {
      const q = words(query);
      return items
        .map((m) => { const w = words(m.text); let hit = 0; for (const x of q) if (w.has(x)) hit++; return { ...m, distance: 1 - hit / Math.max(q.size, 1) }; })
        .filter((m) => m.distance < 1)
        .sort((a, b) => a.distance - b.distance || b.created_at.localeCompare(a.created_at))
        .slice(0, limit);
    },
    all: () => [...items],
  };
}

export function storeFromEnv(env = process.env) {
  return env.MEMWAL_KEY && env.MEMWAL_ACCOUNT_ID && env.SAMPLE_MODE !== "1" ? liveStore(env) : sampleStore();
}
