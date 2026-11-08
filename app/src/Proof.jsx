import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { ExternalLink, FileJson } from "lucide-react";

import { api, short, blobUrl } from "./api.js";

function Count({ to, suffix = "", decimals = 0 }) {
  const ref = useRef(null); const inView = useInView(ref, { once: true }); const [v, setV] = useState(0);
  useEffect(() => { if (inView) { const c = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: setV }); return c.stop; } }, [inView, to]);
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>;
}

export default function Proof() {
  const [files, setFiles] = useState([]);
  useEffect(() => { api("/api/proof").then(setFiles).catch(() => {}); }, []);
  const live = files.filter((f) => f.file.startsWith("live-judge")).sort((a, b) => b.file.localeCompare(a.file))[0];
  const steps = live?.data.steps || [];
  const pays = steps.map((s) => s.response.payment).filter((p) => p?.sent);
  const mems = new Set(steps.flatMap((s) => [...(s.response.memories || []).map((m) => m.blob_id), s.response.memory?.blob_id]).filter(Boolean)).size;
  const fastest = steps.length ? Math.min(...steps.map((s) => s.response.ms)) / 1000 : 0;
  const stats = [
    { v: steps.filter((s) => s.expect === s.got).length, of: steps.length, l: "live steps as expected" },
    { v: pays.length, l: "real Testnet USDC payments" },
    { v: mems, l: "Walrus Mainnet memories written in the run" },
    { v: fastest, d: 1, s: " s", l: "fastest decision" },
  ];
  return (
    <main className="min-h-screen bg-paper pt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-semibold tracking-tight">Proof</motion.h1>
        <p className="mt-2 max-w-2xl text-stone-500">Raw output from real runs, unedited. Memories link to Walruscan (Mainnet); payments link to Suiscan (Testnet).</p>

        {live && <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-5">
              <div className="text-4xl font-bold tracking-tight"><Count to={s.v} decimals={s.d || 0} suffix={s.s || ""} />{s.of ? <span className="text-stone-300">/{s.of}</span> : ""}</div>
              <div className="mt-1 text-sm text-stone-500">{s.l}</div>
            </motion.div>
          ))}
        </div>}

        {live && <div className="card mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4"><h2 className="font-semibold">Live judge run</h2><span className="mono hidden text-stone-400 sm:inline">{live.file}</span></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-widest text-stone-400"><tr><th className="px-5 py-3">Step</th><th className="px-5 py-3">Expected</th><th className="px-5 py-3">Got</th><th className="hidden px-5 py-3 sm:table-cell">Time</th><th className="px-5 py-3">Evidence</th></tr></thead>
              <tbody>
                {steps.map((s, i) => {
                  const p = s.response.payment;
                  const ids = [...(s.response.cited || []), ...(s.response.memories || []).map((m) => m.blob_id)].slice(0, 2);
                  return (
                    <motion.tr key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.05 }} className="border-t border-stone-100">
                      <td className="px-5 py-3 font-medium">{s.name.replace(/^\d+ /, "")}</td>
                      <td className="px-5 py-3"><span className="chip bg-stone-100 text-stone-600">{s.expect}</span></td>
                      <td className="px-5 py-3"><span className={`chip ${s.got === "PAY" ? "bg-emerald-50 text-emerald-700" : s.got === "ASK" ? "bg-amber-50 text-amber-800" : "bg-brand-soft text-brand"}`}>{s.got}</span></td>
                      <td className="hidden px-5 py-3 font-mono text-xs text-stone-500 sm:table-cell">{(s.response.ms / 1000).toFixed(1)} s</td>
                      <td className="px-5 py-3">
                        {p?.sent ? <a className="inline-flex items-center gap-1 font-mono text-xs text-brand hover:underline" href={p.explorer} target="_blank" rel="noopener">{short(p.digest)} <ExternalLink size={11} /></a>
                          : ids.length ? ids.map((id) => <a key={id} className="mr-2 inline-flex items-center gap-1 font-mono text-xs text-brand hover:underline" href={blobUrl(id)} target="_blank" rel="noopener">{short(id)}<ExternalLink size={11} /></a>) : <span className="text-stone-300">—</span>}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>}

        <h2 className="mt-12 text-lg font-semibold">All run files</h2>
        <div className="mt-4 space-y-3">
          {files.map((f) => (
            <details key={f.file} className="card group overflow-hidden">
              <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 font-mono text-sm"><FileJson size={16} className="text-stone-400" />{f.file}</summary>
              <pre className="max-h-96 overflow-auto border-t border-stone-100 bg-stone-50 p-5 font-mono text-xs text-stone-600">{JSON.stringify(f.data, null, 1)}</pre>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
