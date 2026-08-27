import { holdings } from "@/db/holdings-schema"
import { Stock } from "./stocks";

export type Holding = typeof holdings.$inferSelect;

export type HoldingWithStock = typeof holdings.$inferSelect & {
  stock: Stock;
};