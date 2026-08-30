import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Stock } from "@/types/stocks";
import Link from "next/link";
import { StockLogo, StockLogoSkeleton } from "@/components/stock-logo";

export function StockListSkeleton({ count = 25 }: { count?: number }) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Item variant="outline" className="w-full" key={i}>
          <StockLogoSkeleton />

          <ItemContent>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-16" />
          </ItemContent>

          <ItemContent className="flex flex-col items-end">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </ItemContent>
        </Item>
      ))}
    </ul>
  );
}

export function StockList({ stocks }: { stocks: Stock[] }) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {stocks.map((stock, index) => (
        <Link
          key={`${stock.symbol}-${stock.exchange}-${index}`}
          href={`/dashboard/stocks/${encodeURIComponent(stock.symbol)}`}
        >
          <Item variant="outline" className="w-full">
            <StockLogo symbol={stock.symbol} />

            <ItemContent>
              <ItemTitle>{stock.name}</ItemTitle>
              <ItemDescription>{stock.symbol}</ItemDescription>
            </ItemContent>

            <ItemContent className="flex flex-col items-end">
              <ItemDescription>{stock.exchange}</ItemDescription>
              <ItemDescription>{stock.country}</ItemDescription>
            </ItemContent>
          </Item>
        </Link>
      ))}
    </ul>
  );
}
