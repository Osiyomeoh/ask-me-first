import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { go } from "./App.jsx";

export default function Nav({ path, overlay }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(scrollY > 40); f(); addEventListener("scroll", f); return () => removeEventListener("scroll", f); }, []);
  const clear = overlay && !scrolled;
  const link = (to, label) => (
    <a href={to} onClick={(e) => { e.preventDefault(); go(to); }}
      className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${path === to ? (clear ? "bg-white/20 text-white" : "bg-stone-100 text-ink") : clear ? "text-white/80 hover:text-white" : "text-stone-600 hover:text-ink"}`}>{label}</a>
  );
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${clear ? "bg-transparent" : "bg-white/80 backdrop-blur-xl border-b border-stone-200/70"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" onClick={(e) => { e.preventDefault(); go("/"); }} className="flex items-center gap-2">
          <span className={`grid h-8 w-8 place-items-center rounded-lg ${clear ? "bg-white text-ink" : "bg-ink text-white"}`}><ShieldCheck size={17} /></span>
          <span className={`whitespace-nowrap font-semibold tracking-tight max-[400px]:sr-only ${clear ? "text-white" : "text-ink"}`}>Ask Me First</span>
        </a>
        <nav className="flex items-center gap-1">
          {link("/app", "Demo")}
          {link("/judge", "Judge")}
          {link("/proof", "Proof")}
        </nav>
      </div>
    </header>
  );
}
