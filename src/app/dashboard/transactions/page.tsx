import { getPortfoliosWithTransactions } from "@/services/portfolios";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export default async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <p className="text-muted-foreground">Not authenticated</p>
      </div>
    );
  }

  const portfolios = await getPortfoliosWithTransactions();

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 p-6 md:p-10">
      {portfolios.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
          <Wallet className="size-8" />
          <p>No portfolios yet</p>
        </div>
      )}

      {portfolios.map((portfolio) => {
        const isBuy = (type: string) => type.toLowerCase() === "buy";

        return (
          <Card key={portfolio.id}>
            <CardHeader>
              <CardTitle>{portfolio.name}</CardTitle>
              <CardDescription>
                {portfolio.transactions.length} transaction
                {portfolio.transactions.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-col gap-2 pt-6">
              {portfolio.transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No transactions yet.
                </p>
              ) : (
                portfolio.transactions.map((transaction) => {
                  const buy = isBuy(transaction.type);
                  const quantity = Number(transaction.quantity);
                  const price = Number(transaction.price);

                  return (
                    <Item variant="outline" key={transaction.id}>
                      <ItemContent>
                        <ItemTitle className="flex items-center gap-2">
                          <Badge variant={buy ? "default" : "destructive"}>
                            {transaction.type}
                          </Badge>
                        </ItemTitle>
                        <ItemDescription>
                          quantity: {quantity.toFixed(0)}
                        </ItemDescription>
                        <ItemDescription>
                          date: {transaction.executedAt.toLocaleDateString()}
                        </ItemDescription>
                      </ItemContent>

                      <div className="text-right text-sm font-medium tabular-nums">
                        ${(quantity * price).toFixed(2)}
                      </div>
                    </Item>
                  );
                })
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}