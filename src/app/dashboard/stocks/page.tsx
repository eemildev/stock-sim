"use client";
import { Stock } from "@/types/stock";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginationIconsOnly } from "@/components/pagination-icons-only";
import { StockList, StockListSkeleton } from "./stock-list";

export default function StocksPage() {
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const outputSize = parseInt(searchParams.get("outputsize") || "25", 10);

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/stocks?page=${currentPage}&outputsize=${outputSize}`,
        );
        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load stocks:", data.error);
          return;
        }

        // Handles both plain array responses and objects with { data, count }
        if (Array.isArray(data)) {
          setStocks(data);
        } else if (data && Array.isArray(data.data)) {
          setStocks(data.data);
          if (data.count) setTotalCount(data.count);
        }
      } catch (error) {
        console.error("Failed to load stocks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, [currentPage, outputSize]); 

return (
<div className="flex h-full flex-col items-center gap-6 overflow-hidden p-6 md:p-10">
    <ScrollArea className="min-h-0 w-full max-w-2xl flex-1 rounded-md border p-4">
    {loading ? (
      <StockListSkeleton />
    ) : (
      <StockList stocks={stocks} />
    )}
    </ScrollArea>

    <PaginationIconsOnly
      page={currentPage}
      outputsize={outputSize}
      totalCount={totalCount}
    />
  </div>
);
}
