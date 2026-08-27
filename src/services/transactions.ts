"use server"

import { db } from "@/db";
import { transactions } from "@/db/transactions-schema";
import { portfolios } from "@/db/portfolios-schema";
import { and, eq } from "drizzle-orm";

export async function getTransactionsByPortfolioId(portfolioId: number, userId: string) {
        const portfolio = await db.query.portfolios.findFirst({
            where: and(
                eq(portfolios.id, portfolioId),
                eq(portfolios.userId, userId),
            ),
        });
    
        if (!portfolio) {
            return [];
        }
        
    return await db.query.transactions.findMany({
        where: eq(transactions.portfolioId, portfolioId),
        with: {
            stock: true,
        }
    });
}