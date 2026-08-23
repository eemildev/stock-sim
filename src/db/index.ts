import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

import * as stocksSchema from "./stocks-schema";
import * as authSchema from "./auth-schema";
import * as portfoliosSchema from "./portfolios-schema";
import * as holdingsSchema from "./holdings-schema";
import * as transactionsSchema from "./transactions-schema";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({
    client: sql, schema: {
        ...stocksSchema,
        ...authSchema,
        ...portfoliosSchema,
        ...holdingsSchema,
        ...transactionsSchema
    }, logger: true
});