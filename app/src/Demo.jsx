import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Ban, Check, CircleAlert, Database, ExternalLink, Gauge, Loader2, Plug, PlugZap, ShieldAlert, Sparkles, Wallet } from "lucide-react";
import { api, BISI, NAMES, ROLES, PRESETS, DIESEL4, PHOTOS, short, cap, blobUrl, parseMem } from "./api.js";

const STATE = {
  PAY: { label: "Paid automatically", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", bar: "from-emerald-500 to-teal-400", icon: Check },
  ASK: { label: "Needs your answer", cls: "bg-amber-50 text-amber-800 ring-amber-600/20", bar: "from-amber-500 to-orange-400", icon: CircleAlert },
  BLOCK: { label: "Blocked", cls: "bg-red-50 text-red-700 ring-red-600/20", bar: "from-red-500 to-rose-400", icon: Ban },
};
const JUDGE = [
  { title: "It learns from one answer", body: "Send diesel. It pays. Answer “Too high”, limit 5, then send it again.", preset: "diesel" },
  { title: "A new wallet", body: "A new pharmacy, so it asks. Approve it, then send again: it pays.", preset: "pharmacy" },
  { title: "A manipulative message", body: "Text can never approve a payment. Only Ngozi can.", preset: "inject" },
  { title: "Safe failure", body: "Turn Tatum checks off: it can't verify, so no money moves.", chainOff: true },
];

export default function Demo({ judge }) {
  const [status, setStatus] = useState({});
  const [text, setText] = useState("");
  const [busy, setBusy] = useState("");
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(null);
  const [known, setKnown] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(new Set());
  const resultRef = useRef(null);
  const live = status.mode === "live";

  const refresh = useCallback(async () => {
    const [s, h] = await Promise.all([api("/api/status"), api("/api/history")]);
    setStatus(s);
    setKnown(h.filter((x) => x.kind === "answer").flatMap((x) => x.memories.map((m) => ({ ...parseMem(m.text), blob: m.blob_id }))).filter((m) => m.kind));
  }, []);
  useEffect(() => { refresh().catch((e) => setError(e.message)); }, [refresh]);

  async function send(t = text, step) {
    if (!t.trim()) return;
    setText(t); setBusy(live ? "Recalling her answers from Walrus and checking the wallet on Sui" : "Recalling her answers and checking the wallet"); setError(""); setSaved(null);
    try {
      const r = await api("/api/request", { text: t });
      setResult({ ...r, at: new Date() });
      if (step != null) setDone((d) => new Set(d).add(step));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(""); }
  }
  async function answer(action, words, max) {
    setBusy(live ? "Saving her answer to Walrus Mainnet, about 20 seconds" : "Saving her answer"); setError("");
    try {
      const out = await api("/api/answer", { action, request: result.request, words, max, label: NAMES[result.request.to] || cap(result.request.item) });
      setSaved(out); await refresh();
    } catch (e) { setError(e.message); } finally { setBusy(""); }
  }
  async function chain(on) { await api("/api/chain", { on }); await refresh(); if (!on) { await send(DIESEL4, 3); } }

  return (
    <main className="min-h-screen bg-paper pt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{judge ? "Judge path" : "Requests"}</h1>
            <p className="mt-1 text-stone-500">Pays the usual bills. Asks about anything unusual. Remembers every answer.</p>
          </div>
          <StatusPills status={status} />
        </div>

        {judge && <JudgeSteps done={done} busy={!!busy} onPreset={(p, i) => send(PRESETS.find((x) => x.key === p).text, i)} onChain={chain} chainOn={status.chainOn !== false} />}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <Composer text={text} setText={setText} busy={busy} onSend={() => send()} onPick={(p) => setText(p.text)} />
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>}
            <div ref={resultRef} className="scroll-mt-24">
              <AnimatePresence mode="wait">
                {result ? <Decision key={result.at.getTime()} r={result} live={live} busy={busy} saved={saved} onAnswer={answer} /> : <Empty />}
              </AnimatePresence>
            </div>
          </div>
          <aside className="space-y-6">
            <Learned known={known} />
            <Household />
          </aside>
        </div>
      </div>
    </main>
  );
}

