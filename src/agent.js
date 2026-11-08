// The loop: request -> recall her answers -> Tatum facts -> decide -> (pay) -> remember her answer.
import { decide, parseRequest } from "./decide.js";
import { format } from "./memory.js";
import { recipientFacts } from "./chain.js";

export function makeAgent({ store, chainClient, pay, chainOffReason = "no Tatum key" }) {
  const log = [];
  return {
    log,
    async handle(text, id = `req-${Date.now()}`) {
      const req = parseRequest(text, id);
      const query = [req.item, req.to, "limit approved wallet paid", text].filter(Boolean).join(" ");
      const recalled = await store.recall(query, 12);
      let chain;
      if (!req.to) chain = { ok: true, facts: null };
      else if (!chainClient) chain = { ok: false, error: chainOffReason };
      else {
        try { chain = { ok: true, facts: await recipientFacts(chainClient, req.to) }; }
        catch (e) { chain = { ok: false, error: e.message }; }
      }
      const result = { ...decide(req, recalled, chain), chain, mode: store.mode };
      if (result.decision === "PAY" && pay) result.payment = await pay(req);
      // Only remember a payment that actually happened (or sample mode, which says so).
      const happened = !pay || result.payment?.sent || result.payment?.network === "sample";
      if (result.decision === "PAY" && !happened) result.reasons.push("The payment did not go through, so nothing was recorded as paid.");
      if (result.decision === "PAY" && happened) result.memory = await store.remember(format("PAID", { item: req.item, amount: req.amount, to: req.to, request: id }, "auto-paid"));
      log.push(result);
      return result;
    },
    // Her answers. Each becomes a Walrus memory that changes the next decision.
    async approvePayee(address, label, words) { return store.remember(format("PAYEE", { address: address.toLowerCase(), label, status: "approved" }, words)); },
    async blockPayee(address, label, words) { return store.remember(format("PAYEE", { address: address.toLowerCase(), label, status: "blocked" }, words)); },
    async setLimit(item, max, words) { return store.remember(format("RULE", { item, max }, words)); },
    async recordPaid(req, note = "approved by Ngozi") { return store.remember(format("PAID", { item: req.item, amount: req.amount, to: req.to, request: req.id }, note)); },
  };
}
