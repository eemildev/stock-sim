"use server"

import { db } from "@/db";
import { holdings } from "@/db/holdings-schema";
import { eq } from "drizzle-orm";

export async function getHoldingsByPortfolioId(portfolioId: number) {
    return await db.query.holdings.findMany({
        where: eq(holdings.portfolioId, portfolioId),
        with: {
            stock: true,
        }
    });
}