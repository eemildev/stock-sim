import {
    pgTable,
    bigserial,
    bigint,
    numeric,
    timestamp,
    unique,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stocks } from "./stocks-schema";
import { portfolios } from "./portfolios-schema";

export const holdings = pgTable("holdings", {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    portfolioId: bigint("portfolio_id", { mode: "number" })
        .notNull()
        .references(() => portfolios.id, { onDelete: "cascade" }),

    stockId: bigint("stock_id", { mode: "number" })
        .notNull()
        .references(() => stocks.id, { onDelete: "restrict" }),

    quantity: numeric("quantity", { precision: 20, scale: 8 })
        .notNull()
        .default("0"),

    avgCost: numeric("avg_cost", { precision: 20, scale: 8 })
        .notNull()
        .default("0"),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    unique("holdings_portfolio_stock_unique").on(
        table.portfolioId,
        table.stockId,
    ),
    index("holdings_portfolio_idx").on(table.portfolioId),
]);

export const holdingRelations = relations(holdings, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [holdings.portfolioId],
        references: [portfolios.id],
    }),
    stock: one(stocks, {
        fields: [holdings.stockId],
        references: [stocks.id],
    }),
}));