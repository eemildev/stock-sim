import "server-only";

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";

import * as stocksSchema from "./stocks-schema";
import * as authSchema from "./auth-schema";
import * as portfoliosSchema from "./portfolios-schema";
import * as holdingsSchema from "./holdings-schema";
import * as transactionsSchema from "./transactions-schema";

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