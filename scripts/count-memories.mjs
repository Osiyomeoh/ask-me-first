// Read-only: counts every memory this account holds on Walrus Mainnet, per namespace.
// Usage: node --env-file=.env scripts/count-memories.mjs
import { writeFileSync } from "node:fs";
import { MemWal } from "@mysten-incubation/memwal";

const mw = MemWal.create({
  key: process.env.MEMWAL_KEY,
  accountId: process.env.MEMWAL_ACCOUNT_ID,
  serverUrl: process.env.MEMWAL_SERVER_URL || "https://relayer.memory.walrus.xyz",
});

const byNs = {}; let cursor, total = 0, pages = 0;
do {
  const page = await mw.listMemories({ cursor, limit: 500 });
  for (const m of page.memories) { byNs[m.namespace_id] = (byNs[m.namespace_id] || 0) + 1; total++; }
  cursor = page.next_cursor; pages++;
  if (!page.has_more) break;
} while (cursor);

const out = { at: new Date().toISOString(), total, pages, byNamespace: byNs };
const file = `proof/memory-count-${out.at.replace(/[:.]/g, "-")}.json`;
writeFileSync(file, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2), "\nsaved", file);
