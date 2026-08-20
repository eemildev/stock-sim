import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import fs from "node:fs";

import { db } from "./src/db";
import { stocks } from "./src/db/schema";
import { Stock} from "@/types/stock";

type TwelveDataResponse = {
  data: Stock[];
};

async function main() {
  const file = fs.readFileSync("/data/stocks.json", "utf8");

  const json = JSON.parse(file) as TwelveDataResponse;

  const usStocks = json.data.filter(
    (stock) =>
      stock.country === "United States" &&
      stock.type === "Common Stock",
  );

  console.log(`Total: ${json.data.length}`);
  console.log(`US common stocks: ${usStocks.length}`);

  const values = usStocks.map((stock) => ({
    symbol: stock.symbol.trim(),
    name: stock.name.trim(),
    currency: stock.currency?.trim() || null,
    exchange: stock.exchange?.trim() || null,
    micCode: stock.mic_code?.trim() || null,
    country: stock.country?.trim() || null,
    type: stock.type?.trim() || null,
    figiCode: stock.figi_code?.trim() || null,
    cfiCode: stock.cfi_code?.trim() || null,
  }));

  const BATCH_SIZE = 500;

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const batch = values.slice(i, i + BATCH_SIZE);

    await db
      .insert(stocks)
      .values(batch)
      .onConflictDoNothing({
        target: [stocks.symbol, stocks.micCode],
      });

    console.log(
      `Imported ${Math.min(i + BATCH_SIZE, values.length)} / ${values.length}`,
    );
  }

  console.log("Import complete.");
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });