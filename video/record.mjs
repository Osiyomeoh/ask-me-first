// Records the judge path against the live server (Walrus Mainnet + Sui Testnet) and logs a timestamp for every event.
import { chromium } from "playwright";
import { writeFileSync, renameSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3003";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: "raw", size: { width: 1280, height: 720 } } });
const page = await ctx.newPage();
const t0 = Date.now(); const marks = [];
const mark = (name) => { const t = (Date.now() - t0) / 1000; marks.push({ name, t }); console.log(t.toFixed(1), name); };
const pause = (ms) => page.waitForTimeout(ms);
const step = (i) => page.locator("div.snap-start").nth(i).getByRole("button");
const decided = async (label) => { await page.getByText(label, { exact: true }).last().waitFor({ timeout: 180000 }); await pause(600); };
const remembered = () => page.getByText("Remembered", { exact: true }).waitFor({ timeout: 180000 });
const top = () => page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
const toResult = () => page.evaluate(() => document.querySelector(".scroll-mt-24")?.scrollIntoView({ behavior: "smooth", block: "start" }));

await page.goto(BASE + "/judge"); await page.waitForLoadState("networkidle"); mark("loaded"); await pause(3000);

// 1. learns from one answer
mark("s1-send"); await step(0).click(); await decided("Paid automatically"); mark("s1-paid"); await pause(5000);
await page.getByPlaceholder(/In your own words/).fill("Diesel is never more than 5. That's too much."); await pause(800);
mark("s1-limit"); await page.getByRole("button", { name: /Too high, limit to/ }).click(); await remembered(); mark("s1-remembered"); await pause(3500);
await top(); await pause(1200); mark("s1-again"); await step(0).click(); await decided("Needs your answer"); mark("s1-asks"); await pause(6000);

// 2. a new wallet
await top(); await pause(1000); mark("s2-send"); await step(1).click(); await decided("Needs your answer"); mark("s2-asks"); await pause(5000);
await page.getByPlaceholder(/In your own words/).fill("That's Mum's new pharmacy, it's fine."); await pause(800);
mark("s2-approve"); await page.getByRole("button", { name: /Approve and pay/ }).click(); await remembered(); mark("s2-remembered"); await pause(4000);
await top(); await pause(1000); mark("s2-again"); await step(1).click(); await decided("Paid automatically"); mark("s2-paid"); await pause(5000);

// 3. manipulative message
await top(); await pause(1000); mark("s3-send"); await Promise.all([page.waitForResponse((r) => r.url().endsWith("/api/request"), { timeout: 180000 }), step(2).click()]); await pause(2500); mark("s3-decided"); await pause(6000);

// 4. safe failure
await top(); await pause(1000); mark("s4-send"); await step(3).click(); await decided("Needs your answer"); mark("s4-decided"); await pause(6000);
await top(); await pause(1500); mark("end");

const path = await page.video().path();
await ctx.close(); await browser.close();
renameSync(path, "raw/judge-live.webm");
writeFileSync("raw/marks.json", JSON.stringify(marks, null, 2));
console.log("saved raw/judge-live.webm");
