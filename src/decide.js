// The decision: PAY, ASK or BLOCK, with the memories (blob_ids) it relied on.
// Pure function. Text in a request can never authorise a payment; only her
// stored answers and on-chain facts can.
import { parse } from "./memory.js";

const ITEMS = ["diesel", "fuel", "medicine", "drugs", "carer", "salary", "rent", "electricity", "nepa", "food", "transport", "hospital"];
const ALIAS = { fuel: "diesel", drugs: "medicine", salary: "carer", nepa: "electricity" };
const INJECTION = /ignore (all |the )?(previous|prior|above)|new (account|wallet|address)|changed? (my |our |the )?(account|wallet|address)|urgent|right now|immediately|don'?t ask|no need to (ask|check)|already approved|system:|admin/i;

export function parseRequest(text, id) {
  const amount = Number(String(text).match(/(\d+(?:\.\d+)?)\s*(?:usdc|\$|usd|dollars?)/i)?.[1] ?? String(text).match(/\$\s*(\d+(?:\.\d+)?)/)?.[1]);
  const to = String(text).match(/0x[0-9a-fA-F]{64}\b/)?.[0]?.toLowerCase() ?? null;
  const lower = String(text).toLowerCase();
  const found = ITEMS.find((w) => new RegExp(`\\b${w}\\b`).test(lower)) ?? null;
  return { id, text: String(text), item: found ? (ALIAS[found] ?? found) : null, amount: Number.isFinite(amount) ? amount : null, to };
}

/**
 * @param req     parsed request
 * @param recalled memories from recall(): [{blob_id, text, created_at}]
 * @param chain   { ok: true, facts: {txCount,name} } | { ok: false, error }
 */
export function decide(req, recalled, chain) {
  const mems = recalled.map((m) => ({ ...m, rec: parse(m.text) })).filter((m) => m.rec);
  // Newest first, so a later correction overrides an earlier one.
  mems.sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
  const reasons = [];
  const cite = new Set();
  const out = (decision) => ({ decision, reasons, cited: [...cite], request: req });

  if (!req.amount || !req.to) {
    reasons.push("I can't tell the amount or the wallet from this message.");
    return out("ASK");
  }

  const payee = mems.find((m) => m.rec.kind === "PAYEE" && m.rec.address === req.to);
  if (payee?.rec.status === "blocked") {
    cite.add(payee.blob_id);
    reasons.push(`You blocked this wallet: "${payee.rec.words}"`);
    return out("BLOCK");
  }

  if (INJECTION.test(req.text)) {
    reasons.push("The message pushes for urgency or a changed account. A message can't approve a payment, only you can.");
  }

  if (!chain?.ok) {
    reasons.push(`Can't verify the wallet on Sui (${chain?.error ?? "no chain check"}). No money moved.`);
    return out("ASK");
  }

  if (!payee) {
    reasons.push(`You haven't approved this wallet before${chain.facts?.name ? ` (it's ${chain.facts.name})` : ""}.`);
    if (chain.facts && chain.facts.txCount === 0) reasons.push("It has no history on Sui.");
  } else {
    cite.add(payee.blob_id);
  }

  const rule = req.item && mems.find((m) => m.rec.kind === "RULE" && m.rec.item === req.item);
  const paid = mems.filter((m) => m.rec.kind === "PAID" && m.rec.item === req.item);
  if (rule) {
    cite.add(rule.blob_id);
    const max = Number(rule.rec.max);
    if (req.amount > max) reasons.push(`${req.amount} USDC is over your limit for ${req.item} (${max}): "${rule.rec.words}"`);
  } else if (paid.length) {
    const top = Math.max(...paid.map((p) => Number(p.rec.amount)));
    paid.forEach((p) => cite.add(p.blob_id));
    if (req.amount > top * 1.1) reasons.push(`${req.amount} USDC is more than you've paid for ${req.item} before (up to ${top}).`);
  } else {
    reasons.push(req.item ? `You haven't told me what's normal for ${req.item}.` : "I don't know what this payment is for.");
  }

  if (reasons.length) return out("ASK");
  reasons.push(`Same wallet you approved${payee.rec.label ? `: ${payee.rec.label}` : ""}. Within what you've said is normal.`);
  return out("PAY");
}
