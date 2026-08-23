"use server"

import { db } from "@/db";
import { transactions } from "@/db/transactions-schema";
import { eq } from "drizzle-orm";

export async function getTransactionsByPortfolioId(portfolioId: number) {
    return await db.query.transactions.findMany({
        where: eq(transactions.portfolioId, portfolioId),
        with: {
            stock: true,
        }
    });
}

export async function addTransaction(
    portfolioId: number,
    stockId: number,
    type: "buy" | "sell",
    quantity: string,
    price: string,
) {
    return await db
        .insert(transactions)
        .values({
            portfolioId,
            stockId,
            type,
            quantity,
            price,
        })
        .returning();
}
