import { Quote } from "@/types/stocks";
import { HoldingWithStock } from "@/types/holdings";
import { Transaction } from "@/types/transactions";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

export function HoldingsTable({
  holdingsWithQuotes,
  holdingsValue,
  transactions,
  percentage,
}: {
  holdingsWithQuotes: {
    holding: HoldingWithStock;
    quote: Quote;
  }[];
  transactions: Transaction[];
  holdingsValue: number;
  percentage: number;
}) {
  function calculateProfitPercentage(holding: HoldingWithStock, quote: Quote): number {
    const transactionsForStock = transactions.filter(
      (transaction) => transaction.stockId === holding.stockId,
    );
    const totalCost = transactionsForStock.reduce((acc, transaction) => {
      if (transaction.type === "buy") {
        return acc + Number(transaction.quantity) * Number(transaction.price);
      } else {
        return acc - Number(transaction.quantity) * Number(transaction.price);
      }
    }, 0);
    const profit = Number(holding.quantity) * quote?.c - totalCost;
    const percentage = (profit / totalCost) * 100;
    if (percentage === Infinity || isNaN(percentage)) {
      return 0;
    }
    return percentage;
  }

  return (
    <div>
    <Label className="text-lg font-semibold">Your Holdings</Label>
    <Table>
      <TableCaption>A list of your holdings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Value</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Profit</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdingsWithQuotes.map(({ holding, quote }) => (
          <TableRow key={holding.id}>
            <TableCell className="font-medium">
              ${(Number(holding.quantity) * quote?.c).toFixed(2)}
            </TableCell>

            <TableCell>{holding.stock.name}</TableCell>

            <TableCell className={ calculateProfitPercentage(holding, quote) < 0 ? "text-red-500" : "text-green-500" }>
              {calculateProfitPercentage(holding, quote).toFixed(2)}%
            </TableCell>

            <TableCell>{Number(holding.quantity).toFixed(0)}</TableCell>

            <TableCell className="text-right">${quote?.c}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>${holdingsValue.toFixed(2)}</TableCell>

          <TableCell />

          <TableCell className={ percentage < 0 ? "text-red-500" : "text-green-500" }>
            {percentage.toFixed(2)}%
          </TableCell>

          <TableCell />

          <TableCell className="text-right">Total</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    </div>
  );
}
