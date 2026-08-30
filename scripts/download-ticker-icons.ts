import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import fs from "node:fs/promises";
import path from "node:path";

import { db } from "./db";

const outputDir = path.join(process.cwd(), "public/ticker_icons");

const CONCURRENCY = 10;

async function downloadLogo(symbol: string) {
  const filePath = path.join(outputDir, `${symbol}.png`);

  try {
    await fs.access(filePath);
    return "exists";
  } catch {}

  const url =
    `https://img.logo.dev/ticker/${encodeURIComponent(symbol)}` +
    `?token=${process.env.LOGO_DEV_TOKEN}`;

  try {
    const response = await fetch(url);

    if (response.status === 429) {
      console.log(`⏳ ${symbol}: rate limited`);

      await new Promise((resolve) => setTimeout(resolve, 10_000));

      return "rate-limited";
    }

    if (!response.ok) {
      console.log(`✗ ${symbol}: HTTP ${response.status}`);
      return "failed";
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    await fs.writeFile(filePath, buffer);

    console.log(`✓ ${symbol}`);

    return "downloaded";
  } catch (error) {
    console.log(`✗ ${symbol}: failed`, error);
    return "failed";
  }
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const stocks = await db.query.stocks.findMany({
    columns: {
      symbol: true,
    },
  });

  // Remove duplicate symbols
  const symbols = [
    ...new Set(
      stocks.map((stock) => stock.symbol.trim().toUpperCase()),
    ),
  ];

  console.log(`Found ${symbols.length} unique symbols`);

  let index = 0;

  async function worker() {
    while (index < symbols.length) {
      const currentIndex = index++;
      const symbol = symbols[currentIndex];

      await downloadLogo(symbol);
    }
  }

  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker()),
  );

  console.log("Logo download complete.");
}

main().catch((error) => {
  console.error("Download failed:", error);
  process.exit(1);
});