CREATE TABLE "stock_prices" (
	"id" bigint PRIMARY KEY NOT NULL,
	"stock_id" bigint NOT NULL,
	"date" date NOT NULL,
	"open" numeric(20, 8),
	"high" numeric(20, 8),
	"low" numeric(20, 8),
	"close" numeric(20, 8),
	"volume" bigint,
	CONSTRAINT "stock_prices_stock_date_unique" UNIQUE("stock_id","date")
);
--> statement-breakpoint
CREATE TABLE "stocks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"symbol" varchar(32) NOT NULL,
	"name" text NOT NULL,
	"currency" char(3),
	"exchange" varchar(32),
	"mic_code" varchar(8),
	"country" varchar(64),
	"type" varchar(32),
	"figi_code" varchar(12),
	"cfi_code" varchar(6),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stocks_symbol_mic_unique" UNIQUE("symbol","mic_code")
);
--> statement-breakpoint
ALTER TABLE "stock_prices" ADD CONSTRAINT "stock_prices_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stocks_symbol_idx" ON "stocks" USING btree ("symbol");--> statement-breakpoint
CREATE INDEX "stocks_name_idx" ON "stocks" USING btree ("name");--> statement-breakpoint
CREATE INDEX "stocks_country_idx" ON "stocks" USING btree ("country");--> statement-breakpoint
CREATE INDEX "stocks_exchange_idx" ON "stocks" USING btree ("exchange");