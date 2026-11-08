import { makeClient } from "../src/chain.js";
const c = makeClient("testnet");
const owner = process.argv[2];
const { response } = await c.stateService.listBalances({ owner });
for (const b of response.balances) console.log(b.coinType, String(b.balance));
process.exit(0);
