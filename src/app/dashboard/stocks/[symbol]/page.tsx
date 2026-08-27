import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { StockDetails } from "./stock-details";
import { getQuote, getStockBySymbol, getTimeSeries } from "@/services/stocks";
import { getPortfoliosWithHoldings } from "@/services/portfolios";
import { StockCheckout } from "./stock-checkout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers"

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
     const session = await auth.api.getSession({
       headers: await headers(),
     });
    
    if(!session) {
        return <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">Not authenticated</div>
    }
    
  const { symbol } = await params;

  if (!symbol) {
    return <div>Symbol not provided</div>;
  }

  const data = await getStockData(symbol);

  if (!data.timeseriesData || !data.quoteData || !data.stock) {
    return <div>Failed to load stock data for {symbol}.</div>;
  }

  const { timeseriesData, quoteData, stock } = data;

  const portfolios = await getPortfoliosWithHoldings(session.user.id);

  return (
    <div className="h-full flex-col items-center gap-6 p-6 md:p-10">
      <ChartAreaInteractive stock={stock} values={timeseriesData.values} />
      <StockDetails quote={quoteData} stockId={stock.id} />
      <StockCheckout
        quote={quoteData}
        stock={stock}
        portfolios={portfolios}
        mode="buy"
      />
      <StockCheckout
        quote={quoteData}
        stock={stock}
        portfolios={portfolios}
        mode="sell"
      />
    </div>
  );
}
