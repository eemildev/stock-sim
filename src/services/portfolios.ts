"use server"

import { db } from "@/db";
import { portfolios } from "@/db/portfolios-schema";
import { eq } from "drizzle-orm";
import { getAuthenticatedUserId } from "./user";

export async function getPortfolios() {
    const userId = await getAuthenticatedUserId();

    return await db.query.portfolios.findMany({
        where: eq(portfolios.userId, userId),
    });
}

export async function getPortfoliosWithTransactions() {
    const userId = await getAuthenticatedUserId();

    return await db.query.portfolios.findMany({
        where: eq(portfolios.userId, userId),
        with: {
            transactions: true,
        },
    });
}

export async function getPortfoliosWithHoldings() {
    const userId = await getAuthenticatedUserId();

    return await db.query.portfolios.findMany({
        where: eq(portfolios.userId, userId),
        with: {
            holdings: true,
        },
    });
}

export async function addPortfolio(userId: string, name: string, cashBalance: string) {
    return await db.insert(portfolios).values({
        userId,
        name,
        cashBalance,
    }).returning();
}