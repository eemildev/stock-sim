import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPortfoliosByUserId } from "@/services/portfolios";

type PortfolioListProps = {
  userId: string;
};

export async function PortfolioList({ userId }: PortfolioListProps) {
  const portfolios = await getPortfoliosByUserId(userId);

  if (portfolios.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any portfolios yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {portfolios.map((portfolio) => (
        <Card key={portfolio.id}>
          <CardHeader>
            <CardTitle>{portfolio.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Cash balance
              </span>

              <span className="font-medium">
                {Number(portfolio.cashBalance).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}