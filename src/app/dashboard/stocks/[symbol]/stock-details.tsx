import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StockCheckout } from "@/app/dashboard/stocks/[symbol]/stock-checkout";
import { Quote, Stock } from "@/types/stocks";
import { PortfolioWithHoldings } from "@/types/portfolios";
export function StockDetails({ quote, stock, portfolios }: { quote: Quote, stockId: number, stock: Stock, portfolios: PortfolioWithHoldings[] }) {
  if (
    !quote.c ||
    !quote.d ||
    !quote.dp ||
    !quote.h ||
    !quote.l ||
    !quote.o ||
    !quote.pc
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock details not available.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>${quote.c}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription
          className={quote.d > 0 ? "text-green-500" : "text-red-500"}
        >
          Change: ${quote.d.toFixed(2)}
        </CardDescription>
        <CardDescription
          className={quote.dp > 0 ? "text-green-500" : "text-red-500"}
        >
          Percent Change: {quote.dp.toPrecision(3)}%
        </CardDescription>
        <CardDescription>High price of the day: {quote.h}</CardDescription>
        <CardDescription>Low price of the day: {quote.l}</CardDescription>
        <CardDescription>Open price of the day: {quote.o}</CardDescription>
        <CardDescription>Previous close price: {quote.pc}</CardDescription>
      </CardContent>
      <CardFooter>
          <StockCheckout
                  quote={quote}
                  stock={stock}
                  portfolios={portfolios}
                  mode="buy"
                />
                <StockCheckout
                  quote={quote}
                  stock={stock}
                  portfolios={portfolios}
                  mode="sell"
                />
      </CardFooter>
    </Card>
  );
}
