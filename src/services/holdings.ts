"use server"

import { db } from "@/db";
import { holdings } from "@/db/holdings-schema";
import { and, eq } from "drizzle-orm";

export async function getHoldingsByPortfolioId(portfolioId: number) {
    return await db.query.holdings.findMany({
        where: eq(holdings.portfolioId, portfolioId),
        with: {
            stock: true,
        }
    });
}

export async function buyHolding(
    portfolioId: number,
    stockId: number,
    purchaseQuantity: string,
    purchasePrice: string,
) {
    const existing = await db.query.holdings.findFirst({
        where: and(
            eq(holdings.portfolioId, portfolioId),
            eq(holdings.stockId, stockId)
        ),
    });

    const newQty = Number(purchaseQuantity);
    const newPrice = Number(purchasePrice);

    if (!existing) {
        // No existing position — just insert as-is
        return await db
            .insert(holdings)
            .values({
                portfolioId,
                stockId,
                quantity: purchaseQuantity,
                avgCost: purchasePrice,
            })
            .returning();
    }

    const existingQty = Number(existing.quantity);
    const existingAvgCost = Number(existing.avgCost);

    const totalQty = existingQty + newQty;
    // Weighted average cost basis
    const totalAvgCost =
        (existingQty * existingAvgCost + newQty * newPrice) / totalQty;

    return await db
        .update(holdings)
        .set({
            quantity: totalQty.toString(),
            avgCost: totalAvgCost.toString(),
        })
        .where(
            and(
                eq(holdings.portfolioId, portfolioId),
                eq(holdings.stockId, stockId)
            )
        )
        .returning();
}

export async function sellHolding(
    portfolioId: number,
    stockId: number,
    sellQuantity: string,
) {
    const existing = await db.query.holdings.findFirst({
        where: and(
            eq(holdings.portfolioId, portfolioId),
            eq(holdings.stockId, stockId)
        ),
    });

    if (!existing) {
        throw new Error("No holding found to sell");
    }

    const existingQty = Number(existing.quantity);
    const qtyToSell = Number(sellQuantity);

    if (qtyToSell <= 0) {
        throw new Error("Sell quantity must be positive");
    }

    if (qtyToSell > existingQty) {
        throw new Error("Cannot sell more shares than currently held");
    }

    const remainingQty = existingQty - qtyToSell;

    if (remainingQty === 0) {
        // Fully liquidated — remove the holding
        return await db
            .delete(holdings)
            .where(
                and(
                    eq(holdings.portfolioId, portfolioId),
                    eq(holdings.stockId, stockId)
                )
            )
            .returning();
    }

    // avgCost stays the same — selling doesn't change cost basis of remaining shares
    return await db
        .update(holdings)
        .set({
            quantity: remainingQty.toString(),
        })
        .where(
            and(
                eq(holdings.portfolioId, portfolioId),
                eq(holdings.stockId, stockId)
            )
        )
        .returning();
}