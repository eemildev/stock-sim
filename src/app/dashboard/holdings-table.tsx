import { Quote, } from "@/types/stocks";
import { HoldingWithStock } from "@/types/holdings";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function HoldingsTable({
  holdingsWithQuotes,
}: {
  holdingsWithQuotes: {
    holding: HoldingWithStock;
    quote: Quote;
  }[];
}) {
  return (
    <Table>
      <TableCaption>A list of your holdings</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Value</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdingsWithQuotes.map(({ holding, quote }) => (
          <TableRow key={holding.id}>
            <TableCell className="font-medium">
              {(Number(holding.quantity) * quote?.c).toFixed(2)}
            </TableCell>
            <TableCell>{holding.stock.name}</TableCell>
            <TableCell>{Number(holding.quantity).toFixed(0)}</TableCell>
            <TableCell className="text-right">{quote?.c}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
