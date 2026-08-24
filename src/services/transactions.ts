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