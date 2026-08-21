import {
    pgTable,
    bigserial,
    varchar,
    text,
    char,
    boolean,
    timestamp,
    unique,
    index,
} from "drizzle-orm/pg-core";

export const stocks = pgTable(
    "stocks",
    {
        id: bigserial("id", { mode: "number" }).primaryKey(),

        symbol: varchar("symbol", { length: 32 }).notNull(),

        name: text("name").notNull(),

        currency: char("currency", { length: 3 }),

        exchange: varchar("exchange", { length: 32 }),

        micCode: varchar("mic_code", { length: 8 }),

        country: varchar("country", { length: 64 }),

        type: varchar("type", { length: 32 }),

        figiCode: varchar("figi_code", { length: 12 }),

        cfiCode: varchar("cfi_code", { length: 6 }),

        isActive: boolean("is_active").notNull().default(true),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        updatedAt: timestamp("updated_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        unique("stocks_symbol_mic_unique").on(
            table.symbol,
            table.micCode,
        ),

        index("stocks_symbol_idx").on(table.symbol),

        index("stocks_name_idx").on(table.name),

        index("stocks_country_idx").on(table.country),

        index("stocks_exchange_idx").on(table.exchange),
    ],
);