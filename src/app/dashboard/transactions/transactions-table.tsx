import { Transaction } from "@/types/transactions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TransactionsTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Table>
      <TableCaption>A list of your transactions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.type}</TableCell>
            <TableCell>
              {transaction.executedAt.toISOString().split("T")[0]}
            </TableCell>
            <TableCell>{transaction.stock.name}</TableCell>
            <TableCell>{Number(transaction.quantity).toFixed(0)}</TableCell>
            <TableCell className="text-right">
              {Number(transaction.price).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
