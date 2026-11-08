# Total Recall submission form: answers (Sam fills and submits)

Form: https://tatum.io/hackathon/total-recall, then "Submit Project". Deadline Nov 10, 17:00 UTC.

## 01 Contact
- Email: yours
- Discord handle: yours
- LinkedIn: yours
- Telegram ID (optional): yours
- How did you hear about this event: your choice
- First Web3 project: No

## 02 Accounts (from your dashboards; I don't handle these)
- Tatum ID: dashboard.tatum.io > My Account > My Account Info
- SUI address: [FILL] your own address, probably where prizes are paid. Not the demo wallet.
- Account ID (SUI): memory.walrus.xyz/dashboard, after your first delegate key
- MEMWAL_AGENT_ID: from your `.env`

## 03 Project

**Project description**

Ask Me First is an agent that pays a family's usual bills, asks about anything unusual, and remembers every answer on Walrus Memory (Mainnet), so it never asks the same question twice.

Ngozi (a composite character), a nurse in Manchester, pays for her mother's care in Lagos. The carer, Bisi, sends requests. For each one the agent recalls Ngozi's past answers from Walrus Memory, checks the wallet on Sui through Tatum's Sui gRPC, then pays in Sui Testnet USDC or asks her one question. Her answer is saved to Walrus and used for every later request. If Tatum's check can't run, no money moves, and text in a request can never approve a payment.

Results, all in proof/ in the repo: a live judge run on Walrus Mainnet and Sui Testnet passed 8 of 8 steps with three real Testnet USDC payments, and there are 15 memories on Walrus Mainnet. In a 30-request month I scripted, Ask Me First made 0 wrong payments and asked 13 questions. The same agent with memory off asked 23, and a spending cap of 10 made 9 wrong payments.

Live demo (sample mode): https://d2en8yo5nec3eh.cloudfront.net/judge

- Short demo video: https://youtu.be/Z_zV-chYXuE
- GitHub repo: https://github.com/Osiyomeoh/ask-me-first
- Additional documentation: https://medium.com/@samuelaleonomoh5/an-agent-that-pays-mums-bills-and-asks-before-anything-unusual-cf9fc6042fe3

## 04 Feedback (edit to your own experience)

**How was your experience building with Walrus?**

Walrus Memory made the core idea small: rememberAndWait to save an answer, and recall to bring it back, even when the wording was different. In my first test, a differently worded query found the right memory first time (1.7 s). Recall that blends similarity with recency suited a payment agent well. The main thing to design around is write latency: a write took about 17–20 s, so the UI has to show that a memory is being saved, and a demo has to wait for it.

**How was your experience building with the Tatum AI Builder?**

I didn't use the AI Builder. I used Tatum's Sui gRPC gateway (sui-testnet-grpc.gateway.tatum.io) to check a wallet's history before each payment, and it responded in about 0.5 s. The JSON-RPC path returned 404 for Sui, so clearer docs on gRPC as the Sui route would help.

**One bug or friction point with Walrus Memory (optional)**

Writes take about 20 s to confirm, which is long for an interactive app. A documented way to get a fast acknowledgement before full confirmation would help.

**Social post links**

- https://x.com/sam_osiyomeoh/status/2119442279488495780
- https://medium.com/@samuelaleonomoh5/an-agent-that-pays-mums-bills-and-asks-before-anything-unusual-cf9fc6042fe3

## Last step
Tick the 18+ and terms box yourself, then click "Submit project".
