import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { and, eq } from 'drizzle-orm';

import * as authSchema from '@/db/auth-schema';
import * as stocksSchema from '@/db/stocks-schema';
import * as portfoliosSchema from '@/db/portfolios-schema';
import * as holdingsSchema from '@/db/holdings-schema';
import * as transactionsSchema from '@/db/transactions-schema';

import { executeStockTrade } from '@/services/trade';

const testDatabaseUrl = process.env.TEST_DATABASE_URL ?? process.env.test_database_url;
const describeIfDb = testDatabaseUrl ? describe : describe.skip;

describeIfDb('executeStockTrade (real PostgreSQL integration)', () => {
    const schema = {
        ...authSchema,
        ...stocksSchema,
        ...portfoliosSchema,
        ...holdingsSchema,
        ...transactionsSchema,
    } as const;

    let db: ReturnType<typeof drizzle<typeof schema>>;
    let userId: string;
    let portfolioId: number;
    let stockId: number;

    let pool: Pool;


    beforeEach(async () => {
        pool = new Pool({ connectionString: testDatabaseUrl! });
        db = drizzle<typeof schema>({
            client: pool,
            schema,
        });

        afterAll(async () => {
            await pool.end();
        });

        const testSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        userId = `user-${testSuffix}`;

        await db.insert(authSchema.user).values({
            id: userId,
            name: 'Integration Test User',
            email: `${userId}@example.com`,
            emailVerified: false,
        });

        const stockInsert = await db.insert(stocksSchema.stocks).values({
            symbol: `IT${testSuffix.slice(0, 5).toUpperCase()}`,
            name: 'Integration Test Stock',
            currency: 'USD',
            exchange: 'NASDAQ',
            isActive: true,
        }).returning({ id: stocksSchema.stocks.id });

        stockId = stockInsert[0].id;

        const portfolioInsert = await db.insert(portfoliosSchema.portfolios).values({
            userId,
            name: 'Integration Test Portfolio',
            cashBalance: '5000',
            baseCurrency: 'USD',
        }).returning({ id: portfoliosSchema.portfolios.id });

        portfolioId = portfolioInsert[0].id;
    });

    afterEach(async () => {
        if (!db || !portfolioId) return;

        await db.delete(transactionsSchema.transactions)
            .where(eq(transactionsSchema.transactions.portfolioId, portfolioId));

        await db.delete(holdingsSchema.holdings)
            .where(eq(holdingsSchema.holdings.portfolioId, portfolioId));

        await db.delete(portfoliosSchema.portfolios)
            .where(eq(portfoliosSchema.portfolios.id, portfolioId));

        if (stockId) {
            await db.delete(stocksSchema.stocks)
                .where(eq(stocksSchema.stocks.id, stockId));
        }

        if (userId) {
            await db.delete(authSchema.user)
                .where(eq(authSchema.user.id, userId));
        }
    });

    it('buys stock and writes the expected portfolio, holding, and transaction state', async () => {
        await executeStockTrade({
            userId,
            portfolioId,
            stockId,
            quantity: 2,
            price: 10,
            type: 'buy',
        });

        const updatedPortfolio = await db.query.portfolios.findFirst({
            where: eq(portfoliosSchema.portfolios.id, portfolioId),
        });

        const holding = await db.query.holdings.findFirst({
            where: and(
                eq(holdingsSchema.holdings.portfolioId, portfolioId),
                eq(holdingsSchema.holdings.stockId, stockId),
            ),
        });

        const transactions = await db.query.transactions.findMany({
            where: eq(transactionsSchema.transactions.portfolioId, portfolioId),
        });

        expect(updatedPortfolio?.cashBalance).toBe('4980.00000000');
        expect(holding?.quantity).toBe('2.00000000');
        expect(transactions).toHaveLength(1);
        expect(transactions[0]?.type).toBe('buy');
        expect(transactions[0]?.quantity).toBe('2.00000000');
        expect(transactions[0]?.price).toBe('10.00000000');
    });

    it('updates an existing holding when a user buys more shares', async () => {
        await db.insert(holdingsSchema.holdings).values({
            portfolioId,
            stockId,
            quantity: '5',
            avgCost: '10',
        });

        await executeStockTrade({
            userId,
            portfolioId,
            stockId,
            quantity: 2,
            price: 10,
            type: 'buy',
        });

        const holding = await db.query.holdings.findFirst({
            where: and(
                eq(holdingsSchema.holdings.portfolioId, portfolioId),
                eq(holdingsSchema.holdings.stockId, stockId),
            ),
        });

        expect(holding?.quantity).toBe('7.00000000');
    });

    it('sells part of a holding and keeps the remaining shares', async () => {
        await db.insert(holdingsSchema.holdings).values({
            portfolioId,
            stockId,
            quantity: '10',
            avgCost: '10',
        });

        await executeStockTrade({
            userId,
            portfolioId,
            stockId,
            quantity: 4,
            price: 10,
            type: 'sell',
        });

        const holding = await db.query.holdings.findFirst({
            where: and(
                eq(holdingsSchema.holdings.portfolioId, portfolioId),
                eq(holdingsSchema.holdings.stockId, stockId),
            ),
        });

        const portfolio = await db.query.portfolios.findFirst({
            where: eq(portfoliosSchema.portfolios.id, portfolioId),
        });

        expect(holding?.quantity).toBe('6.00000000');
        expect(portfolio?.cashBalance).toBe('5040.00000000');
    });

    it('sells all shares and removes the holding row', async () => {
        await db.insert(holdingsSchema.holdings).values({
            portfolioId,
            stockId,
            quantity: '10',
            avgCost: '10',
        });

        await executeStockTrade({
            userId,
            portfolioId,
            stockId,
            quantity: 10,
            price: 10,
            type: 'sell',
        });

        const holding = await db.query.holdings.findFirst({
            where: and(
                eq(holdingsSchema.holdings.portfolioId, portfolioId),
                eq(holdingsSchema.holdings.stockId, stockId),
            ),
        });

        const portfolio = await db.query.portfolios.findFirst({
            where: eq(portfoliosSchema.portfolios.id, portfolioId),
        });

        const transactions = await db.query.transactions.findMany({
            where: eq(transactionsSchema.transactions.portfolioId, portfolioId),
        });

        expect(holding).toBeUndefined();
        expect(portfolio?.cashBalance).toBe('5100.00000000');
        expect(transactions.some((tx: { type: string }) => tx.type === 'sell')).toBe(true);
    });

    it('aborts a buy when the portfolio has insufficient funds', async () => {
        await db.update(portfoliosSchema.portfolios)
            .set({ cashBalance: '10' })
            .where(eq(portfoliosSchema.portfolios.id, portfolioId));

        await expect(
            executeStockTrade({
                userId,
                portfolioId,
                stockId,
                quantity: 2,
                price: 10,
                type: 'buy',
            }),
        ).rejects.toThrow('Insufficient funds');

        const portfolio = await db.query.portfolios.findFirst({
            where: eq(portfoliosSchema.portfolios.id, portfolioId),
        });

        const holding = await db.query.holdings.findFirst({
            where: and(
                eq(holdingsSchema.holdings.portfolioId, portfolioId),
                eq(holdingsSchema.holdings.stockId, stockId),
            ),
        });

        const transactions = await db.query.transactions.findMany({
            where: eq(transactionsSchema.transactions.portfolioId, portfolioId),
        });

        expect(portfolio?.cashBalance).toBe('10.00000000');
        expect(holding).toBeUndefined();
        expect(transactions).toHaveLength(0);
    });

    it('aborts a sell when the user does not own enough shares', async () => {
        await expect(
            executeStockTrade({
                userId,
                portfolioId,
                stockId,
                quantity: 2,
                price: 10,
                type: 'sell',
            }),
        ).rejects.toThrow("You don't own enough shares of this stock");

        const portfolio = await db.query.portfolios.findFirst({
            where: eq(portfoliosSchema.portfolios.id, portfolioId),
        });

        const transactions = await db.query.transactions.findMany({
            where: eq(transactionsSchema.transactions.portfolioId, portfolioId),
        });

        expect(portfolio?.cashBalance).toBe('5000.00000000');
        expect(transactions).toHaveLength(0);
    });

    it('rejects trades for a portfolio that belongs to another user', async () => {
        const otherUserId = `other-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await db.insert(authSchema.user).values({
            id: otherUserId,
            name: 'Other User',
            email: `${otherUserId}@example.com`,
            emailVerified: false,
        });

        const otherPortfolio = await db.insert(portfoliosSchema.portfolios).values({
            userId: otherUserId,
            name: 'Other Portfolio',
            cashBalance: '2000',
            baseCurrency: 'USD',
        }).returning({ id: portfoliosSchema.portfolios.id });

        await expect(
            executeStockTrade({
                userId,
                portfolioId: otherPortfolio[0].id,
                stockId,
                quantity: 1,
                price: 10,
                type: 'buy',
            }),
        ).rejects.toThrow('Portfolio not found');

        const rows = await db.query.transactions.findMany({
            where: eq(transactionsSchema.transactions.portfolioId, otherPortfolio[0].id),
        });

        expect(rows).toHaveLength(0);

        await db.delete(portfoliosSchema.portfolios)
            .where(eq(portfoliosSchema.portfolios.id, otherPortfolio[0].id));

        await db.delete(authSchema.user)
            .where(eq(authSchema.user.id, otherUserId));
    });
});
