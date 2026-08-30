import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as stocksSchema from "../src/db/stocks-schema";
import * as authSchema from "../src/db/auth-schema";
import * as portfoliosSchema from "../src/db/portfolios-schema";
import * as holdingsSchema from "../src/db/holdings-schema";
import * as transactionsSchema from "../src/db/transactions-schema";

config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
  client: pool,
  schema: {
    ...stocksSchema,
    ...authSchema,
    ...portfoliosSchema,
    ...holdingsSchema,
    ...transactionsSchema,
  },
  logger: true,
});