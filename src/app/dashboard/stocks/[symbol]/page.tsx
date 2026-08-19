"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface FiftyTwoWeekStats {
  low: string;
  high: string;
  low_change: string;
  high_change: string;
  low_change_percent: string;
  high_change_percent: string;
  range: string;
}

export type Stock = {
  symbol: string;
  name: string;
  exchange: string;
  mic_code: string;
  currency: string;
  datetime: string;
  timestamp: number;
  last_quote_at: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  previous_close: string;
  change: string;
  percent_change: string;
  average_volume: string;
  rolling_1d_change: string;
  rolling_7d_change: string;
  rolling_change: string;
  is_market_open: boolean;
  fifty_two_week: FiftyTwoWeekStats;
  extended_change: string;
  extended_percent_change: string;
  extended_price: string;
  extended_timestamp: number;
};

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;


  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStock() {
      if (!symbol) return;
      setLoading(true);
      try {
        const response = await fetch(
          `/api/stocks/${encodeURIComponent(symbol)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load stock:", data.error);
        }
        if (response.ok) setStock(data);

      } catch (err) {
        console.error("Failed to load stock:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStock();
  }, [symbol]);

  if (loading)
    return <div className="p-10 text-center">Loading stock data...</div>;
  if (!stock)
    return <div className="p-10 text-center">No stock data available.</div>;

  return (
    <main className="flex min-h-svh flex-col items-center bg-muted justify-center gap-6 p-6 md:p-10">
      <h1>
        {stock.name} ({stock.symbol})
      </h1>
      <p>Price: ${stock.close}</p>
      <p>Exchange: {stock.exchange}</p>
      <p>
        Change: {stock.change} ({stock.percent_change}%)
      </p>
    </main>
  );
}
