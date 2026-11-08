import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, MessageCircleQuestion, Radar, ShieldCheck, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PHOTOS, api } from "./api.js";
import { go } from "./App.jsx";

const up = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

export default function Landing() {
  return (
    <main>
      <Hero />
      <Story />
      <How />
      <Compare />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <motion.img src={PHOTOS.lagos.src} alt="Lagos skyline" className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: "easeOut" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/90" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
          <motion.span variants={up} className="chip bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live on Walrus Mainnet · Sui
          </motion.span>
          <motion.h1 variants={up} className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-7xl">
            Pay for Mum's care <span className="font-serif italic font-normal">from 5,000 km away.</span>
          </motion.h1>
          <motion.p variants={up} className="mt-5 max-w-xl text-lg text-white/80">
            An agent that pays the usual bills, asks you about anything unusual, and remembers every answer, so it never asks twice.
          </motion.p>
          <motion.div variants={up} className="mt-8 flex flex-wrap gap-3">
            <button className="btn bg-white text-ink hover:bg-stone-100 px-5 py-3" onClick={() => go("/app")}>Try it as Ngozi <ArrowRight size={16} /></button>
            <button className="btn bg-white/10 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/20 px-5 py-3" onClick={() => go("/proof")}>See the proof</button>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
          className="pointer-events-none absolute right-6 top-32 hidden w-80 lg:block">
          <FloatingCard />
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCard() {
  return (
    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="chip bg-amber-100 text-amber-800">Needs your answer</span>
        <span className="text-xs text-stone-500">09:24</span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">9 <span className="text-base font-semibold text-stone-500">USDC</span></div>
      <div className="text-sm text-stone-600">Diesel · Bisi, Mum's carer</div>
      <div className="mt-4 rounded-xl border-l-4 border-brand bg-brand-soft/60 p-3 text-sm">
        <div className="text-stone-500 text-xs mb-1">You told me on 2 Nov</div>
        “Diesel is 6. Never more without asking.”
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="btn-primary py-2 text-xs">Approve</div>
        <div className="btn-ghost py-2 text-xs">Keep the limit</div>
      </div>
    </motion.div>
  );
}

function Story() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.p variants={up} className="text-sm font-semibold uppercase tracking-widest text-brand">The problem</motion.p>
          <motion.h2 variants={up} className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Ngozi is a nurse in Manchester. <span className="font-serif italic font-normal text-stone-500">Her mother lives in Lagos.</span></motion.h2>
          <motion.p variants={up} className="mt-5 text-lg text-stone-600">Diesel for the generator, medicine, the carer's salary: small payments, every week, from a different time zone. Approving each one by hand wears her out. Letting an app pay blindly lets scams and price creep through.</motion.p>
          <motion.p variants={up} className="mt-4 text-lg text-stone-600">Ask Me First sits in between. It learns what is normal <em>from her own words</em>, and only interrupts her when something isn't.</motion.p>
          <motion.p variants={up} className="mt-6 text-sm text-stone-400">Ngozi is a composite character, drawn from the many families who send money home.</motion.p>
        </motion.div>
        <div className="relative h-[460px]">
          <motion.figure initial={{ opacity: 0, x: 40, rotate: 3 }} whileInView={{ opacity: 1, x: 0, rotate: 2 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="absolute right-0 top-0 w-[68%] overflow-hidden rounded-3xl shadow-2xl">
            <img src={PHOTOS.mum.src} alt="An older woman in a headscarf, smiling" className="h-[380px] w-full object-cover" loading="lazy" />
          </motion.figure>
          <motion.figure initial={{ opacity: 0, x: -40, rotate: -4 }} whileInView={{ opacity: 1, x: 0, rotate: -3 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}
            className="absolute bottom-0 left-0 w-[52%] overflow-hidden rounded-3xl border-4 border-stone-50 shadow-2xl">
            <img src={PHOTOS.care.src} alt="A doctor listening to a patient with a stethoscope" className="h-[260px] w-full object-cover" loading="lazy" />
          </motion.figure>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }}
            className="glass absolute bottom-10 right-4 rounded-2xl px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-emerald-700"><Check size={16} /> Paid Bisi 6 USDC</div>
            <div className="text-xs text-stone-500">Same as last week · no need to ask</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: Radar, title: "A request arrives", body: "Bisi asks for diesel money. The agent reads the amount, the item and the Sui wallet." },
  { icon: BrainCircuit, title: "It recalls what you said", body: "Your past answers live in Walrus Memory: approved payees, limits, what you've paid before." },
  { icon: ShieldCheck, title: "It checks the wallet on Sui", body: "Through Tatum it looks at the wallet's history. If it can't check, no money moves." },
  { icon: MessageCircleQuestion, title: "Pays, or asks you", body: "Normal? Paid in seconds. Unusual? One question, and your answer is remembered for next time." },
];

function How() {
  return (
    <section className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="max-w-2xl">
          <motion.p variants={up} className="text-sm font-semibold uppercase tracking-widest text-orange-300">How it works</motion.p>
          <motion.h2 variants={up} className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Every answer makes the next decision <span className="font-serif italic font-normal text-white/60">smarter.</span></motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={stagger} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: I, title, body }, i) => (
            <motion.div key={title} variants={up} whileHover={{ y: -6 }} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-400/15 text-orange-300"><I size={22} /></span><span className="font-mono text-xs text-white/40">0{i + 1}</span></div>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Compare() {
  const [table, setTable] = useState(null);
  useEffect(() => { api("/api/proof").then((files) => { const r = files.filter((f) => f.file.startsWith("replay")).sort((a, b) => b.file.localeCompare(a.file))[0]; if (r) setTable(r.data.table); }).catch(() => {}); }, []);
  if (!table) return null;
  const rows = Object.entries(table);
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="max-w-2xl">
        <motion.p variants={up} className="text-sm font-semibold uppercase tracking-widest text-brand">One month, replayed</motion.p>
        <motion.h2 variants={up} className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Zero wrong payments. <span className="font-serif italic font-normal text-stone-500">Fewer questions.</span></motion.h2>
        <motion.p variants={up} className="mt-4 text-stone-600">30 requests (20 genuine, 10 scams or price creep) run through four approaches, using the same decision code as the live app. A scripted, simulated month: we wrote the scenario.</motion.p>
      </motion.div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {rows.map(([name, s], i) => {
          const ours = i === 0;
          return (
            <motion.div key={name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`rounded-2xl p-6 ${ours ? "bg-ink text-white shadow-2xl shadow-orange-950/30 ring-1 ring-orange-400/40" : "card"}`}>
              <div className={`text-sm font-semibold ${ours ? "text-orange-300" : "text-stone-500"}`}>{name}</div>
              <div className="mt-5 flex items-end gap-2">
                <span className={`text-5xl font-bold tracking-tight ${s.wrongPayments ? "text-red-600" : ours ? "text-emerald-400" : "text-emerald-600"}`}>{s.wrongPayments}</span>
                <span className={`pb-2 text-sm ${ours ? "text-white/60" : "text-stone-500"}`}>wrong payments</span>
              </div>
              <dl className={`mt-4 space-y-1.5 text-sm ${ours ? "text-white/70" : "text-stone-600"}`}>
                <div className="flex justify-between"><dt>Money lost</dt><dd className="font-semibold">{s.moneyLost} USDC</dd></div>
                <div className="flex justify-between"><dt>Questions to Ngozi</dt><dd className="font-semibold">{s.questions}</dd></div>
              </dl>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold">
                {s.wrongPayments ? <><X size={14} className="text-red-500" /> Lets bad payments through</> : <><Check size={14} className={ours ? "text-emerald-400" : "text-emerald-600"} /> Safe</>}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-stone-400">Cap policies model the common "auto-pay under a limit" pattern, not any named product.</p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <img src={PHOTOS.bridge.src} alt="Boats on the lagoon beside a Lagos bridge" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-slate-950/80" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-white sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">See it decide, live.</h2>
        <p className="mt-2 text-white/70">Four steps, about three minutes.</p>
        <button className="btn mt-6 bg-white text-ink hover:bg-stone-100 px-5 py-3" onClick={() => go("/judge")}>Start the judge path <ArrowRight size={16} /></button>
        <p className="mt-16 text-xs text-white/40">
          Photos on Unsplash by {Object.values(PHOTOS).map((p, i) => <span key={p.src}>{i ? ", " : ""}<a className="underline" href={p.page} target="_blank" rel="noopener">{p.by}</a></span>)}. Built for Total Recall (Tatum × Walrus).
        </p>
      </div>
    </footer>
  );
}
