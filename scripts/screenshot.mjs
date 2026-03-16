// scripts/screenshot.mjs
// Usage: npm run screenshot [url] [filename]
// Examples:
//   npm run screenshot
//   npm run screenshot http://localhost:3000/shop shop
//   npm run screenshot http://localhost:3000/about about

import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const CHROME_PATH =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const SCREENSHOTS_DIR = resolve(process.cwd(), ".screenshots");

const url = process.argv[2] ?? "http://localhost:3000";
const name = process.argv[3] ?? "screenshot";
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const filename = `${name}-${timestamp}.png`;

await mkdir(SCREENSHOTS_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2" });

const outputPath = resolve(SCREENSHOTS_DIR, filename);
await page.screenshot({ path: outputPath, fullPage: true });

await browser.close();

console.log(`Screenshot saved: ${outputPath}`);
