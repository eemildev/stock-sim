"use server"

import { db } from "@/db";
import { stocks } from "@/db/stocks-schema";
import { count, or, ilike, eq } from "drizzle-orm";

export const getStocks = async (
  searchQuery: string,
  page: number,
  size: number,
) => {
  const search = `%${searchQuery}%`;

  const whereClause = or(
    ilike(stocks.symbol, search),
    ilike(stocks.name, search),
  );

  const [data, totalCount] = await Promise.all([
    db.query.stocks.findMany({
      where: whereClause,
      offset: (page - 1) * size,
      limit: size,
    }),
    db
      .select({ count: count() })
      .from(stocks)
      .where(whereClause)
      .then((res) => res[0].count),
  ]);

 
  return { data, count: totalCount };
}; 

export const getStockBySymbol = async (symbol: string) => {
    return await db.query.stocks.findFirst({
      where: eq(stocks.symbol, symbol.toUpperCase())
    });
  }

import { MarketDataApi, CreateConfig, TwelvedataApiError } from "@twelvedata/twelvedata-node";
import { unstable_cache } from "next/cache";
const config = CreateConfig(process.env.TWELVEDATA_SECRET);
const api = new MarketDataApi(config);

export const getTimeSeries = unstable_cache(
  async (symbol: string) => {
    try {
      return await api.getTimeSeries({
        symbol,
        interval: "1day",
        outputsize: 365,
      });
    } catch (error) {
      if (error instanceof TwelvedataApiError) {
        console.error("API error:", error);
        throw new Error(error.message || "TwelveData API Error");
      }
      console.error("Unexpected error:", error);
      throw new Error("Internal Server Error");
    }
  },
  ["time-series"], // cache key prefix
  { revalidate: 43200 } // 12 hours
);

export const getQuote = async (symbol: string) => {
  const symbolUpper = symbol.toUpperCase();
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbolUpper}&token=${process.env.FINNHUB_API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`Finnhub API error: ${response.status}`);
  }
  return await response.json();
};
