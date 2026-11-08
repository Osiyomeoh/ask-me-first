// Builds ask-me-first-demo.mp4: stock clips (Pexels licence) + live screen recordings + Gemini TTS narration (Sulafat, Nigerian English).
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
const browser = await chromium.launch(); const pg = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif&display=swap');html,body{margin:0;width:1280px;height:720px;background:transparent;font-family:Inter,Arial,sans-serif}`;
let pngN = 0;
async function png(html, opaque) { const f = `build/o${pngN++}.png`; await pg.setContent(`<style>${CSS}</style>${html}`, { waitUntil: "networkidle" }); await pg.screenshot({ path: f, omitBackground: !opaque }); return f; }
const escH = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const ff = (...a) => execFileSync("ffmpeg", ["-v", "error", "-y", ...a], { stdio: "inherit" });
const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf", SANS = "/System/Library/Fonts/Supplemental/Arial.ttf", BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf";
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "\u2019").replace(/%/g, "\\%");
const V = "fps=30,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,format=yuv420p";
const chip = (t) => `<div style="position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;top:70px;background:rgba(11,18,32,.82);color:#fff;font:600 17px Inter;padding:10px 16px;border-radius:10px">${escH(t)}</div>`;
const place = (t) => `<div style="position:absolute;right:60px;top:40px;color:#fff;font:56px 'Instrument Serif',Georgia;text-shadow:0 2px 12px rgba(0,0,0,.6)">${escH(t)}</div>`;

const clip = (n) => `clips/pexels-${n}.mp4`;
const SEGS = [
  { voice: "a", parts: [{ src: clip(5722215), ss: 2, d: 9, text: place("Manchester") }, { src: clip(27165007), ss: 1, d: 8.5, text: place("Lagos") }, { src: clip(35923247), ss: 0, d: 8 }], chip: "Stock footage, Pexels. Ngozi is a composite character" },
  { voice: "b", parts: [{ src: clip(5664426), ss: 2, d: 5 }, { card: ["Ask Me First", "Pays the usual. Asks about the unusual. Remembers every answer."], d: 7.5 }] },
  { voice: "c", parts: [{ src: "raw/part1.mp4", ss: 1, d: 8 }, { src: "raw/part1.mp4", ss: 35, d: 16 }], chip: "Live: Walrus Mainnet memory · Tatum Sui gRPC · Sui Testnet USDC" },
  { voice: "d", parts: [{ src: "raw/part1.mp4", ss: 42, d: 4.5 }, { src: "raw/part1.mp4", ss: 62.5, d: 2 }, { src: "raw/part1.mp4", ss: 68, d: 9.5 }], chip: "Her answer, written to Walrus Mainnet (about 20 s, cut)" },
  { voice: "e", parts: [{ src: "raw/part1.mp4", ss: 79.5, d: 9.8 }], chip: "Step 2: a new wallet" },
  { voice: "f", parts: [{ src: "raw/part2.mp4", ss: 4.5, d: 10.5 }], chip: "Step 3: a manipulative message" },
  { voice: "g", parts: [{ src: "raw/part2.mp4", ss: 22, d: 8 }], chip: "Step 4: Tatum checks switched off" },
  { voice: "h", parts: [{ src: "raw/part2.mp4", ss: 51, d: 12 }, { src: clip(7120152), ss: 3, d: 9.5 }], chip: "/proof: every number links to a file in the repo" },
  { voice: "i", parts: [{ card: ["Ask Me First", "github.com/Osiyomeoh/ask-me-first", "Walrus Memory  ·  Tatum  ·  Sui"], d: 6.5 }] },
];

mkdirSync("build", { recursive: true });
const lines = JSON.parse(readFileSync("voice/final-lines.json", "utf8"));

