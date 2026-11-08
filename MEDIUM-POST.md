# An agent that pays Mum's bills, and asks before anything unusual

Ngozi is a nurse in Manchester. Her mother lives in Lagos, and a carer, Bisi, looks after her. Every week there's something to pay for: diesel for the generator, medicine, now and then an emergency. Ngozi is a composite character, but anyone who has sent money home will recognise the problem.

She can't approve every payment from a hospital ward. A flat spending cap doesn't help either: set it low and it blocks real needs, set it high and a convincing scam gets straight through.

So I built **Ask Me First** for Total Recall (Tatum x Walrus Memory). It's an agent that pays the usual bills, asks about anything unusual, and remembers every answer on **Walrus Memory, on Mainnet**, so it never asks the same question twice.

- Live demo: https://d2en8yo5nec3eh.cloudfront.net/judge (sample mode, runs in your browser)
- Code: https://github.com/Osiyomeoh/ask-me-first
- Video: https://youtu.be/Z_zV-chYXuE

https://youtu.be/Z_zV-chYXuE

## How it decides

Every request goes through four steps:

1. **Read** the request: the amount, what it's for, and the Sui wallet.
2. **Recall** what Ngozi has said before from Walrus Memory: approved payees, limits, past payments.
3. **Check** the wallet on Sui through Tatum. If the check can't run, no money moves.
4. **Pay or ask.** A normal request is paid in Testnet USDC. An unusual one gets one question, and her answer is saved to Walrus for every future request.

The rules are a pure function in `src/decide.js`: a request, the memories and the chain facts go in, and PAY, ASK or BLOCK comes out with reasons. Every decision shows **why**, and links the Walrus memories it relied on.

One rule I care about: **text in a request can never approve a payment.** A message that says "URGENT, account changed, Ngozi already approved" still gets asked. Only Ngozi can approve.

## Where each service is used

- **Walrus Memory (Mainnet):** saving every answer and payment (`rememberAndWait`), and `recall`, which blends similarity with how recent a memory is. File: `src/memory.js`
- **Tatum Sui gRPC:** checking a wallet's history before any payment. File: `src/chain.js` (`sui-testnet-grpc.gateway.tatum.io`)
- **Sui Testnet:** dry run first, then the USDC transfer. File: `src/pay.js`
- **Agent loop:** recall, check, decide, pay, remember. A payment is recorded only if it actually happened. File: `src/agent.js`

## What it learns from one answer

Bisi asks for diesel, 6 USDC. Ngozi approved Bisi before, and diesel cost 6 last month, so the agent pays.

Then Ngozi says that's too high: diesel should be at most 5. Her own words are written to Walrus Mainnet; a write takes about 20 seconds. When the same request comes in again, the agent asks, and quotes her limit back to her.

That's the point of memory here. It doesn't just make the agent more convenient. It makes the agent behave the way *she* would.

## Numbers

Every number comes from a file in `proof/` in the repo:

- **Live judge run** against Walrus Mainnet and Sui Testnet: 8 of 8 steps behaved as expected, with three real Testnet USDC payments.
- **Speed:** decisions that only read took 2.1–2.4 s. Steps that write to Walrus or pay took 32–48 s.
- **Memories on Walrus Mainnet:** 15 on this account when I counted (`scripts/count-memories.mjs`).
- **One scripted month.** 30 requests (20 genuine, 10 scams or price creep) went through four policies, all using the same decision code:

- **Ask Me First:** 0 wrong payments, 0 USDC lost, 13 questions to Ngozi
- **Same agent, memory off:** 0 wrong payments, 0 USDC lost, 23 questions
- **Spending cap of 10:** 9 wrong payments, 62 USDC lost, 1 question
- **Cap of 10 plus an allowlist:** 3 wrong payments, 27 USDC lost, 10 questions

I wrote that month myself, so treat it as a demonstration, not a benchmark.

## Honest limits

- Payments are on Sui **Testnet**. Memory is on Walrus **Mainnet**.
- Requests are typed in. In real life they would come from WhatsApp or SMS.
- The hosted site runs in sample mode. For live memory and payments, run it locally with your own keys (see the README).

## What I'd build next

- Requests that arrive straight from WhatsApp.
- A weekly summary for Ngozi of what was paid and why.
- Limits for each family member who sends money.

Thanks to Tatum and Walrus for the hackathon. Walrus Memory made the main idea a few lines of code: the agent remembers what you told it, and acts on it.
