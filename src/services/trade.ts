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
    // 1. Verify portfolio ownership
    const portfolio = await tx.query.portfolios.findFirst({
      where: and(
        eq(portfolios.id, portfolioId),
        eq(portfolios.userId, userId)
      ),
    });

    if (!portfolio) {
      throw new Error("Portfolio not found");
    }

    const tradeTotal = quantity * price;

    if (type === "buy") {
      // 2. Deduct cash atomically
      const updatedPortfolio = await tx
        .update(portfolios)
        .set({
          cashBalance: sql`${portfolios.cashBalance} - ${tradeTotal}::numeric`,
        })
        .where(
          and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.userId, userId),
            sql`${portfolios.cashBalance} >= ${tradeTotal}::numeric`
          )
        )
        .returning({ id: portfolios.id });

      if (updatedPortfolio.length === 0) {
        throw new Error("Insufficient funds");
      }

      // 3. Upsert holding with proper SQL casting
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
            quantity: sql`${holdings.quantity} + ${quantity}::numeric`,
          },
        });
    }

    if (type === "sell") {
      // 2. Atomic update holding balance
      const updatedHolding = await tx
        .update(holdings)
        .set({
          quantity: sql`${holdings.quantity} - ${quantity}::numeric`,
        })
        .where(
          and(
            eq(holdings.portfolioId, portfolioId),
            eq(holdings.stockId, stockId),
            sql`${holdings.quantity} >= ${quantity}::numeric`
          )
        )
        .returning({ 
          id: holdings.id, 
          remainingQty: holdings.quantity 
        });

      if (updatedHolding.length === 0) {
        throw new Error("You don't own enough shares of this stock");
      }

      // 3. Add cash to balance
      await tx
        .update(portfolios)
        .set({
          cashBalance: sql`${portfolios.cashBalance} + ${tradeTotal}::numeric`,
        })
        .where(
          and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.userId, userId)
          )
        );

      // 4. Safely purge empty holding row if fully liquidated
      if (Number(updatedHolding[0].remainingQty) === 0) {
        await tx
          .delete(holdings)
          .where(eq(holdings.id, updatedHolding[0].id));
      }
    }

    // 4. Record transaction log
    await tx.insert(transactions).values({
      portfolioId,
      stockId,
      type,
      quantity: quantity.toString(),
      price: price.toString(),
    });
  });
}