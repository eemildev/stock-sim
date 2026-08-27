
import { portfolios } from "@/db/portfolios-schema"
import { Holding } from "./holdings";

export type Portfolio = typeof portfolios.$inferSelect;

export type PortfolioWithHoldings = Portfolio & {
  holdings: Holding[];
};