const srt = []; let clock = 0; const segFiles = [];
for (const [si, s] of SEGS.entries()) {
  const pf = []; for (const [pi, p] of s.parts.entries()) {
    const out = `build/s${si}p${pi}.mp4`;
    if (p.card) {
      const [title, ...subs] = p.card;
      const img = await png(`<div style="width:1280px;height:720px;background:#f7f3ec;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"><div style="font:104px 'Instrument Serif',Georgia;color:#0b1220">${escH(title)}</div>${subs.map((t, k) => `<div style="margin-top:${k ? 12 : 16}px;font:${k ? "400 24px" : "600 30px"} Inter;color:${k ? "#57534e" : "#b3471f"}">${escH(t)}</div>`).join("")}</div>`, true);
      ff("-loop", "1", "-framerate", "30", "-t", String(p.d), "-i", img, "-vf", "fade=in:0:12,format=yuv420p", "-an", "-c:v", "libx264", "-crf", "18", out);
    } else {
      const html = [p.text, s.chip && chip(s.chip)].filter(Boolean).join("");
      if (html) { const ov = await png(html); ff("-ss", String(p.ss), "-t", String(p.d), "-i", p.src, "-i", ov, "-filter_complex", `[0:v]${V}[b];[b][1:v]overlay=0:0,format=yuv420p`, "-an", "-c:v", "libx264", "-crf", "18", out); }
      else ff("-ss", String(p.ss), "-t", String(p.d), "-i", p.src, "-vf", V, "-an", "-c:v", "libx264", "-crf", "18", out);
    }
    pf.push(out);
  }
  const list = `build/s${si}.txt`; writeFileSync(list, pf.map((f) => `file '${f.replace("build/", "")}'`).join("\n"));
  const vid = `build/s${si}v.mp4`; ff("-f", "concat", "-safe", "0", "-i", list, "-c", "copy", vid);
  const vlen = dur(vid), voice = `voice/ng/${s.voice}.mp3`, alen = dur(voice), lead = 0.4;
  const len = Math.max(vlen, alen + lead + 0.6);
  const seg = `build/seg${si}.mp4`;
  ff("-i", vid, "-i", voice, "-filter_complex", `[0:v]tpad=stop_mode=clone:stop_duration=${(len - vlen + 0.1).toFixed(2)},trim=duration=${len.toFixed(2)}[v];[1:a]adelay=${lead * 1000}|${lead * 1000},apad,atrim=duration=${len.toFixed(2)},aresample=48000[a]`,
    "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-b:a", "160k", "-ac", "2", seg);
  segFiles.push(seg);
  // captions: split into sentences, time by length
  const sent = lines[s.voice].match(/[^.!?]+[.!?]+/g).map((x) => x.trim());
  const total = sent.reduce((n, x) => n + x.length, 0); let t = clock + lead;
  for (const x of sent) { const d = (x.length / total) * alen; srt.push([t, t + d, x]); t += d; }
  clock += dur(seg);
}
writeFileSync("build/all.txt", segFiles.map((f) => `file '${f.replace("build/", "")}'`).join("\n"));
ff("-f", "concat", "-safe", "0", "-i", "build/all.txt", "-c", "copy", "build/joined.mp4");
const ts = (x) => { const ms = Math.round(x * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
writeFileSync("captions.srt", srt.map(([a, b, x], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${x}\n`).join("\n"));
const caps = []; for (const [a, b, x] of srt) caps.push([a, b, await png(`<div style="position:absolute;left:0;right:0;bottom:40px;text-align:center"><span style="display:inline-block;max-width:1000px;background:rgba(0,0,0,.74);color:#fff;font:500 26px/1.35 Inter;padding:8px 18px;border-radius:8px">${escH(x)}</span></div>`)]);
await browser.close();
const inputs = caps.flatMap(([, , f]) => ["-i", f]);
let fc = "", last = "0:v"; caps.forEach(([a, b], i) => { const o = i === caps.length - 1 ? "vout" : `c${i}`; fc += `[${last}][${i + 1}:v]overlay=0:0:enable='between(t,${a.toFixed(2)},${b.toFixed(2)})'[${o}];`; last = o; });
ff("-i", "build/joined.mp4", ...inputs, "-filter_complex", fc.replace(/;$/, ""), "-map", "[vout]", "-map", "0:a", "-c:v", "libx264", "-crf", "20", "-preset", "slow", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "ask-me-first-demo.mp4");
console.log("done", dur("ask-me-first-demo.mp4").toFixed(1), "s");
