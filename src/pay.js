// Settle an approved payment on Sui Testnet through Tatum gRPC.
// Always simulate first; if the simulation fails, nothing is signed or sent.
import { Transaction, coinWithBalance } from "@mysten/sui/transactions";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

export const USDC = {
  testnet: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
  mainnet: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
};

export function signerFromEnv(env = process.env) {
  if (!env.DEMO_WALLET_KEY) return null;
  const { secretKey } = decodeSuiPrivateKey(env.DEMO_WALLET_KEY.trim());
  return Ed25519Keypair.fromSecretKey(secretKey);
}

export function makePayer({ client, signer, network = "testnet" }) {
  return async function pay({ amount, to, id }) {
    const sender = signer.toSuiAddress();
    const tx = new Transaction();
    tx.setSender(sender);
    tx.transferObjects([coinWithBalance({ type: USDC[network], balance: BigInt(Math.round(amount * 1e6)) })], to);
    const t0 = Date.now();
    let bytes;
    try { bytes = await tx.build({ client }); }
    catch (e) { return { network, simulated: { ok: false, ms: Date.now() - t0, error: String(e.message).slice(0, 200) }, sent: false }; }

    const sim = await client.simulateTransaction({ transaction: bytes, include: { effects: true } });
    const simOk = sim.$kind === "Transaction" || sim.Transaction?.status?.success === true;
    const simulated = { ok: simOk, ms: Date.now() - t0, error: simOk ? null : JSON.stringify(sim.FailedTransaction?.status?.error ?? sim) };
    if (!simOk) return { network, simulated, sent: false };

    const res = await client.signAndExecuteTransaction({ signer, transaction: bytes, include: { effects: true } });
    const txd = res.Transaction ?? res.FailedTransaction;
    await client.waitForTransaction({ digest: txd.digest });
    return {
      network, simulated, sent: true, request: id, digest: txd.digest,
      success: txd.status?.success === true,
      explorer: `https://suiscan.xyz/${network}/tx/${txd.digest}`,
    };
  };
}
