# Ask Me First: build plan

Deadline Nov 10, 17:00 UTC (18:00 Lagos). Sam submits by **Tue 16:00 Lagos**. Feature freeze **Mon 18:00 Lagos**.

## Decisions
- **Money:** no cash available. Walrus Memory and Tatum checks run on **Mainnet** at $0. Approved payments settle on **Sui Testnet** (faucet funds), labelled as Testnet everywhere. [FILL: ask in Discord whether the Agent Payments award accepts Testnet settlement.]
- **Tatum:** native gRPC (`@grpc/grpc-js` + `@protobuf-ts/grpc-transport`). JSON-RPC on the gateway returns 404, and grpc-web is rejected (`application/grpc`).
- **Ngozi** is a labelled composite, not a real person.

## Layout
| File | Job |
|---|---|
| `src/memory.js` | Walrus Memory store (live) and a labelled sample store; record format RULE / PAYEE / PAID |
| `src/chain.js` | Tatum Sui gRPC: `ListTransactions` (affected address), SuiNS `reverseLookupName`, retry on 429 |
| `src/decide.js` | Pure PAY / ASK / BLOCK rule with cited `blob_id`s; text can never authorise |
| `src/agent.js` | The loop; her answers become memories |
| `scripts/live-flip.mjs` | Live proof run, writes `proof/*.json` |
| `test/` | `npm test` |

## Order of work
1. ~~Kill test~~ (passed Nov 7)
2. ~~Core loop, decision, tests, live flip~~ (Nov 7)
3. Testnet payment: Sam's demo wallet, faucet, build transfer, `SimulateTransaction` then execute via Tatum; Payment Kit nonce = request ID if available on Testnet [check]
4. Web UI: inbox of requests, decision card with cited memories and her-words, approve / block / set limit; `/judge` replay; sample mode banner; proof page
5. Replay number: labelled request set, memory on vs off, count wrong payments (only from a real run)
6. MPP spike, time-boxed 5 h, first on the cut list
7. Deploy, README, CI, 390px and 1280px checks
8. Freeze, video script, blog draft

## Cut list (first to last)
MPP, SuiNS, live checkpoint status, voice, polish. **Never cut:** learning flip, approval, safe failure, Mainnet memory proof.
