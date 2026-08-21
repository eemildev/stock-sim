import {
    pgTable,
    bigserial,
    varchar,
    char,
    text,
    bigint,
    numeric,
    timestamp,
    unique,
    index,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema"; 
import { stocks } from "./stocks-schema"; 

export const transactionTypeEnum = pgEnum("transaction_type", [
    "buy",
    "sell",
]);

export const portfolios = pgTable("portfolios", {
    id: bigserial("id", { mode: "number" }).primaryKey(),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 128 }).notNull().default("Main"),

    cashBalance: numeric("cash_balance", { precision: 20, scale: 8 })
        .notNull()
        .default("0"),

    baseCurrency: char("base_currency", { length: 3 })
        .notNull()
        .default("USD"),

    createdAt: timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    index("portfolios_user_idx").on(table.userId),
]);

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

export const portfolioRelations = relations(portfolios, ({ one, many }) => ({
    user: one(user, {
        fields: [portfolios.userId],
        references: [user.id],
    }),
    holdings: many(holdings),
    transactions: many(transactions),
}));

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