import { Quote } from "@/types/stock";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StockForm } from "./stock-form";
export function StockDetails({ quote, stockId}: { quote: Quote, stockId: number }) {
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
        <CardTitle>${quote.c.toFixed(2)}</CardTitle>
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
          Percent Change: {quote.dp.toPrecision(2)}%
        </CardDescription>
        <CardDescription>High price of the day: {quote.h}</CardDescription>
        <CardDescription>Low price of the day: {quote.l}</CardDescription>
        <CardDescription>Open price of the day: {quote.o}</CardDescription>
        <CardDescription>Previous close price: {quote.pc}</CardDescription>
      </CardContent>
      <CardFooter>
        <StockForm quote={quote} portfolioId={1} stockId={stockId}/>
      </CardFooter>
    </Card>
  );
}
