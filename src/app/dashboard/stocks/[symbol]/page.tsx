import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { StockDetails } from "./stock-details";
import { getQuote, getStockBySymbol, getTimeSeries } from "@/services/stocks";
import { getPortfoliosWithHoldings } from "@/services/portfolios";

async function getStockData(symbol: string) {
  const [stock, timeseriesData, quoteData] = await Promise.all([
    getStockBySymbol(symbol),
    getTimeSeries(symbol),
    getQuote(symbol),
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

  const portfolios = await getPortfoliosWithHoldings();

  const holdings = portfolios.flatMap((portfolio) => portfolio.holdings);

  const isHoldingStock = holdings.some((holding) => holding.stockId === stock.id);

  return (
    <div className="h-full flex-col items-center gap-6 p-6 md:p-10">
      <p>{isHoldingStock ? "You are holding this stock." : "You are not holding this stock."}</p>
      <ChartAreaInteractive stock={stock} values={timeseriesData.values} />
      <StockDetails quote={quoteData} stockId={stock.id} />
    </div>
  );
}
