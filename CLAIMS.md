# Claims and their sources

Every number or claim used in the README, blog, video or form must appear here with the run or page it comes from.

| Claim | Value | Source |
|---|---|---|
| A correction written to Walrus Mainnet is recallable by differently worded text | Found on first poll, 1.7–2.5 s after write; distance 0.474 | `spike/kill-test.log` (Nov 7) |
| Walrus Mainnet write time (`rememberAndWait`) | 17.4–20.7 s | `spike/kill-test.log`, `proof/flip-2026-11-07T18-01-51-331Z.json` |
| Tatum Sui gRPC reachable on Mainnet | 559 ms, checkpoint 342711811 | `spike/kill-test.log` |
| Same request flips PAY → ASK after one correction, live | PAY then ASK, citing blob `BdkatBh9…YQq8` | `proof/flip-2026-11-07T18-01-51-331Z.json` |
| Full judge path live (fresh Mainnet namespace `demo-1108-0908`, Tatum Mainnet gRPC checks, Testnet USDC): 8/8 steps as expected | PAY → limit 5 → ASK → new pharmacy ASK → approve + pay → PAY → injection ASK → checks off ASK "No money moved" | `proof/live-judge-2026-11-08T08-11-58-207Z.json` |
| Real Testnet USDC payments made by the agent | 6 USDC `EW1LSgrA…w6hs`, 3 USDC `3LVa8sof…Ubgd`, 3 USDC `FEhuH2ef…zjiM` | same file |
| Request time, live | Decisions with no write: 2.1–2.4 s; with a payment and Walrus write: 32–48 s | same file |
| Replay, 30 scripted requests (20 good, 10 bad), simulated with the same decision code | Ask Me First: 0 wrong payments, 13 questions. Memory off: 0 wrong, 23 questions. Auto-pay under 10 cap: 9 wrong (62 USDC), 1 question. Cap + approved list: 3 wrong (27 USDC), 10 questions | `proof/replay-2026-11-08T08-31-54-409Z.json`, `scripts/replay.mjs`. We wrote the script, so say so; the cap policies model the common pattern, not a named product |
| Number of Mainnet memories written | 15 in total on 8 Nov 2026 (7 in the judge-run namespace `demo-1108-0908`: 2 seeds + 5 written in the run) | `proof/memory-count-2026-11-08T09-33-59-205Z.json`, from `scripts/count-memories.mjs` (`listMemories`) |

## Honest limits (say these)
- Payments settle on Sui **Testnet**; memory and checks are Mainnet.
- A parent in Lagos holding USDC on Sui is not how most families send money today; cash-out is out of scope.
- Request parsing is rule-based, not an LLM: it only understands amount, wallet and a fixed set of items.
- Ngozi is a composite character.
