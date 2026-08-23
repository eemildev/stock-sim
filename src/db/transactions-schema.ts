import {
    pgTable,
    bigserial,
    bigint,
    numeric,
    timestamp,
    index,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { stocks } from "./stocks-schema";
import { portfolios } from "./portfolios-schema";

export const transactionTypeEnum = pgEnum("transaction_type", [
    "buy",
    "sell",
]);

export const transactions = pgTable("transactions", {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    portfolioId: bigint("portfolio_id", { mode: "number" })
        .notNull()
        .references(() => portfolios.id, { onDelete: "cascade" }),

    stockId: bigint("stock_id", { mode: "number" })
        .notNull()
        .references(() => stocks.id, { onDelete: "restrict" }),

    type: transactionTypeEnum("type").notNull(),

    quantity: numeric("quantity", { precision: 20, scale: 8 }).notNull(),

    price: numeric("price", { precision: 20, scale: 8 }).notNull(),

    fee: numeric("fee", { precision: 20, scale: 8 })
        .notNull()
        .default("0"),

    executedAt: timestamp("executed_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    index("transactions_portfolio_idx").on(table.portfolioId),
    index("transactions_stock_idx").on(table.stockId),
    index("transactions_executed_at_idx").on(table.executedAt),
]);

export const transactionRelations = relations(transactions, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [transactions.portfolioId],
        references: [portfolios.id],
    }),
    stock: one(stocks, {
        fields: [transactions.stockId],
        references: [stocks.id],
    }),
}));