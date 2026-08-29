"use client";
import { Stock } from "@/types/stocks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginationIconsOnly } from "@/components/pagination-icons-only";
import { StockList, StockListSkeleton } from "./stock-list";
import { getStocks } from "@/services/stocks";
import { StockSearch } from "./stock-search";

function StocksPageContent() {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("query") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const outputSize = parseInt(searchParams.get("outputsize") || "25", 10);

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      try {
        const { data, count } = await getStocks(
          searchQuery,
          currentPage,
          outputSize,
        );
        setStocks(data);
        setTotalCount(count);
      } catch (error) {
        console.error("Failed to load stocks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, [searchQuery, currentPage, outputSize]);

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-6 p-6 md:p-10">
      <StockSearch results={totalCount} />
      <ScrollArea className="min-h-0 w-full flex-1 rounded-md border p-4">
        {loading ? <StockListSkeleton /> : <StockList stocks={stocks} />}
      </ScrollArea>
      <PaginationIconsOnly
        page={currentPage}
        outputsize={outputSize}
        totalCount={totalCount}
      />
    </div>
  );
}

export default function StocksPage() {
  return (
    <Suspense fallback={<StockListSkeleton />}>
      <StocksPageContent />
    </Suspense>
  );
}
