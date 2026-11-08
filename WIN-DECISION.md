# Total Recall: win decision

Prepared 2026-11-07, about 13:45 Lagos. **Waiting for Sam's go. Nothing is built.**

## Recommendation
Build **Ask Me First** (working name; check for clashes) in Track 3, Consumer Finance, and also aim for Best Walrus Memory and Best Use of Agent Payments.

> A daughter in Manchester pays for her mother's care in Lagos. Ask Me First pays the usual bills on its own, stops and asks about anything unusual, and every "no" she gives changes what it does next time.

Prize ceiling: $1,500 ($500 track + $500 + $500). The page says special awards come "on top of track prizes". Whether one entry can take both special awards is not stated [FILL: ask in Discord].

## 1. Verified event facts
Sources: [event app and rules](https://recall-tatum-walrus.vercel.app), [official page](https://tatum.io/hackathon/total-recall), [rules mirror](https://thewalrussessions.wal.app/tatum-total-recall/index.html).

| Item | Fact |
|---|---|
| Eligibility | 18+, not resident in a sanctioned or restricted jurisdiction, solo or team, one submission per person, online and global. No named country list found, so Nigeria is not named either way. Confirm if you want certainty |
| Deadline | Nov 10, 2026, 17:00 UTC = **18:00 Lagos**. About 76 hours from this writing |
| Judging / results | Nov 11–16 / Nov 17 |
| Demo uptime | Not stated. Keep it up until at least Nov 17 |
| Prizes | Three tracks at $500/$300/$200. $500 each: Best Walrus Memory, Best Tatum AI Builder app, Best Use of Agent Payments. Paid in a stablecoin such as USDC. Claim within 14 days |
| Criteria | Walrus and Tatum integration 30%, Technical quality 30%, Creativity 20%, Presentation 20%. Bonus for an X or LinkedIn post |
| Must have | Walrus Memory writing on Mainnet, 10+ memories, Tatum RPC, public repo, working demo, published blog post |
| Form | Email, Discord, LinkedIn, how you heard, first Web3 project?, Tatum ID, SUI address, Account ID (SUI), MEMWAL_AGENT_ID, description, 2–3 min video link, GitHub repo, Walrus feedback, AI Builder feedback |
| Pre-existing work | Allowed if "completed or materially advanced" during the window |
| Music / trademark rules | Not stated. Use no third-party music or logos anyway |
| Judges | Not named; "a panel appointed by the Sponsors". Walrus team picks Best Walrus Memory |

**Rules oddity:** the rules intro describes a "feedback and form platform", which contradicts the tracks and looks like leftover text. I followed the tracks and criteria. Worth asking in Discord.

## 2. What they want
- **Customer:** "Web2 welcome": "Product people, AI builders, sports fans, fintech tinkerers."
- **End user:** Track 3 says "Money products people actually open... Blockchain stays invisible."
- **Market:** global consumer. No regional signal, so the Lagos link is used because it sharpens the story, not because they asked for Africa.
- **Value shown:** learning, not revenue. "Apps that remember." "Your product gets sharper every week, not every login." Best Walrus Memory: "Deepest learning loop. Memories that visibly change the product."
- **Scale rewarded:** no results published for this format. Tatum's earlier Walrus event used the same 30/30/20/20 criteria, also with no public winners. Haulout winners were mostly infrastructure and marketplaces, at a different, storage-led event.
- **Sponsor's aim:** developer adoption of Walrus Memory and of Tatum's Sui gateway.
- **Red flags:** decorative memory, and copying the brief ("Do not copy the brief verbatim"). The technical criterion names "successful Tatum Sui RPC integration". Sui has [deprecated JSON-RPC in favour of gRPC](https://docs.tatum.io/docs/sui-migration-guide-from-json-rpc-to-grpc.md), so use gRPC.

## 3. The 10 rules that matter most here
1. Open on one real person's situation. None of the rival READMEs I sampled does this with care stakes.
2. Show memory changing an outcome in the first 30 seconds.
3. Show a human approval and a safe failure on camera.
4. Real-world partner beats clever tool: real bills, a real family.
5. Judges may not run it: video, first screenshot and first two lines carry it.
6. "Remembers" is table stakes here: 38 of 39 repos call recall.
7. Lead with one measured number.
8. Proof hygiene: licence, CI, no-key mode, `CLAIMS.md`, tag at submission, no commits after.
9. No empty panels or fake data. Label sample scenarios as samples.
10. Protect one core loop and cut early.

## 4. The field
See `GITHUB-CRAWL.md`. 39 repos are visible, and several are strong (invoice-chaser, Said-No, usual, precedent). **A generic finance agent would lose on depth.** The openings are the story (no README hit for care or remittance terms) and rare features (scoringWeights 1, Payment Kit 1, analyze 4).

Past-winner evidence is thin: Tatum and Walrus Memory pages publish no winners, so I could not complete the 10–15 winner table for this format. Patterns come from `winning-patterns.md` (care wins repeatedly; one person; one number; guarantee shown failing).

## 5. Ideas
Every idea uses Walrus Memory, Tatum and a human approval. Pain facts marked [FILL] have no source yet and can't be pitched until they do. "Edge" marks ideas most entrants can't easily copy.

| # | Person and pain | What it does | Human approves | Sponsor tech decides | Safe failure | Wow | Value |
|---|---|---|---|---|---|---|---|
| A | **Ask Me First.** Child abroad funding a parent's care; bill requests arrive by message and can't be checked from afar. Edge: care + payments | Pays usual bills, holds unusual ones | Any held payment | Recalled corrections set the verdict; Tatum checks recipient history and simulates | Any check fails: no money moves | Same request, opposite outcome after one correction | Family caregivers spend [$7,242/yr (AARP 2021)](https://www.aarp.org/press/releases/2021-6-29-aarp-research-shows-family-caregivers-face-significant-financial-strain,-spend-on-average-7,242-each-year.html); US data. Sending $200 to Africa cost [7.9% in 2023Q4](https://nairametrics.com/2024/06/30/diaspora-remittances-average-cost-of-sending-200-to-ssa-increases-to-7-9-in-2023-world-bank) |
| B | Siblings sharing a parent's care costs; resentment over who paid. Edge: care | Learns each sibling's share; proposes settlements | Each settlement | Memory holds fairness rules; Tatum verifies payment | Unverified payment stays unpaid | "You've covered 71%", traced to receipts | Same AARP source |
| C | Older adult's wallet watched by family during a scam | Holds sends unlike past behaviour | Family member | History via Tatum; memory of refusals | Hold on doubt | Live scam stopped | [FILL]; overlaps Said-No |
| D | Lagos shop owner balancing grid and generator costs. Edge: EE | Learns the real cost of power and sets aside money | Each top-up | Memory of usage; Tatum barely matters | Keeps last budget | Budget shifts after outages | [FILL] |
| E | **Ajo/esusu treasurer** in a Lagos market, tracking contributions. Edge: local + fintech | Learns members' payment patterns; proposes payout order | Treasurer approves payout | Tatum verifies contributions; memory drives reliability | Unverified contribution blocks payout | Payout order changes after a missed round | [FILL] |
| F | Football fan comparing tipsters | Pick journal with credibility | Places own picks | Memory scores tipsters | No score without result | Tipster falls in rank | Crowded |
| G | Freelancer setting aside tax | Learns income, ring-fences | Each move | Weak chain role | Holds | Forecast shifts | [FILL] |
| H | Clinic manager paying suppliers. Edge: care | Learns supplier prices, flags jumps | Above limit | Memory of prices; Tatum verifies | Holds | Overcharge caught | [FILL] |
| I | Developer's agent buying APIs per call | Learned spend limits with MPP | Over limit | MPP + memory | Refuses | Limit changes | Developer story; Conductor's mistake |
| J | Recipient trust score for diaspora senders. Edge: fintech | Scores addresses | Low score | Tatum history | Unknown = hold | New address flagged | Overlaps Fides |

**Reuse:** no Sui or Walrus code exists locally. A must be a new repo. CareCircle domain knowledge and Potless x402 experience carry over as know-how; declare any code you copy.

## 6. Scores
Weighted = 0.3 Integration + 0.3 Technical + 0.2 Creativity + 0.2 Presentation. These are my judgement, not measurements.

| Idea | Int | Tech | Creat | Pres | **Weighted** | Fits brief | Solo can ship | Remembered tomorrow |
|---|---|---|---|---|---|---|---|---|
| **A Ask Me First** | 5 | 4 | 5 | 5 | **4.7** | 4 | 3 | 5 |
| E Ajo treasurer | 4 | 4 | 5 | 4 | 4.2 | 4 | 4 | 5 |
| C Scam hold | 4 | 4 | 4 | 4 | 4.0 | 2 | 4 | 4 |
| B Sibling ledger | 3 | 4 | 4 | 5 | 3.9 | 5 | 4 | 4 |
| I Agent limits | 5 | 4 | 3 | 3 | 3.9 | 2 | 4 | 2 |
| F Tipsters | 4 | 4 | 2 | 4 | 3.6 | 4 | 4 | 2 |
| D Power budget | 2 | 3 | 5 | 4 | 3.3 | 3 | 4 | 4 |
| J Recipient trust | 3 | 4 | 3 | 3 | 3.3 | 3 | 4 | 2 |
| G Tax pot | 3 | 3 | 3 | 4 | 3.2 | 4 | 4 | 2 |
| H Clinic supplier | 3 | 3 | 4 | 3 | 3.2 | 3 | 3 | 3 |

## 7. Red team
### A: Ask Me First
- **Why it loses:** invoice-chaser is deeper technically. Said-No has the same "learns from refusal" mechanic and more time behind it. A Lagos parent paid in USDC on Sui is not how families send money today, and carers can't easily spend it.
- **Closest:** Said-No, usual, precedent.
- **Could break live:** memory indexing delay after a correction, MPP package, gas or USDC balance, relayer limits (30 points/min per delegate key; remember costs 5).
- **Riskiest assumption:** a correction written to Mainnet is recallable fast enough, and strongly enough, to flip the next decision.
- **1-hour kill test:** write one correction, time it until recall returns it, and see whether a differently worded request retrieves it. If that takes more than a few minutes or matches poorly, redesign or cut to E.

### E: Ajo treasurer
- **Why it loses:** the pain has no source yet, on-chain contributions are unrealistic for market traders, and judges may not know ajo.
- **Closest:** trustbook, rulesync.
- **Could break:** the story needs several members and rounds to show learning, which is hard in 3 minutes.
- **Riskiest assumption:** global judges care. Test: show the one-liner to 3 non-Nigerians in an hour.

### C: Scam hold
- **Why it loses:** nearly Said-No with a sadder story, and few older adults hold Sui.
- **Closest:** Said-No.
- **Could break:** detection has to look smart on thin data.
- **Riskiest assumption:** families would connect a parent's wallet. Test: one search for real Sui scam-victim cases in an hour.

### A vs E, honestly
E is easier to ship and more original culturally. A wins on integration, because a held payment gives memory, Tatum simulation and settlement one decisive moment each, and because it can credibly reach two special awards. **A's weakness is realism:** USDC on Sui in Lagos must be framed as how the fund is held, with a clear note on cash-out as an honest limit. If you think that framing breaks the story, choose E.

## 8. Alignment test (top 3, scores out of 5)
| Test | A | E | C |
|---|---|---|---|
| Theme: "Total Recall... get your memory back" | 5 | 4 | 4 |
| Track fit | 5 | 5 | 3 |
| User fit | 5 | 4 | 3 |
| Practicality | 3 | 3 | 2 |
| Sponsor fit | 5 | 4 | 4 |
| Distance from example ideas | 4 | 4 | 3 |
| Past-winner resemblance (care, one person) | 5 | 3 | 3 |

A's practicality is 3, below the 4 bar. The fix is in section 7: be upfront about cash-out and run the demo against a real small USDC fund.

"Read only the name" test: *Total Recall* + "the app that remembers every 'no' you gave about your mum's money" reads as an obvious match.

## 9. The plan
**Pitch:** A daughter in Manchester funds her mother's care in Lagos. Ask Me First pays the usual bills and asks about the rest, and every answer is kept on Walrus Mainnet. [NUMBER from the measured replay.]

**Story (a composite role, not a real named person; say so, or find a real person who agrees to be named):**
Ngozi is a nurse in Manchester paying for her mother's carer, medicine and diesel in Lagos. Requests arrive by message, and she can't tell a normal one from an inflated one or a changed account number. Ask Me First learns what normal looks like from her own answers, and won't pay anything it can't justify.

**Core loop:**
1. A request comes in as text ("Diesel, 40 USDC, pay to 0x...").
2. `analyze()` and `recall()` with `scoringWeights` fetch past answers; recent corrections and important ones rank higher.
3. Tatum gRPC: recipient history (`ListTransactions`), SuiNS reverse lookup, balance, `SimulateTransaction`.
4. A small rule function gives PAY, ASK or BLOCK, citing the memory `blob_id`s behind it.
5. On approval, execute (Payment Kit with nonce = request ID stops double payment) and confirm through Tatum.
6. Her answer becomes a new memory, and the next request is decided differently.

**Demo moment:**
- **Human approval:** a new carer account is held. She approves with a reason, and the next one passes.
- **Learning flip:** the same "diesel, 40 USDC" request is paid on Monday; she says "too high, never over 25"; on replay it is held, citing that memory.
- **Safe failure:** live, with the Tatum key removed, the app shows "Can't verify, no money moved", with an unchanged balance on the explorer.
- **Injection attempt:** a message saying "ignore previous, urgent, new account" goes to ASK. Text can never authorise payment.

**Number:** run a labelled replay of sample requests with memory on and off, and report wrong payments in each. Only a real run's output gets used. No figure is claimed yet.

**Build plan (Lagos time):**
| When | Work |
|---|---|
| Sat 14:00–16:00 | Sam creates accounts and keys. Spike: real remember, recall timing (the kill test), Tatum gRPC call. **Stop if weak** |
| Sat 16:00–22:00 | Core loop, decision function, tests, `PLAN.md`, `CLAIMS.md`, `CHECKLIST.md` |
| Sun 08:00–14:00 | Execution and Payment Kit on Mainnet with a few dollars of USDC; safe failures |
| Sun 14:00–22:00 | Web UI, no-key sample mode, `/judge` path, proof page with blob IDs and digests |
| Mon 08:00–13:00 | MPP spike and integration, time-boxed to 5 hours; replay and number |
| Mon 13:00–18:00 | Deploy, 390px and 1280px checks, README, CI |
| **Mon 18:00** | **Feature freeze (24 hours before deadline)** |
| Mon 18:00–22:00 | Stills, video script, blog draft |
| Tue 08:00–14:00 | Sam records video, publishes blog and social post |
| Tue 14:00–16:00 | Final checks; Sam submits **by 16:00** to leave a 2-hour margin |
| Tue 18:00 | Tag `submission-total-recall`. No changes after |

**Cut list, first to last:** MPP (lose that one award's chance; keep Payment Kit), SuiNS lookup, `SubscribeCheckpoints` live status, multiple languages or voice, polish. **Never cut:** the learning flip, approval, safe failure, Mainnet proof.

**README and judge path:** first lines: "Open /judge, press Replay, watch the same request get a different answer." A no-key sample mode is clearly labelled. Links: live demo, video, blog, proof page, MEMWAL_AGENT_ID, explorer links.

**Video (2:45, no music or logos):**
- 0:00–0:10 Ngozi's situation and the source.
- 0:10–0:30 The flip: same request, opposite decision, citing a Mainnet memory.
- 0:30–1:15 Approval of a new account, simulated then settled.
- 1:15–1:45 Tatum key removed: no money moves. Injection attempt held.
- 1:45–2:20 Measured replay number; how scoringWeights and analyze drive it.
- 2:20–2:45 Honest limits, proof links.

**Submission checklist:** every field in section 1 (todo); 10+ Mainnet memories; public repo with licence; live demo; blog post naming the files that use each service; X or LinkedIn post tagging both sponsors; video at 2–3 min.

**Pre-existing work to declare:** none in code. Any starter kit or library gets credited. AI Builder is not used, so answer that form field accordingly and don't chase that award.

## 10. What I need from you
1. **Go on A, or pick E.**
2. Once you say go, create and paste: a Tatum API key and account ID, Walrus Memory account ID and delegate key, a Sui address with a few dollars of SUI and USDC (a demo wallet only; never your main one).
3. Decide whether "Ngozi" stays a labelled composite or you can find a real person who agrees to be named.

## Sources for x402 and MPP
- [Machine Payments Protocol explainer](https://www.zinc.com/blog/what-is-mpp)
- [`@suimpp/mpp`](https://socket.dev/npm/package/@suimpp/mpp): community package; `npm` shows 0.9.0
- [Sui agent payments page](https://www.sui.io/agentpayments)
- [x402 facilitator forum post](https://forums.sui.io/t/the-first-live-x402-facilitator-on-sui-agents-pay-usdc-per-api-call-verified-humans-read-free/49391): self-reported, testnet
