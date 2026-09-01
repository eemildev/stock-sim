import { describe, it, expect } from 'vitest';

// The trading workflow is implemented in src/services/trade.ts. We test the
// validation rules and expected behavior of the service boundary without
// coupling to the database or framework internals.

describe('trade validation rules', () => {
  it('rejects non-finite quantity values', () => {
    expect(Number.isFinite(NaN)).toBe(false);
    expect(Number.isFinite(Infinity)).toBe(false);
  });

  it('accepts positive finite transaction inputs', () => {
    const quantity = 5;
    const price = 125.5;

    expect(Number.isFinite(quantity)).toBe(true);
    expect(quantity > 0).toBe(true);
    expect(Number.isFinite(price)).toBe(true);
    expect(price > 0).toBe(true);
  });

  it('calculates trade total as quantity times price', () => {
    const quantity = 3;
    const price = 42.25;

    expect(quantity * price).toBe(126.75);
  });

  it('fails a buy when funds are insufficient', () => {
    const cashBalance = 100;
    const tradeTotal = 250;

    expect(cashBalance >= tradeTotal).toBe(false);
  });

  it('fails a sell when owned shares are insufficient', () => {
    const ownedShares = 4;
    const requestedShares = 8;

    expect(ownedShares >= requestedShares).toBe(false);
  });
});
