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
    bigint,
    date,
    numeric,
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

export const stockPrices = pgTable(
    "stock_prices",
    {
        id: bigint("id", { mode: "number" }).primaryKey(),

        stockId: bigint("stock_id", { mode: "number" })
            .notNull()
            .references(() => stocks.id, {
                onDelete: "cascade",
            }),

        date: date("date").notNull(),

        open: numeric("open", {
            precision: 20,
            scale: 8,
        }),

        high: numeric("high", {
            precision: 20,
            scale: 8,
        }),

        low: numeric("low", {
            precision: 20,
            scale: 8,
        }),

        close: numeric("close", {
            precision: 20,
            scale: 8,
        }),

        volume: bigint("volume", {
            mode: "number",
        }),
    },
    (table) => [
        unique("stock_prices_stock_date_unique").on(
            table.stockId,
            table.date,
        ),
    ],
);