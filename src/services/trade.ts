import { db } from "@/db";
import { portfolios } from "@/db/portfolios-schema";
import { transactions } from "@/db/transactions-schema";
import { holdings } from "@/db/holdings-schema";

import { and, eq, sql } from "drizzle-orm";

type TradeType = "buy" | "sell";

type StockTrade = {
  userId: string;
  portfolioId: number;
  stockId: number;
  quantity: number;
  price: number;
  type: TradeType;
};

export async function executeStockTrade({
  userId,
  portfolioId,
  stockId,
  quantity,
  price,
  type,
}: StockTrade) {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("Invalid quantity");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Invalid price");
  }

  await db.transaction(async (tx) => {
    // Verify that the portfolio belongs to the user
    const portfolio = await tx.query.portfolios.findFirst({
      where: and(
        eq(portfolios.id, portfolioId),
        eq(portfolios.userId, userId)
      ),
    });

    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    if (type === "buy") {
      // Deduct cash atomically — total computed in SQL to avoid JS float error
      const updatedPortfolio = await tx
        .update(portfolios)
        .set({
          cashBalance: sql`${portfolios.cashBalance} - (${quantity} * ${price})`,
        })
        .where(
          and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.userId, userId),
            sql`${portfolios.cashBalance} >= (${quantity} * ${price})`
          )
        )
        .returning({ id: portfolios.id });

      if (updatedPortfolio.length === 0) {
        throw new Error("Insufficient funds");
      }

      // Upsert holding — avoids race where two concurrent buys both see
      // "no holding" and both insert, splitting the position into two rows.
      // Requires a unique index on (portfolioId, stockId).
      await tx
        .insert(holdings)
        .values({
          portfolioId,
          stockId,
          quantity: quantity.toString(),
        })
        .onConflictDoUpdate({
          target: [holdings.portfolioId, holdings.stockId],
          set: {
            quantity: sql`${holdings.quantity} + ${quantity}`,
          },
        });
    }

    if (type === "sell") {
      // Make sure user owns enough shares — guard is atomic, no separate read needed
      const updatedHolding = await tx
        .update(holdings)
        .set({
          quantity: sql`${holdings.quantity} - ${quantity}`,
        })
        .where(
          and(
            eq(holdings.portfolioId, portfolioId),
            eq(holdings.stockId, stockId),
            sql`${holdings.quantity} >= ${quantity}`
          )
        )
        .returning({ id: holdings.id });

      if (updatedHolding.length === 0) {
        throw new Error("You don't own enough shares of this stock");
      }

      // Add cash — total computed in SQL to avoid JS float error
      await tx
        .update(portfolios)
        .set({
          cashBalance: sql`${portfolios.cashBalance} + (${quantity} * ${price})`,
        })
        .where(
          and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.userId, userId)
          )
        );

      // Clean up zero-quantity holdings so they don't clutter reads
      await tx
        .delete(holdings)
        .where(
          and(
            eq(holdings.portfolioId, portfolioId),
            eq(holdings.stockId, stockId),
            sql`${holdings.quantity} = 0`
          )
        );
    }

    // Record transaction
    await tx.insert(transactions).values({
      portfolioId,
      stockId,
      type,
      quantity: quantity.toString(),
      price: price.toString(),
    });
  });
}