// Part 2: steps 3-4 live, the proof page, and the real Suiscan transaction from part 1.
import { chromium } from "playwright";
import { writeFileSync, renameSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3003";
const TX = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: "raw", size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
const t0 = Date.now(); const marks = [];
const mark = (name) => { const t = (Date.now() - t0) / 1000; marks.push({ name, t }); console.log(t.toFixed(1), name); };
const pause = (ms) => page.waitForTimeout(ms);
const step = (i) => page.locator("div.snap-start").nth(i).getByRole("button");
const req = () => page.waitForResponse((r) => r.url().endsWith("/api/request"), { timeout: 180000 });

await page.goto(BASE + "/judge"); await page.waitForLoadState("networkidle"); await pause(2500); mark("judge");
mark("s3-send"); await Promise.all([req(), step(2).click()]); await pause(800); mark("s3-decided"); await pause(7000);
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })); await pause(1200);
mark("s4-send"); await Promise.all([req(), step(3).click()]); await pause(800); mark("s4-decided"); await pause(7000);

await page.goto(`https://suiscan.xyz/testnet/tx/${TX}`); await pause(6000); mark("suiscan"); await pause(7000);

await page.goto(BASE + "/proof"); await page.waitForLoadState("networkidle"); mark("proof"); await pause(4000);
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 260); await pause(900); }
await pause(2500); mark("end");

const path = await page.video().path();
await ctx.close(); await browser.close();
renameSync(path, "raw/part2.webm");
writeFileSync("raw/marks2.json", JSON.stringify(marks, null, 2));