function StatusPills({ status }) {
  const live = status.mode === "live";
  const items = [
    { icon: Database, label: live ? "Walrus Mainnet" : "Sample memory", ok: live },
    { icon: status.chainOn === false ? Plug : PlugZap, label: status.chainOn === false ? "Sui checks off" : live ? "Tatum · Sui" : "Sample chain", ok: live && status.chainOn !== false, off: status.chainOn === false },
    { icon: Wallet, label: status.payments === "testnet" ? "Sui Testnet USDC" : "No money moves", ok: status.payments === "testnet" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ icon: I, label, ok, off }) => (
        <span key={label} className="chip bg-white text-stone-700 ring-1 ring-stone-200">
          <span className={`h-1.5 w-1.5 rounded-full ${off ? "bg-red-500" : ok ? "bg-emerald-500" : "bg-amber-500"}`} /><I size={13} />{label}
        </span>
      ))}
    </div>
  );
}

function JudgeSteps({ done, busy, onPreset, onChain, chainOn }) {
  const next = [0, 1, 2, 3].find((i) => !done.has(i)) ?? 4;
  return (
    <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {JUDGE.map((s, i) => {
        const isDone = done.has(i), isNext = i === next;
        return (
          <motion.div key={s.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`relative w-[78%] flex-none snap-start rounded-2xl border p-4 transition sm:w-auto ${isNext ? "border-brand bg-white shadow-lg shadow-brand/15" : "border-stone-200 bg-white/70"}`}>
            <div className="flex items-center gap-2">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${isDone ? "bg-emerald-500 text-white" : isNext ? "bg-brand text-white" : "bg-stone-100 text-stone-500"}`}>{isDone ? <Check size={13} /> : i + 1}</span>
              <span className="text-sm font-semibold">{s.title}</span>
            </div>
            <p className="mt-2 text-[13px] leading-snug text-stone-500">{s.body}</p>
            <div className="mt-3 flex gap-2">
              {s.chainOff
                ? (chainOn ? <button disabled={busy} onClick={() => onChain(false)} className="btn-ghost px-3 py-1.5 text-xs">Turn checks off and send</button>
                  : <button disabled={busy} onClick={() => onChain(true)} className="btn-ghost px-3 py-1.5 text-xs">Turn checks back on</button>)
                : <button disabled={busy} onClick={() => onPreset(s.preset, i)} className={`${isNext ? "btn-brand" : "btn-ghost"} px-3 py-1.5 text-xs`}>Send it</button>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Composer({ text, setText, busy, onSend, onPick }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-stone-100 px-5 py-4">
        <img src={PHOTOS.mum.src.replace("w=900", "w=96")} alt="" className="h-9 w-9 rounded-full object-cover" />
        <div className="flex-1"><div className="text-sm font-semibold">Mum's household, Lagos</div><div className="text-xs text-stone-500">Requests from Bisi and others</div></div>
      </div>
      <div className="p-5">
        <div className="grid gap-2 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <motion.button key={p.key} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => onPick(p)}
              className={`rounded-xl border p-3 text-left transition ${text === p.text ? "border-brand bg-brand-soft/50" : "border-stone-200 hover:border-stone-300"}`}>
              <div className="text-xs text-stone-500">{p.from}</div>
              <div className="text-sm font-semibold leading-tight">{p.label}</div>
              <div className="mt-1 text-xs font-mono text-stone-500">{p.amount} USDC</div>
            </motion.button>
          ))}
        </div>
        <div className="relative mt-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSend(); }}
            placeholder="Or paste a request, e.g. Diesel for the generator, 6 USDC, pay to 0x…" rows={3}
            className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 pr-14 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/15" />
          <button onClick={onSend} disabled={!!busy || !text.trim()} aria-label="Check this request"
            className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-lg bg-ink text-white transition hover:bg-slate-800 disabled:opacity-30">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} />}
          </button>
        </div>
        <AnimatePresence>{busy && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-3 flex items-center gap-2 text-sm text-stone-500"><Loader2 size={14} className="animate-spin" />{busy}</div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-stone-100"><motion.div className="h-full w-1/3 rounded-full bg-brand" animate={{ x: ["-100%", "300%"] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} /></div>
          </motion.div>)}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Empty() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border-2 border-dashed border-stone-200 px-6 py-14 text-center">
      <Sparkles className="mx-auto text-stone-300" />
      <div className="mt-3 font-semibold">No request yet</div>
      <div className="text-sm text-stone-500">Pick one of the requests above to see it decide.</div>
    </motion.div>
  );
}

const iconFor = (reason, d) => /^Same wallet|within/.test(reason) ? "ok" : d === "BLOCK" || /Can't verify|can't approve|urgency/.test(reason) ? "stop" : "flag";

function Decision({ r, live, busy, saved, onAnswer }) {
  const req = r.request, st = STATE[r.decision], who = NAMES[req.to] || (req.to ? "Unknown wallet" : "No wallet found");
  const facts = r.chain?.ok && r.chain.facts;
  const checks = [...r.reasons.map((t) => ({ t, k: iconFor(t, r.decision) })),
    ...(facts ? [{ t: `${live ? "Tatum" : "Sample chain"}: ${facts.txCount}${facts.capped ? "+" : ""} transactions on Sui${facts.name ? `, named ${facts.name}` : ""}.`, k: facts.txCount ? "ok" : "flag" }] : [])];
  const Icon = st.icon;
  return (
    <motion.article initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} className="card overflow-hidden">
      <motion.div className={`h-1.5 bg-gradient-to-r ${st.bar}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ originX: 0 }} transition={{ duration: 0.6 }} />
      <div className="flex flex-wrap items-start justify-between gap-4 p-6">
        <div>
          <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.15 }} className={`chip ring-1 ${st.cls}`}><Icon size={13} />{st.label}</motion.span>
          <div className="mt-3 flex items-baseline gap-2"><span className="text-5xl font-bold tracking-tight tabular-nums">{req.amount ?? "—"}</span><span className="text-lg font-semibold text-stone-400">USDC</span></div>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-stone-100 text-sm font-bold text-stone-600">{who.slice(0, 2).toUpperCase()}</span>
            <div><div className="font-semibold">{who} <span className="font-normal text-stone-500">· {ROLES[req.to] || "—"}</span></div><div className="mono text-stone-500">{short(req.to) || "—"} · {cap(req.item) || "Unknown item"}</div></div>
          </div>
        </div>
        <div className="text-right text-xs text-stone-400">{r.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
      </div>

      <Section title="Why">
        <ul className="space-y-2.5">
          {checks.map((c, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }} className="flex gap-3 text-sm">
              <span className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full ${c.k === "ok" ? "bg-emerald-100 text-emerald-700" : c.k === "stop" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                {c.k === "ok" ? <Check size={12} strokeWidth={3} /> : c.k === "stop" ? <ShieldAlert size={12} /> : <CircleAlert size={12} />}
              </span>
              <span className="text-stone-700">{c.t}</span>
            </motion.li>
          ))}
        </ul>
      </Section>

      {r.cited?.length > 0 && <Section title="Based on what it remembered">
        <div className="flex flex-wrap gap-2">{r.cited.map((id) => <Blob key={id} id={id} />)}</div>
      </Section>}

      {r.payment && <Section title="Payment"><Payment p={r.payment} /></Section>}

      {r.decision !== "BLOCK" && req.to && <Answer paid={r.decision === "PAY"} busy={busy} saved={saved} onAnswer={onAnswer} />}
    </motion.article>
  );
}

