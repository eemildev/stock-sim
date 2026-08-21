import { Quote } from "@/types/stock";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function StockDetails({ quote }: { quote: Quote }) {
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
        <form action={/* buyAction */ undefined}>
          <Button size="lg" type="submit">
            Buy
          </Button>
        </form>
        <form action={/* sellAction */ undefined}>
          <Button
            className=" bg-red-500 hover:bg-red-600"
            size="lg"
            type="submit"
          >
            Sell
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
