import {
    pgTable,
    bigserial,
    varchar,
    char,
    text,
    numeric,
    timestamp,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema"; 
import { holdings } from "./holdings-schema";
import { transactions } from "./transactions-schema";

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

export const portfolioRelations = relations(portfolios, ({ one, many }) => ({
    user: one(user, {
        fields: [portfolios.userId],
        references: [user.id],
    }),
    holdings: many(holdings),
    transactions: many(transactions),
}));