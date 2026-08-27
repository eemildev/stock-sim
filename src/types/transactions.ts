import { transactions } from "@/db/transactions-schema";
import { Stock } from "@/types/stocks";

export type Transaction = typeof transactions.$inferSelect & {
  stock: Stock;
};
