import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { StockLogoSkeleton } from "@/components/stock-logo";

export function ChartAreaInteractiveSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <StockLogoSkeleton />
        <div className="grid flex-1 gap-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="h-62.5 w-full" />
      </CardContent>
    </Card>
  );
}

export function StockDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>

      <CardContent>
        <Skeleton className="mb-1 h-5 w-32" />
        <Skeleton className="mb-1 h-5 w-40" />
        <Skeleton className="mb-1 h-5 w-48" />
        <Skeleton className="mb-1 h-5 w-48" />
        <Skeleton className="mb-1 h-5 w-52" />
        <Skeleton className="h-5 w-52" />
      </CardContent>

      <CardFooter className="gap-2">
        <Skeleton className="h-10 w-full" />

        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 p-6 md:p-10">
      <ChartAreaInteractiveSkeleton />
      <StockDetailsSkeleton />
    </div>
  );
}

