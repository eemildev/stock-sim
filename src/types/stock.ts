import { stocks } from "@/db/stocks-schema"

export type Stock = typeof stocks.$inferSelect;

import { portfolios } from "@/db/portfolios-schema"

export type Portfolio = typeof portfolios.$inferSelect;

import { holdings } from "@/db/holdings-schema"

export type Holding = typeof holdings.$inferSelect;
export type PortfolioWithHoldings = Portfolio & {
  holdings: Holding[];
};

export type TimeSeries = {
  meta: {
    "symbol": string,
    "currency": string,
    "exchangeTimezone": string,
    "exchange": string,
    "micCode": string,
    "type": string
  }
  values: Values;

}
export type Values = 
  {
    "datetime": string,
    "open": string,
    "high": string,
    "low": string,
    "close": string,
    "volume"?: string
  }[]


export type Quote = {
  "c": number, // Current price
  "d": number, // Change
  "dp": number, // Percent change
  "h": number, // High price of the day
  "l": number, // Low price of the day
  "o": number, // Open price of the day
  "pc": number, // Previous close price
  "t": number // Timestamp
}
