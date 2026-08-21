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
