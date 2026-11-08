Open **/judge** and click the four steps in order: about three minutes, no keys needed. Hosted (sample mode, runs in your browser): https://d2en8yo5nec3eh.cloudfront.net/judge

# Ask Me First

An agent that pays the usual bills for a family abroad, asks about anything unusual, and remembers every answer on **Walrus Mainnet**, so it never asks twice. Wallet checks go through **Tatum's Sui gRPC**; payments settle in USDC on **Sui Testnet**.

Built for Total Recall (Tatum x Walrus Memory).

## The story

Ngozi is a nurse in Manchester paying for her mother's care in Lagos. (Ngozi is a composite character.) Bisi, Mum's carer, sends requests: diesel for the generator, medicine, the occasional emergency. Ngozi can't approve every one from a hospital ward, and a flat spending cap either blocks real needs or lets scams through.

Ask Me First:

1. **Reads the request**: amount, item, Sui wallet.
2. **Recalls what Ngozi said before** from Walrus Memory: approved payees, limits, past payments.
3. **Checks the wallet on Sui** through Tatum. If it can't check, no money moves.
4. **Pays, or asks.** Normal? Paid. Unusual? One question, and her answer is saved to Walrus for every future request.

Text in a request can never approve a payment. Only Ngozi can.

## The judge path

| Step | What you do | What happens |
|---|---|---|
| 1 | Send diesel, 6 USDC | Paid: same wallet she approved, normal amount |
| | Answer "Too high", limit 5, send again | Asks, quoting her own limit back |
| 2 | Medicine from a new pharmacy | Asks: new wallet. Approve it, send again: paid |
| 3 | "URGENT, account changed", 60 USDC | Asks: urgency and a changed account can't approve a payment |
| 4 | Turn Tatum checks off, send diesel | Asks: it can't verify the wallet, so nothing is paid |

## Proof

Every number below comes from a file in [`proof/`](proof/). The **/proof** page shows them all, unedited.

- **Live judge run**, against Walrus Mainnet and Sui Testnet: 8 of 8 steps as expected. [`proof/live-judge-2026-11-08T08-11-58-207Z.json`](proof/live-judge-2026-11-08T08-11-58-207Z.json)
- **Three real Testnet USDC payments:** [`EW1LSgrA…`](https://suiscan.xyz/testnet/tx/EW1LSgrAf9nLNDDDdfoqhULJXTpNzokmPoB25KM4w6hs) (6), [`3LVa8sof…`](https://suiscan.xyz/testnet/tx/3LVa8sofHxtSdQvF7PeN6T3RkMikvEdCP4gXZxAjUbgd) (3), [`FEhuH2ef…`](https://suiscan.xyz/testnet/tx/FEhuH2efVThkaasgNXXfXpNBaXcYXxcF1C1m1RZEzjiM) (3)
- **Speed:** decisions that only read took 2.1–2.4 s. Steps that write to Walrus or pay took 32–48 s, because a Walrus write takes about 20 s.
- **Memories on Walrus Mainnet:** 15 on this account, 7 of them in the judge-run namespace. [`proof/memory-count-2026-11-08T09-33-59-205Z.json`](proof/memory-count-2026-11-08T09-33-59-205Z.json)
- **One month, replayed:** 30 requests (20 genuine, 10 scams or price creep) through four policies, using the same decision code. [`proof/replay-2026-11-08T08-31-54-409Z.json`](proof/replay-2026-11-08T08-31-54-409Z.json)

  | Policy | Wrong payments | USDC lost | Questions to Ngozi |
  |---|---|---|---|
  | **Ask Me First** | **0** | **0** | **13** |
  | Same agent, memory off | 0 | 0 | 23 |
  | Spending cap 10 | 9 | 62 | 1 |
  | Cap 10 + allowlist | 3 | 27 | 10 |

  This is a scripted, simulated month: we wrote the scenario. The cap policies model the common "auto-pay under a limit" pattern, not any named product.

## Run it

You need Node 22+.

**Sample mode** (no keys; memory and chain are simulated and labelled as such, no money moves):

```
npm install
npm run sample          # http://localhost:3000
```

**Live mode** (Walrus Mainnet memory, Tatum Sui checks, Sui Testnet payments): copy `.env.example` to `.env` and fill in your own values:

| Variable | What it is |
|---|---|
| `MEMWAL_KEY`, `MEMWAL_ACCOUNT_ID`, `MEMWAL_AGENT_ID` | Walrus Memory credentials |
| `MEMWAL_NAMESPACE` | Optional; defaults to `ask-me-first` |
| `TATUM_API_KEY` | Tatum key, for Sui gRPC |
| `DEMO_WALLET_KEY` | Sui Testnet wallet that pays (holds Testnet USDC) |
| `DEMO_CARER_ADDRESS` | Bisi's Sui address |
| `SUI_NETWORK` | Defaults to `testnet` |

```
npm run seed            # writes the two starting memories
npm start
```

**Frontend** (React, Tailwind, framer-motion, in `app/`):

```
cd app && npm install && npm run build   # the server then serves app/dist
cd app && API_PORT=3000 npm run dev      # hot reload, proxied to the server
```

**Other scripts**

- `npm test`: decision tests
- `node scripts/live-judge.mjs`: drives the 8 judge steps against a running server and saves the result to `proof/`
- `node scripts/replay.mjs`: the month replay
- `node --env-file=.env scripts/count-memories.mjs`: counts Mainnet memories (read-only)
- `node scripts/build-static.mjs`: builds the static sample-mode site into `dist/`

## How it's built

| Part | Where | Notes |
|---|---|---|
| Decision rules | `src/decide.js` | Pure function: request + memories + chain facts → PAY / ASK / BLOCK, with reasons |
| Agent | `src/agent.js` | Recall → check → decide → pay → remember. Records a payment only if it actually happened |
| Memory | `src/memory.js` | `@mysten-incubation/memwal`: `rememberAndWait`, and `recall` blending similarity with recency |
| Chain | `src/chain.js` | Tatum Sui gRPC, with a throttle |
| Payments | `src/pay.js` | `@mysten/sui`: dry-run first, then send Testnet USDC |
| Server | `server.mjs` | Small Node HTTP API plus the built frontend |
| Frontend | `app/` | Landing, demo, judge path, proof |

## Honest limits

- Payments are on **Sui Testnet**, not Mainnet. Memory is on **Walrus Mainnet**.
- The hosted site runs in **sample mode** in your browser. For live memory and payments, run it locally with keys.
- Requests are typed in, not received from WhatsApp or SMS.
- Photos are from Unsplash; credits are on the landing page.
