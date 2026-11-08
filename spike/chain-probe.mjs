import { makeClient, recipientFacts, chainTip } from "../src/chain.js";
const main = makeClient("mainnet");
// 0x...dee9 is DeepBook-adjacent? use the Sui framework system address 0x5 and a random fresh one
const fresh = "0x" + "ab".repeat(32);
for (const a of ["0x0000000000000000000000000000000000000000000000000000000000000005", fresh]) {
  try { console.log(await recipientFacts(main, a)); } catch (e) { console.log("ERR", a.slice(0,8), e.message); }
}
try { console.log("testnet", await chainTip(makeClient("testnet"))); } catch (e) { console.log("testnet ERR", e.message); }
process.exit(0);
