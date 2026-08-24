"use server"

import { db } from "@/db";
import { portfolios } from "@/db/portfolios-schema";
import { and, eq } from "drizzle-orm";
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
            transactions:{
                with: {
                    stock: true,
                }
            }
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

export async function deletePortfolio(
  portfolioId: number,
  userId: string
) {
  return await db
    .delete(portfolios)
    .where(
      and(
        eq(portfolios.id, portfolioId),
        eq(portfolios.userId, userId)
      )
    )
    .returning();
}