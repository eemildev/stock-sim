"use client";

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
import { Stock } from "@/types/stocks";
import { PortfolioWithHoldings, Portfolio } from "@/types/portfolios";


export function SelectPortfolio({
  portfolios,
  stock,
  selectedPortfolioId,
  handlePortfolioChange,
}: {
  portfolios: Portfolio[] | PortfolioWithHoldings[];
  stock?: Stock | undefined;
  selectedPortfolioId?: string;
  handlePortfolioChange?: (portfolioId: string | null) => void;
}) {
  function getOwnedQuantity(
    portfolio: Portfolio | PortfolioWithHoldings,
    stockId?: string | null | number,
  ): number {
    if (!stockId || !("holdings" in portfolio)) return 0;

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

        <Select
          name="portfolioId"
          value={selectedPortfolioId}
          onValueChange={handlePortfolioChange}
          items={items}
        >
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
