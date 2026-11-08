// Start a fresh live demo: writes the seed memories into a new namespace on Walrus Mainnet.
// Usage: MEMWAL_NAMESPACE=demo-<date> npm run seed   (then start the server with the same namespace)
import { liveStore, NAMESPACE } from "../src/memory.js";
import { SEED } from "../src/seed.js";
const s = liveStore();
for (const t of SEED) { const m = await s.remember(t); console.log(NAMESPACE, m.blob_id, `${m.ms} ms`); }
process.exit(0);
