import { SuiGrpcClient } from "@mysten/sui/grpc";
import { GrpcTransport } from "@protobuf-ts/grpc-transport";
import { ChannelCredentials } from "@grpc/grpc-js";
const transport = new GrpcTransport({
  host: "sui-mainnet-grpc.gateway.tatum.io:443",
  channelCredentials: ChannelCredentials.createSsl(),
  meta: { "x-api-key": process.env.TATUM_API_KEY },
});
const client = new SuiGrpcClient({ network: "mainnet", transport });
const t0 = Date.now();
const { response } = await client.ledgerService.getServiceInfo({});
console.log({ tatum_grpc_ms: Date.now() - t0, chain: response.chain, checkpoint: String(response.checkpointHeight) });
process.exit(0);
