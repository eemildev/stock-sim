"use client";

import { buyStockAction } from "@/actions/stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Quote } from "@/types/stock";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function StockForm({
  quote,
  portfolioId,
  stockId,
}: {
  quote: Quote;
  portfolioId: number;
  stockId: number;
}) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(buyStockAction, {
    error: "",
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Stock purchased successfully");
      router.replace("/dashboard");
      router.refresh();
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="portfolioId" value={portfolioId} />

      <input type="hidden" name="stockId" value={stockId} />

      <input type="hidden" name="price" value={quote.c} />

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>

        <Input
          id="quantity"
          name="quantity"
          type="number"
          min="1"
          step="1"
          required
          placeholder="10"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Buying..." : "Buy"}
      </Button>
    </form>
  );
}
