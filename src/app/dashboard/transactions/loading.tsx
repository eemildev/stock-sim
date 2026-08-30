import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TransactionsTableSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-6 w-32" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-4 w-12" />
            </TableHead>

            <TableHead>
              <Skeleton className="h-4 w-12" />
            </TableHead>

            <TableHead>
              <Skeleton className="h-4 w-14" />
            </TableHead>

            <TableHead>
              <Skeleton className="h-4 w-16" />
            </TableHead>

            <TableHead className="text-right">
              <Skeleton className="ml-auto h-4 w-12" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 6 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-14" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>

              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 p-6 md:p-10">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <TransactionsTableSkeleton />
    </div>
  );
}
