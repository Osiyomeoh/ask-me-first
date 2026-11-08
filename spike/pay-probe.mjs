import { makeClient } from "../src/chain.js";
import { makePayer, signerFromEnv } from "../src/pay.js";
const client = makeClient("testnet");
const pay = makePayer({ client, signer: signerFromEnv() });
const r = await pay({ amount: Number(process.argv[2] ?? 0.5), to: "0x" + "b1".repeat(32), id: "probe-1" });
console.log(JSON.stringify(r, null, 1));
process.exit(0);