const Section = ({ title, children }) => (
  <div className="border-t border-stone-100 px-6 py-5"><h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-stone-400">{title}</h3>{children}</div>
);

function Blob({ id }) {
  if (id.startsWith("sample-")) return <span className="chip bg-stone-100 font-mono font-medium text-stone-500">{id} · sample</span>;
  return <a href={blobUrl(id)} target="_blank" rel="noopener" className="chip bg-brand-soft font-mono font-medium text-brand hover:underline">{short(id)} <ExternalLink size={11} /></a>;
}

function Payment({ p }) {
  if (p.network === "sample") return <p className="text-sm text-stone-500">{p.note}</p>;
  if (!p.sent) return <p className="text-sm text-red-600">Not sent: {p.simulated?.error ?? p.note}</p>;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <Check size={16} /> Simulated through Tatum in {p.simulated.ms} ms, then sent on Sui {p.network}.
      <a href={p.explorer} target="_blank" rel="noopener" className="ml-auto inline-flex items-center gap-1 font-mono text-xs font-semibold underline">{short(p.digest)} <ExternalLink size={11} /></a>
    </div>
  );
}

function Answer({ paid, busy, saved, onAnswer }) {
  const [words, setWords] = useState("");
  const [max, setMax] = useState(5);
  if (saved) return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="border-t border-stone-100 bg-emerald-50/60 px-6 py-5">
      <div className="flex items-center gap-2 font-semibold text-emerald-800"><Check size={16} /> Remembered</div>
      <div className="mt-2 flex flex-wrap gap-2">{saved.memories.map((m) => <Blob key={m.blob_id} id={m.blob_id} />)}</div>
      {saved.payment && <div className="mt-3"><Payment p={saved.payment} /></div>}
      <p className="mt-3 text-sm text-stone-600">Send the same request again to see what changed.</p>
    </motion.div>
  );
  return (
    <div className="border-t border-stone-100 bg-stone-50/70 px-6 py-5">
      <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-stone-400">{paid ? "Something wrong? Teach it" : "Your answer"}</h3>
      <input value={words} onChange={(e) => setWords(e.target.value)} placeholder="In your own words, e.g. “That's Mum's pharmacy, it's fine.”"
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/15" />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!paid && <button disabled={!!busy} onClick={() => onAnswer("approve", words)} className="btn-primary"><Check size={15} /> Approve and pay</button>}
        <div className="flex items-center rounded-xl border border-stone-200 bg-white pr-2">
          <button disabled={!!busy} onClick={() => onAnswer("limit", words, max)} className="btn border-0 px-3"><Gauge size={15} /> Too high, limit to</button>
          <input type="number" min={1} value={max} onChange={(e) => setMax(e.target.value)} aria-label="Limit in USDC" className="w-14 rounded-lg border border-stone-200 px-2 py-1 text-sm" />
          <span className="ml-1.5 text-xs text-stone-500">USDC</span>
        </div>
        <button disabled={!!busy} onClick={() => onAnswer("block", words)} className="btn border border-red-200 bg-white text-red-700 hover:bg-red-50"><Ban size={15} /> Block wallet</button>
      </div>
      <p className="mt-3 text-xs text-stone-400">Your answer is saved to Walrus Memory and used for every future request.</p>
    </div>
  );
}

