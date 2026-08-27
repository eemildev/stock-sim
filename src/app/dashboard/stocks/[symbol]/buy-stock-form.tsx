"use client";

import { buyStockAction } from "@/actions/trade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Quote } from "@/types/stocks";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Stock } from "@/types/stocks";
import { PortfolioWithHoldings } from "@/types/portfolios";
import { Field, FieldLabel } from "@/components/ui/field";
import { SelectPortfolio } from "@/components/select-portfolio";

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
        <SelectPortfolio portfolios={portfolios} stock={stock} />

        <Field>
          <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            required
            defaultValue="0"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="Sum">Sum</FieldLabel>
          <Input id="sum" readOnly={true} value={Number(quote.c) * quantity} />
        </Field>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Buying..." : "Buy"}
      </Button>
    </form>
  );
}
