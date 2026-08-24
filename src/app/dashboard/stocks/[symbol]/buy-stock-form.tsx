"use client";

import { buyStockAction } from "@/actions/stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quote } from "@/types/stock";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Stock, PortfolioWithHoldings } from "@/types/stock";

export function BuyStockForm({
  quote,
  portfolios,
  stock,
  setOpen,
}: {
  quote: Quote;
  portfolios: PortfolioWithHoldings[];
  stock: Stock;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(buyStockAction, {
    error: "",
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      toast.success("Stock purchased successfully");
      router.refresh();
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, setOpen]);

  const [quantity, setQuantity] = useState(0);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="stockId" value={stock.id} />
      <input type="hidden" name="price" value={quote.c} />
      <input type="hidden" name="symbol" value={stock.symbol} />

      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Select name="portfolioId" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a portfolio" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Portfolios</SelectLabel>
              {portfolios.map((portfolio) => {
                const owned = portfolio.holdings
                  .filter((holding) => holding.stockId === stock.id)
                  .reduce((acc, holding) => acc + Number(holding.quantity), 0);

                return (
                  <SelectItem key={portfolio.id} value={portfolio.id}>
                    <div className="flex flex-col">
                      <span>{portfolio.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {owned} shares owned · $
                        {Number(portfolio.cashBalance).toFixed(2)} available
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          required
          defaultValue="0"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Label htmlFor="Sum">Sum</Label>
        <Input id="sum" readOnly={true} value={Number(quote.c) * quantity} />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Buying..." : "Buy"}
      </Button>
    </form>
  );
}
