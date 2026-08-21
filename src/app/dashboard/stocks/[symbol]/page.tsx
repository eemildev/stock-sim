import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { StockDetails } from "./stock-details";
import { getStockBySymbol } from "@/services/stocks";

async function getStockData(symbol: string) {

  const stock = await getStockBySymbol(symbol);

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

  const [timeSeriesResponse, quoteResponse] = await Promise.all([
    fetch(`${baseUrl}/api/stocks/${encodeURIComponent(symbol)}/time_series`, {
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/stocks/${encodeURIComponent(symbol)}/quote`, {
      cache: "no-store",
    }),
  ]);

  const [timeseriesData, quoteData] = await Promise.all([
    timeSeriesResponse.json(),
    quoteResponse.json(),
  ]);

  return { timeseriesData, quoteData, stock };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  if (!symbol) {
    return <div>Symbol not provided</div>;
  }

  const data = await getStockData(symbol);

  if (!data.timeseriesData || !data.quoteData || !data.stock) {
    return <div>Failed to load stock data for {symbol}.</div>;
  }

  const { timeseriesData, quoteData, stock } = data;

  return (
    <div className="h-full flex-col items-center gap-6 p-6 md:p-10">
      <ChartAreaInteractive stock={stock} values={timeseriesData.values} />
      <StockDetails quote={quoteData} />
    </div>
  );
}