const SEEDED = [
  { kind: "PAYEE", f: { status: "approved", label: "Bisi" }, words: "Bisi is Mum's carer. She buys the diesel.", tag: "Earlier" },
  { kind: "PAID", f: { item: "diesel", amount: "6" }, words: "Diesel for the generator, last month.", tag: "Earlier" },
];

function Learned({ known }) {
  const all = [...known.map((k) => ({ ...k, tag: "New" })), ...SEEDED];
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between"><h2 className="font-semibold">What it has learned</h2><span className="chip bg-brand-soft text-brand"><Database size={12} />Walrus</span></div>
      <motion.ul layout className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {all.map((m, i) => {
            const [title, tone] = m.kind === "RULE" ? [`${cap(m.f.item)}: at most ${m.f.max} USDC`, "amber"]
              : m.kind === "PAYEE" ? [`${m.f.status === "blocked" ? "Never pay" : "Approved"}: ${(m.f.label || "").replace(/_/g, " ")}`, m.f.status === "blocked" ? "red" : "emerald"]
              : [`Paid ${m.f.item} ${m.f.amount} USDC`, "stone"];
            return (
              <motion.li key={(m.blob || m.words) + i} layout initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="rounded-xl border border-stone-100 bg-stone-50/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`h-2 w-2 rounded-full ${{ amber: "bg-amber-500", red: "bg-red-500", emerald: "bg-emerald-500", stone: "bg-stone-400" }[tone]}`} />{title}
                  </div>
                  <span className={`chip px-2 py-0.5 text-[10px] ${m.tag === "New" ? "bg-brand text-white" : "bg-stone-100 text-stone-500"}`}>{m.tag}</span>
                </div>
                {m.words && <p className="mt-1 text-[13px] italic text-stone-500">“{m.words}”</p>}
                {m.blob && <div className="mt-2"><Blob id={m.blob} /></div>}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

function Household() {
  return (
    <div className="card overflow-hidden">
      <img src={PHOTOS.mum.src} alt="An older woman in a headscarf, smiling" className="h-40 w-full object-cover" loading="lazy" />
      <div className="p-5">
        <div className="font-semibold">Ngozi → Mum in Lagos</div>
        <p className="mt-1 text-sm text-stone-500">A nurse in Manchester paying for her mother's care. Ngozi is a composite character.</p>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-stone-50 p-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">BI</span>
          <div className="text-sm"><div className="font-semibold">Bisi</div><div className="mono text-stone-500">{short(BISI)}</div></div>
          <span className="chip ml-auto bg-emerald-50 text-emerald-700">Approved</span>
        </div>
      </div>
    </div>
  );
}
