"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Button } from "@/components/ui/button";
import { TimeSeries} from "@/types/stock";

export default function StockPage() {
  const params = useParams();
  const symbol = params.symbol as string;


  const [timeseries, setTimeseries] = useState<TimeSeries | null>(null);
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
        if (response.ok) setTimeseries(data);

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
  if (!timeseries)
    return <div className="p-10 text-center">No stock data available.</div>;

  return (
    <div className="h-full flex-col items-center gap-6 p-6 md:p-10">
      <ChartAreaInteractive values={timeseries.values} />
      <h1>
        {timeseries.meta.symbol}
      </h1>
   <p>Price: ${timeseries.values[0].close || 0}</p>
      <p>Exchange: {timeseries.meta.exchange}</p>
      
      <form>
        <Button size="lg">Buy</Button>
      </form>
       <form>
        <Button size="lg">Sell</Button>
      </form>
    </div>
  );
}
