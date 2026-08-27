"use server"

import { db } from "@/db";
import { holdings } from "@/db/holdings-schema";
import { portfolios } from "@/db/portfolios-schema";
import { and, eq } from "drizzle-orm";

export async function getHoldingsByPortfolioId(portfolioId: number, userId: string) {
    const portfolio = await db.query.portfolios.findFirst({
        where: and(
            eq(portfolios.id, portfolioId),
            eq(portfolios.userId, userId),
        ),
    });

    if (!portfolio) {
        return [];
    }

    return await db.query.holdings.findMany({
        where: eq(holdings.portfolioId, portfolioId),
        with: {
            stock: true,
        }
    });
}