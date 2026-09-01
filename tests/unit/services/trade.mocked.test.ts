import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockDb } = vi.hoisted(() => ({
  mockDb: {
    transaction: vi.fn(),
  },
}));

vi.mock('@/db', () => ({
  db: mockDb,
}));

import { executeStockTrade } from '@/services/trade';

describe('executeStockTrade', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes a buy order and records the transaction', async () => {
    const tx = {
      query: {
        portfolios: {
          findFirst: vi.fn().mockResolvedValue({ id: 123, userId: 'user-1', cashBalance: '5000' }),
        },
      },
      update: vi.fn((table) => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ id: 123 }]),
          })),
        })),
      })),
      insert: vi.fn((table) => ({
        values: vi.fn(() => ({
          onConflictDoUpdate: vi.fn().mockResolvedValue(undefined),
        })),
      })),
    };

    mockDb.transaction.mockImplementation(async (callback) => callback(tx));

    await expect(
      executeStockTrade({
        userId: 'user-1',
        portfolioId: 123,
        stockId: 456,
        quantity: 2,
        price: 10,
        type: 'buy',
      })
    ).resolves.toBeUndefined();

    expect(tx.query.portfolios.findFirst).toHaveBeenCalled();
    expect(tx.update).toHaveBeenCalled();
    expect(tx.insert).toHaveBeenCalledTimes(2);
  });

  it('completes a sell order and removes the holding when fully liquidated', async () => {
    const tx = {
      query: {
        portfolios: {
          findFirst: vi.fn().mockResolvedValue({ id: 123, userId: 'user-1', cashBalance: '5000' }),
        },
      },
      update: vi.fn((table) => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([{ id: 99, remainingQty: '0' }]),
          })),
        })),
      })),
      insert: vi.fn((table) => ({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn(),
        }),
      })),
      delete: vi.fn((table) => ({
        where: vi.fn().mockResolvedValue(undefined),
      })),
    };

    mockDb.transaction.mockImplementation(async (callback) => callback(tx));

    await expect(
      executeStockTrade({
        userId: 'user-1',
        portfolioId: 123,
        stockId: 456,
        quantity: 2,
        price: 10,
        type: 'sell',
      })
    ).resolves.toBeUndefined();

    expect(tx.update).toHaveBeenCalled();
    expect(tx.delete).toHaveBeenCalled();
  });

  it('rejects a buy when the portfolio has insufficient funds', async () => {
    const tx = {
      query: {
        portfolios: {
          findFirst: vi.fn().mockResolvedValue({ id: 123, userId: 'user-1', cashBalance: '50' }),
        },
      },
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([]),
          })),
        })),
      })),
      insert: vi.fn(),
    };

    mockDb.transaction.mockImplementation(async (callback) => callback(tx));

    await expect(
      executeStockTrade({
        userId: 'user-1',
        portfolioId: 123,
        stockId: 456,
        quantity: 10,
        price: 20,
        type: 'buy',
      })
    ).rejects.toThrow('Insufficient funds');
  });

  it('rejects a sell when the user does not own enough shares', async () => {
    const tx = {
      query: {
        portfolios: {
          findFirst: vi.fn().mockResolvedValue({ id: 123, userId: 'user-1', cashBalance: '500' }),
        },
      },
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn().mockResolvedValue([]),
          })),
        })),
      })),
      insert: vi.fn(),
      delete: vi.fn(),
    };

    mockDb.transaction.mockImplementation(async (callback) => callback(tx));

    await expect(
      executeStockTrade({
        userId: 'user-1',
        portfolioId: 123,
        stockId: 456,
        quantity: 10,
        price: 20,
        type: 'sell',
      })
    ).rejects.toThrow("You don't own enough shares of this stock");
  });

  it('rejects invalid quantities and prices before touching the database', async () => {
    await expect(
      executeStockTrade({
        userId: 'user-1',
        portfolioId: 123,
        stockId: 456,
        quantity: 0,
        price: 10,
        type: 'buy',
      })
    ).rejects.toThrow('Invalid quantity');

    await expect(
      executeStockTrade({
        userId: 'user-1',
        portfolioId: 123,
        stockId: 456,
        quantity: 5,
        price: 0,
        type: 'buy',
      })
    ).rejects.toThrow('Invalid price');

    expect(mockDb.transaction).not.toHaveBeenCalled();
  });
});
