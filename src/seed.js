// The starting point of the demo story: Bisi is approved, and diesel has been paid before.
import { format } from "./memory.js";

export const BISI = "0x" + "b1".repeat(32);
export const SEED = [
  format("PAYEE", { address: BISI, label: "Bisi (carer)", status: "approved" }, "Bisi is Mum's carer. She buys the diesel."),
  format("PAID", { item: "diesel", amount: 6, to: BISI, request: "seed-1" }, "Diesel for the generator, last month."),
];
