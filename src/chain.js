// Tatum Sui gRPC: the facts the decision uses about a recipient.
// Native gRPC transport (Tatum's gateway answers application/grpc, not grpc-web).
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { ChannelCredentials } from "@grpc/grpc-js";
import { UnaryCall } from "@protobuf-ts/runtime-rpc";

const HOSTS = {
  mainnet: "sui-mainnet-grpc.gateway.tatum.io:443",
  testnet: "sui-testnet-grpc.gateway.tatum.io:443",
};

// Tatum free tier: 3 requests/s. Every unary call waits for a slot, and 429s
// (surfaced as UNAVAILABLE) are retried with backoff.
const GAP_MS = 360;
let nextSlot = 0;
const slot = () => { const now = Date.now(); const at = Math.max(now, nextSlot); nextSlot = at + GAP_MS; return new Promise((r) => setTimeout(r, at - now)); };
const is429 = (e) => /429|RESOURCE_EXHAUSTED/.test(`${e?.code} ${e?.message}`);

const throttle = {
  interceptUnary(next, method, input, options) {
    const run = async () => {
      for (let i = 0; ; i++) {
        await slot();
        const call = next(method, input, options);
        try {
          const [headers, response, status, trailers] = await Promise.all([call.headers, call.response, call.status, call.trailers]);
          return { headers, response, status, trailers };
        } catch (e) {
          if (i >= 4 || !is429(e)) throw e;
          await new Promise((r) => setTimeout(r, 500 * 2 ** i));
        }
      }
    };
    const p = run();
    return new UnaryCall(method, options.meta ?? {}, input, p.then((x) => x.headers), p.then((x) => x.response), p.then((x) => x.status), p.then((x) => x.trailers));
  },
};

export function makeClient(network = "mainnet", apiKey = process.env.TATUM_API_KEY) {
  if (!apiKey) throw new ChainUnavailable("No Tatum API key");
  const transport = new GrpcTransport({
    host: HOSTS[network],
    channelCredentials: ChannelCredentials.createSsl(),
    meta: { "x-api-key": apiKey },
    interceptors: [throttle],
  });
  return new SuiGrpcClient({ network, transport });
}

export class ChainUnavailable extends Error {
  constructor(msg, cause) { super(msg); this.name = "ChainUnavailable"; this.cause = cause; }
}

const withTimeout = (ms) => ({ timeout: ms });

// Free tier is 3 req/s; retry 429s (surfaced as UNAVAILABLE) with backoff.
async function retry(fn, tries = 4) {
  for (let i = 0; ; i++) {
    try { return await fn(); } catch (e) {
      if (i + 1 >= tries || !/429|UNAVAILABLE|RESOURCE_EXHAUSTED/.test(`${e?.code} ${e?.message}`)) throw e;
      await new Promise((r) => setTimeout(r, 400 * 2 ** i));
    }
  }
}

/** How many transactions have touched this address (capped), plus its SuiNS name if any. */
export async function recipientFacts(client, address, { limit = 20, timeoutMs = 8000 } = {}) {
  const started = Date.now();
  try {
    return await retry(() => recipientFactsOnce(client, address, { limit, timeoutMs, started }));
  } catch (e) {
    if (e instanceof ChainUnavailable) throw e;
    throw new ChainUnavailable(`Tatum check failed: ${e?.code ?? ""} ${e?.message ?? e}`.trim(), e);
  }
}

async function recipientFactsOnce(client, address, { limit, timeoutMs, started }) {
  {
    let txCount = 0;
    const call = client.ledgerService.listTransactions(
      {
        filter: { terms: [{ literals: [{ negated: false, predicate: { oneofKind: "affectedAddress", affectedAddress: { address } } }] }] },
        options: { limit },
        readMask: { paths: ["digest"] },
      },
      withTimeout(timeoutMs),
    );
    for await (const msg of call.responses) {
      txCount += (msg.transactions ?? []).length || (msg.transaction ? 1 : 0);
      if (txCount >= limit) break;
    }
    let name = null;
    try {
      const { response } = await client.nameService.reverseLookupName({ address }, withTimeout(timeoutMs));
      name = response.record?.name ?? null;
    } catch (e) {
      if (!/not.?found/i.test(String(e?.code ?? e?.message))) throw e;
    }
    return { address, txCount, capped: txCount >= limit, name, ms: Date.now() - started };
  }
}

export async function chainTip(client) {
  try {
    const { response } = await client.ledgerService.getServiceInfo({}, withTimeout(8000));
    return { chain: response.chain, checkpoint: String(response.checkpointHeight) };
  } catch (e) {
    throw new ChainUnavailable(`Tatum check failed: ${e?.message ?? e}`, e);
  }
}
