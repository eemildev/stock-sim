import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel, Field } from "./ui/field";
import { PortfolioWithHoldings, Stock } from "@/types/stock";

export function SelectPortfolio({
  portfolios,
  stock,
}: {
  portfolios: PortfolioWithHoldings[];
  stock: Stock | undefined;
}) {
  function getOwnedQuantity(
    portfolio: PortfolioWithHoldings,
    stockId?: string | null | number,
  ): number {
    if (!stockId) return 0;
    return portfolio.holdings
      .filter((h) => String(h.stockId) === String(stockId))
      .reduce((sum, h) => sum + Number(h.quantity), 0);
  }

  const items = portfolios.map((portfolio) => {
    const owned = getOwnedQuantity(portfolio, stock?.id);
    const balance = Number(portfolio.cashBalance).toFixed(2);

    return {
      value: String(portfolio.id),
      label: (
        <div className="flex flex-col items-start text-left">
          <span className="font-medium">{portfolio.name}</span>
          <span className="text-xs text-muted-foreground">
            Balance: ${balance} USD
            {stock && owned > 0 && ` · Owned: ${owned}`}
          </span>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-2">
      <Field>
        <FieldLabel>Portfolio</FieldLabel>
        <Select name="portfolioId" required items={items}>
          <SelectTrigger className="w-full min-h-12.5 py-2.5 text-left">
            <SelectValue placeholder="Select a portfolio" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Portfolios</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
