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

export async function getPortfolioById(portfolioId: number) {
    return await db.query.portfolios.findFirst({
        where: eq(portfolios.id, portfolioId),
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

export async function updatePortfolioCashBalance(portfolioId: number, totalCost: string) {
    const portfolio = await getPortfolioById(portfolioId); // Ensure the portfolio exists before updating

    if (!portfolio) {
        throw new Error(`Portfolio with ID ${portfolioId} not found`);
    }

    const cashBalance = (Number(portfolio.cashBalance) + Number(totalCost)).toString();

    return await db.update(portfolios).set({
        cashBalance: cashBalance,
    }).where(
        eq(portfolios.id, portfolioId)
    );
}

export async function getPortfolioForUser(portfolioId: number, userId: string) {
    const [portfolio] = await db
        .select()
        .from(portfolios)
        .where(eq(portfolios.id, portfolioId));

    if (!portfolio || portfolio.userId !== userId) {
        return null;
    }
    return portfolio;
}